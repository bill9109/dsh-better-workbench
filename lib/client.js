window.__ModuleLoader__.load({
	id: "dsh-better-workbench",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/storage.ts
		const LEGACY_KEYS = [
			"dsh-better-workbench.state.v3",
			"dsh-better-workbench.state.v2",
			"dsh-better-workbench.instances.v1"
		];
		const peers = /* @__PURE__ */ new Set();
		const origin = Math.random().toString(36).slice(2);
		function emptyState() {
			return {
				instances: [],
				dismissedDefaultAppIds: [],
				backups: []
			};
		}
		function isRecord(value) {
			return typeof value === "object" && value !== null && !Array.isArray(value);
		}
		function assertSynchronous(value) {
			if ((typeof value === "object" && value !== null || typeof value === "function") && typeof value.then === "function") {
				Promise.resolve(value).catch(() => {});
				throw new TypeError("Repository transaction callbacks must be synchronous");
			}
		}
		function assertState(value) {
			if (!isRecord(value) || !Array.isArray(value.instances) || !Array.isArray(value.dismissedDefaultAppIds) || !Array.isArray(value.backups) || !value.dismissedDefaultAppIds.every((id) => typeof id === "string")) throw new Error("Invalid workbench repository state");
			const ids = /* @__PURE__ */ new Set();
			for (const item of value.instances) {
				if (!isRecord(item) || typeof item.instanceId !== "string" || !item.instanceId.trim() || typeof item.appId !== "string" || !item.appId.trim() || typeof item.title !== "string" || !isRecord(item.config) || !Number.isSafeInteger(item.configVersion) || Number(item.configVersion) < 1 || !Number.isSafeInteger(item.revision) || Number(item.revision) < 0 || ![
					"order",
					"createdAt",
					"updatedAt",
					"lastOpenedAt"
				].every((key) => typeof item[key] === "number" && Number.isFinite(item[key])) || ids.has(item.instanceId)) throw new Error("Invalid workbench repository instance");
				ids.add(item.instanceId);
			}
			for (const item of value.backups) if (!isRecord(item) || typeof item.instanceId !== "string" || !isRecord(item.config) || !Number.isSafeInteger(item.configVersion) || Number(item.configVersion) < 1 || !Number.isSafeInteger(item.revision) || Number(item.revision) < 0 || typeof item.createdAt !== "number" || !Number.isFinite(item.createdAt)) throw new Error("Invalid workbench configuration backup");
		}
		function notify(listeners) {
			for (const listener of [...listeners]) try {
				listener();
			} catch {}
		}
		function importLegacy(storage) {
			const sources = [];
			for (const key of LEGACY_KEYS) {
				const raw = storage?.getItem(key);
				if (raw !== null && raw !== void 0) sources.push({
					key,
					raw
				});
			}
			if (!sources.length) return {
				state: emptyState(),
				sources
			};
			const source = sources[0];
			let parsed;
			try {
				parsed = JSON.parse(source.raw);
			} catch {
				return {
					state: {
						...emptyState(),
						recovery: {
							sources,
							errors: ["Invalid JSON in " + source.key]
						}
					},
					sources
				};
			}
			const expectedVersion = source.key === LEGACY_KEYS[0] ? 3 : source.key === LEGACY_KEYS[1] ? 2 : 1;
			const legacy = Array.isArray(parsed) && expectedVersion === 1 ? {
				instances: parsed,
				version: 1
			} : parsed;
			if (!isRecord(legacy) || legacy.version !== expectedVersion || !Array.isArray(legacy.instances)) return {
				state: {
					...emptyState(),
					recovery: {
						sources,
						errors: ["Invalid legacy workbench state: " + source.key]
					}
				},
				sources
			};
			const now = Date.now();
			const errors = [];
			const instances = [];
			for (const [index, item] of legacy.instances.entries()) try {
				if (!isRecord(item)) throw new Error("Invalid legacy workbench instance");
				const updatedAt = item.updatedAt ?? now;
				const candidate = {
					instanceId: item.instanceId,
					appId: item.appId,
					title: item.title,
					config: structuredClone(item.config),
					configVersion: item.configVersion ?? 1,
					revision: item.revision ?? 1,
					order: item.order ?? 0,
					createdAt: item.createdAt ?? updatedAt,
					updatedAt,
					lastOpenedAt: item.lastOpenedAt ?? 0
				};
				assertState({
					...emptyState(),
					instances: [...instances, candidate]
				});
				instances.push(candidate);
			} catch (error) {
				errors.push("Record " + (index + 1) + ": " + (error instanceof Error ? error.message : String(error)));
			}
			const dismissed = legacy.dismissedDefaultAppIds ?? [];
			if (!Array.isArray(dismissed) || !dismissed.every((id) => typeof id === "string")) errors.push("Invalid dismissed default application identifiers");
			const state = {
				instances,
				dismissedDefaultAppIds: Array.isArray(dismissed) ? dismissed.filter((id) => typeof id === "string") : [],
				...errors.length ? { recovery: {
					sources,
					errors
				} } : {},
				backups: instances.map((item) => ({
					instanceId: item.instanceId,
					config: structuredClone(item.config),
					configVersion: item.configVersion,
					revision: item.revision,
					createdAt: now
				}))
			};
			assertState(state);
			return {
				state,
				sources
			};
		}
		var IndexedDbRepository = class {
			options;
			dbName;
			listeners = /* @__PURE__ */ new Set();
			database;
			factory;
			channel;
			disposed = false;
			transactions = /* @__PURE__ */ new Set();
			constructor(options = {}) {
				this.options = options;
				this.dbName = options.dbName ?? "dsh-better-workbench";
				peers.add(this);
			}
			async open() {
				if (this.disposed) throw new Error("Workbench repository is disposed");
				if (!this.database) {
					const factory = this.options.indexedDB === void 0 ? globalThis.indexedDB : this.options.indexedDB;
					if (!factory) throw new Error("IndexedDB is unavailable");
					this.factory = factory;
					this.database = new Promise((resolve, reject) => {
						const request = factory.open(this.dbName, 1);
						let failed = false;
						request.onupgradeneeded = () => {
							if (!request.result.objectStoreNames.contains("state")) request.result.createObjectStore("state");
						};
						request.onerror = () => {
							failed = true;
							reject(request.error ?? /* @__PURE__ */ new Error("IndexedDB open failed"));
						};
						request.onblocked = () => {
							failed = true;
							reject(/* @__PURE__ */ new Error("IndexedDB open is blocked"));
						};
						request.onsuccess = () => {
							const db = request.result;
							if (failed || this.disposed) {
								db.close();
								reject(/* @__PURE__ */ new Error("Workbench repository is disposed or database opening failed"));
								return;
							}
							db.onversionchange = () => {
								db.close();
								this.database = void 0;
							};
							resolve(db);
						};
					});
					try {
						await this.database;
						const Channel = this.options.broadcastChannel === void 0 ? globalThis.BroadcastChannel : this.options.broadcastChannel;
						if (Channel && !this.disposed && !this.channel) {
							this.channel = new Channel("dsh-better-workbench:" + this.dbName);
							this.channel.onmessage = (event) => {
								if (isRecord(event.data) && event.data.type === "invalidate" && event.data.origin !== origin) notify(this.listeners);
							};
						}
					} catch (error) {
						const database = this.database;
						this.database = void 0;
						database?.then((db) => db.close(), () => {});
						throw error;
					}
				}
				if (this.disposed) throw new Error("Workbench repository is disposed");
				return this.database;
			}
			invalidate() {
				for (const peer of peers) if (peer.dbName === this.dbName && !peer.disposed && (peer.factory ?? peer.options.indexedDB ?? globalThis.indexedDB) === this.factory) notify(peer.listeners);
				try {
					this.channel?.postMessage({
						type: "invalidate",
						origin
					});
				} catch {}
			}
			async execute(update) {
				const db = await this.open();
				if (this.disposed) throw new Error("Workbench repository is disposed");
				return new Promise((resolve, reject) => {
					const transaction = db.transaction("state", "readwrite");
					this.transactions.add(transaction);
					const store = transaction.objectStore("state");
					let result;
					let failure;
					let changed = false;
					transaction.oncomplete = () => {
						this.transactions.delete(transaction);
						if (changed) this.invalidate();
						resolve(result);
					};
					transaction.onabort = () => {
						this.transactions.delete(transaction);
						reject(failure ?? transaction.error ?? /* @__PURE__ */ new Error("IndexedDB transaction aborted"));
					};
					transaction.onerror = (event) => {
						failure ??= event.target?.error ?? transaction.error ?? /* @__PURE__ */ new Error("IndexedDB transaction failed");
					};
					const request = store.get("main");
					request.onerror = () => {
						failure = request.error ?? /* @__PURE__ */ new Error("IndexedDB read failed");
					};
					request.onsuccess = () => {
						try {
							let state = request.result;
							if (state === void 0) {
								const imported = importLegacy(this.options.localStorage === void 0 ? globalThis.localStorage : this.options.localStorage);
								state = imported.state;
								store.put({
									sources: imported.sources,
									createdAt: Date.now()
								}, "legacy-backup");
								store.put({
									completedAt: Date.now(),
									sourceKeys: imported.sources.map((source) => source.key)
								}, "legacy-import");
								changed = true;
							}
							assertState(state);
							if (update) {
								result = update(state);
								assertSynchronous(result);
								assertState(state);
								changed = true;
							} else result = structuredClone(state);
							if (changed) store.put(state, "main");
						} catch (error) {
							failure = error;
							transaction.abort();
						}
					};
				});
			}
			async read() {
				return await this.execute();
			}
			async transact(update) {
				return await this.execute(update);
			}
			subscribe(listener) {
				if (this.disposed) throw new Error("Workbench repository is disposed");
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			}
			dispose() {
				if (this.disposed) return;
				this.disposed = true;
				peers.delete(this);
				this.listeners.clear();
				this.channel?.close();
				for (const transaction of this.transactions) try {
					transaction.abort();
				} catch {}
				this.database?.then((db) => db.close(), () => {});
			}
		};
		//#endregion
		//#region src/client/service.ts
		const ID_PATTERN = /* @__PURE__ */ new RegExp("^(?:@[a-zA-Z0-9][a-zA-Z0-9._-]*/)?[a-zA-Z0-9][a-zA-Z0-9._:@/-]{0,159}$");
		const ROUTE_KEY = "dsh-better-workbench.navigation.v1";
		const PRESENTATIONS_KEY = "dsh-better-workbench.presentations.v1";
		const message = (error) => error instanceof Error ? error.message : String(error);
		const validId = (id) => {
			if (typeof id !== "string" || !ID_PATTERN.test(id)) throw new Error("Invalid workbench identifier: " + String(id));
		};
		function cloneConfig(value) {
			const seen = /* @__PURE__ */ new Set();
			const copy = (item) => {
				if (item === null || typeof item === "string" || typeof item === "boolean") return item;
				if (typeof item === "number" && Number.isFinite(item)) return item;
				if (typeof item !== "object") throw new Error("Configuration must contain JSON values only");
				if (seen.has(item)) throw new Error("Configuration cannot contain cycles");
				if (!Array.isArray(item) && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) throw new Error("Configuration must contain plain JSON objects");
				seen.add(item);
				try {
					if (Array.isArray(item)) return Array.from(item, copy);
					return Object.fromEntries(Object.entries(item).map(([key, entry]) => [key, copy(entry)]));
				} finally {
					seen.delete(item);
				}
			};
			if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Configuration must be a JSON object");
			return copy(value);
		}
		function freezeConfig(config) {
			const freeze = (value) => {
				if (value && typeof value === "object") {
					for (const item of Object.values(value)) freeze(item);
					Object.freeze(value);
				}
			};
			const owned = cloneConfig(config);
			freeze(owned);
			return owned;
		}
		function ownApp(definition) {
			return Object.freeze({
				...definition,
				config: Object.freeze({ ...definition.config }),
				presentations: Object.freeze(definition.presentations.map((item) => Object.freeze({ ...item }))),
				source: definition.source ? Object.freeze({ ...definition.source }) : void 0,
				defaultInstance: definition.defaultInstance ? Object.freeze({
					...definition.defaultInstance,
					config: definition.defaultInstance.config ? freezeConfig(definition.defaultInstance.config) : void 0
				}) : void 0
			});
		}
		function ownTemplate(definition) {
			return Object.freeze(definition.kind === "instance" ? {
				...definition,
				defaultConfig: definition.defaultConfig ? freezeConfig(definition.defaultConfig) : void 0
			} : { ...definition });
		}
		function validateApp(app) {
			validId(app.appId);
			if (app.protocolVersion !== 1 || !app.title?.trim()) throw new Error("Invalid workbench application definition");
			if (!Number.isSafeInteger(app.config?.version) || app.config.version < 1 || typeof app.config.defaults !== "function" || typeof app.config.validate !== "function") throw new Error("Application requires a versioned configuration contract");
			const config = cloneConfig(app.config.defaults());
			app.config.validate(cloneConfig(config));
			const kinds = /* @__PURE__ */ new Set();
			for (const p of app.presentations) {
				if (kinds.has(p.kind)) throw new Error("Duplicate presentation: " + p.kind);
				kinds.add(p.kind);
				if (p.kind === "page") {
					if (p.conversation !== "exclusive" || !app.renderMain) throw new Error("Page requires renderMain and exclusive conversation");
				} else if (p.kind === "panel") {
					if (!["right", "bottom"].includes(p.placement) || !["push", "overlay"].includes(p.behavior) || p.conversation !== "resident" || !app.renderPanel) throw new Error("Invalid panel presentation");
				} else if (p.kind === "capsule") {
					if (p.placement !== "floating" || p.conversation !== "resident" || !app.renderCapsule) throw new Error("Only floating capsules are supported");
				} else throw new Error("Unknown presentation");
			}
			if (!kinds.has(app.defaultPresentation)) throw new Error("Default presentation must be supported");
			if (app.source) {
				if (typeof app.source.packageName !== "string" || !app.source.packageName.trim() || typeof app.source.version !== "string" || !app.source.version.trim()) throw new Error("Invalid application source");
				if (app.source.repository !== void 0) {
					const url = new URL(app.source.repository);
					if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Invalid application repository URL");
				}
			}
			if (app.defaultInstance?.instanceId) validId(app.defaultInstance.instanceId);
			if (app.defaultInstance?.config) app.config.validate(cloneConfig(app.defaultInstance.config));
		}
		/** Durable transactions and activation-owned registries; no renderer lives in storage. */
		var WorkbenchController = class {
			readiness;
			ownsRepository;
			get ready() {
				return this.readiness;
			}
			repository;
			navigationStorage;
			confirmDiscard;
			apps = /* @__PURE__ */ new Map();
			templates = /* @__PURE__ */ new Map();
			creators = /* @__PURE__ */ new Map();
			state = {
				instances: [],
				dismissedDefaultAppIds: [],
				backups: []
			};
			route = { kind: "conversation" };
			presentations = /* @__PURE__ */ new Map();
			statuses = /* @__PURE__ */ new Map();
			pending = /* @__PURE__ */ new Map();
			dirty = /* @__PURE__ */ new Set();
			listeners = /* @__PURE__ */ new Set();
			loading = true;
			error = null;
			generation = 0;
			active = true;
			tasks = /* @__PURE__ */ new Map();
			teardownTimeoutMs;
			disposal;
			refreshTail = Promise.resolve();
			creation = { status: "idle" };
			creationAbort;
			snapshot;
			unsubscribe;
			constructor(options = {}) {
				this.teardownTimeoutMs = options.teardownTimeoutMs ?? 5e3;
				this.ownsRepository = options.repository === void 0;
				this.repository = options.repository ?? new IndexedDbRepository();
				try {
					this.navigationStorage = options.navigationStorage === null ? void 0 : options.navigationStorage ?? (typeof sessionStorage === "undefined" ? void 0 : sessionStorage);
				} catch {
					this.navigationStorage = void 0;
				}
				this.confirmDiscard = options.confirmDiscard ?? (() => typeof window !== "undefined" && window.confirm("当前工作台有未保存内容，仍要离开吗？"));
				try {
					const raw = this.navigationStorage?.getItem(ROUTE_KEY);
					const saved = raw ? JSON.parse(raw) : void 0;
					if (saved?.kind === "conversation" || saved?.kind === "workbench-home" || saved?.kind === "workbench-instance" && typeof saved.instanceId === "string" && [
						"page",
						"panel",
						"capsule"
					].includes(saved.presentation)) this.route = saved;
					const preferences = this.navigationStorage?.getItem(PRESENTATIONS_KEY);
					const parsed = preferences ? JSON.parse(preferences) : void 0;
					if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
						for (const [id, kind] of Object.entries(parsed)) if (kind === "page" || kind === "panel" || kind === "capsule") this.presentations.set(id, kind);
					}
				} catch {
					this.error = "无法恢复此标签页的导航状态";
				}
				this.publish();
				this.unsubscribe = this.repository.subscribe(() => {
					this.refresh().catch((error) => this.fail(error));
				});
				this.readiness = this.refresh().finally(() => {
					this.loading = false;
					this.publish();
				});
				this.ready.catch((error) => this.fail(error));
			}
			getSnapshot() {
				return this.snapshot;
			}
			subscribe(listener) {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			}
			getApp(id) {
				const app = this.apps.get(id)?.definition;
				return app ? ownApp(app) : void 0;
			}
			getTemplate(id) {
				const template = this.templates.get(id);
				return template ? ownTemplate(template) : void 0;
			}
			track(owner, task) {
				const tasks = this.tasks.get(owner) ?? /* @__PURE__ */ new Set();
				this.tasks.set(owner, tasks);
				tasks.add(task);
				const remove = () => {
					tasks.delete(task);
					if (!tasks.size) this.tasks.delete(owner);
				};
				task.then(remove, remove);
				return task;
			}
			drain(tasks, label) {
				if (!tasks.length) return Promise.resolve();
				let timer;
				const result = Promise.race([Promise.allSettled(tasks).then(() => {}), new Promise((_, reject) => {
					timer = setTimeout(() => reject(/* @__PURE__ */ new Error(label + ": asynchronous teardown timed out")), this.teardownTimeoutMs);
				})]).finally(() => clearTimeout(timer));
				result.catch((error) => console.error("[dsh-better-workbench]", error));
				return result;
			}
			assertActive() {
				if (!this.active) throw new Error("Workbench has been disposed");
			}
			assertGeneration(id, generation) {
				this.assertActive();
				const app = this.apps.get(id);
				if (app?.generation !== generation) throw new Error("Application activation changed; retry using the current application");
				return app.definition;
			}
			require(id, state = this.state) {
				const instance = state.instances.find((item) => item.instanceId === id);
				if (!instance) throw new Error("Unknown workbench instance: " + id);
				return instance;
			}
			fail(error) {
				if (this.active) {
					this.error = message(error);
					this.publish();
				}
			}
			refresh() {
				const task = this.refreshTail.then(() => this.readAndPublish());
				this.refreshTail = task.catch(() => {});
				return task;
			}
			async readAndPublish() {
				if (!this.active) return;
				const state = await this.repository.read();
				if (!this.active) return;
				this.applyState(state);
			}
			applyState(state) {
				this.state = state;
				if (!this.active) return;
				for (const instance of state.instances) {
					const entry = this.apps.get(instance.appId);
					const status = this.statuses.get(instance.instanceId);
					if (!entry || instance.configVersion !== entry.definition.config.version || status?.revision === instance.revision && status.generation === entry.generation) continue;
					try {
						entry.definition.config.validate(cloneConfig(instance.config));
						this.statuses.set(instance.instanceId, {
							status: "ready",
							revision: instance.revision,
							generation: entry.generation
						});
					} catch (error) {
						this.statuses.set(instance.instanceId, {
							status: "migration-error",
							error: message(error),
							revision: instance.revision,
							generation: entry.generation
						});
					}
				}
				if (this.route.kind === "workbench-instance" && !state.instances.some((i) => i.instanceId === this.route.instanceId)) this.route = { kind: "workbench-home" };
				for (const id of this.dirty) if (!state.instances.some((i) => i.instanceId === id)) this.dirty.delete(id);
				this.publish();
				if (this.route.kind === "workbench-instance") this.prepareInstance(this.route.instanceId).catch((error) => this.fail(error));
			}
			async retry() {
				this.assertActive();
				this.error = null;
				this.loading = true;
				for (const [id, status] of this.statuses) if (status.status === "migration-error") this.statuses.delete(id);
				this.publish();
				this.readiness = (async () => {
					try {
						await this.refresh();
						for (const id of this.apps.keys()) await this.ensureDefault(id);
						if (this.route.kind === "workbench-instance") await this.prepareInstance(this.route.instanceId);
					} catch (error) {
						this.fail(error);
						throw error;
					} finally {
						this.loading = false;
						this.publish();
					}
				})();
				return this.readiness;
			}
			mutate(operation) {
				const task = this.refreshTail.then(async () => {
					this.assertActive();
					const committed = await this.repository.transact((state) => {
						this.assertActive();
						return {
							result: operation(state),
							state: structuredClone(state)
						};
					});
					this.error = null;
					this.applyState(committed.state);
					return committed.result;
				});
				this.refreshTail = task.then(() => {}, () => {});
				return task.catch((error) => {
					this.fail(error);
					throw error;
				});
			}
			registerApp(definition) {
				this.assertActive();
				validateApp(definition);
				if (this.apps.has(definition.appId)) throw new Error("Application already registered: " + definition.appId);
				const id = definition.appId;
				const entry = {
					definition: ownApp(definition),
					generation: ++this.generation,
					abort: new AbortController()
				};
				this.apps.set(id, entry);
				this.publish();
				this.ready.then(() => this.ensureDefault(id, entry.generation)).then(() => {
					if (this.route.kind === "workbench-instance") return this.prepareInstance(this.route.instanceId);
				}).catch((error) => {
					if (this.apps.get(id) === entry) this.fail(error);
				});
				let unloading;
				return () => {
					if (this.apps.get(id) !== entry) return unloading ?? Promise.resolve();
					this.apps.delete(id);
					entry.abort.abort();
					for (const instance of this.state.instances.filter((i) => i.appId === id)) {
						this.statuses.delete(instance.instanceId);
						this.pending.delete(instance.instanceId);
						this.dirty.delete(instance.instanceId);
					}
					this.publish();
					return unloading = this.drain([...this.tasks.get(entry) ?? []], "Application " + id);
				};
			}
			async ensureDefault(appId, expectedGeneration) {
				const entry = this.apps.get(appId);
				if (!entry || expectedGeneration !== void 0 && entry.generation !== expectedGeneration) return;
				const app = entry.definition;
				if (!app.defaultInstance) return;
				await this.mutate((state) => {
					this.assertGeneration(appId, entry.generation);
					if (state.dismissedDefaultAppIds.includes(appId) || state.instances.some((i) => i.appId === appId)) return;
					const id = app.defaultInstance.instanceId ?? crypto.randomUUID();
					if (state.instances.some((i) => i.instanceId === id)) throw new Error("Default instance identifier collision");
					state.instances.push(this.newInstance(app, id, app.defaultInstance.title, app.defaultInstance.config, state.instances.length));
				});
			}
			newInstance(app, id, title, config, order) {
				const owned = cloneConfig(config ?? app.config.defaults());
				app.config.validate(cloneConfig(owned));
				const now = Date.now();
				return {
					instanceId: id,
					appId: app.appId,
					title: title?.trim() || app.title,
					config: owned,
					configVersion: app.config.version,
					revision: 1,
					order,
					createdAt: now,
					updatedAt: now,
					lastOpenedAt: 0
				};
			}
			registerTemplate(definition) {
				this.assertActive();
				validId(definition.templateId);
				if (!definition.title?.trim() || this.templates.has(definition.templateId)) throw new Error("Invalid or duplicate template");
				if (definition.kind === "instance") {
					validId(definition.appId);
					if (definition.defaultConfig) cloneConfig(definition.defaultConfig);
				} else if (definition.kind === "agent") validId(definition.creatorId);
				else throw new Error("Unknown template kind");
				const id = definition.templateId;
				const owned = ownTemplate(definition);
				this.templates.set(id, owned);
				this.publish();
				return () => {
					if (this.templates.get(id) === owned) {
						this.templates.delete(id);
						if (this.creation.templateId === id) this.cancelCreation();
						this.publish();
					}
				};
			}
			registerCreator(definition) {
				this.assertActive();
				validId(definition.creatorId);
				if (typeof definition.start !== "function" || this.creators.has(definition.creatorId)) throw new Error("Invalid or duplicate creator");
				const id = definition.creatorId;
				const owned = Object.freeze({ ...definition });
				this.creators.set(id, owned);
				this.publish();
				let unloading;
				return () => {
					if (this.creators.get(id) === owned) {
						this.creators.delete(id);
						const template = this.creation.templateId ? this.templates.get(this.creation.templateId) : void 0;
						if (template?.kind === "agent" && template.creatorId === id) this.cancelCreation();
						this.publish();
						unloading = this.drain([...this.tasks.get(owned) ?? []], "Creator " + id);
					}
					return unloading ?? Promise.resolve();
				};
			}
			async createInstance(appId, title, config) {
				return this.createCheckedInstance(appId, title, config);
			}
			async createCheckedInstance(appId, title, config, check) {
				await this.ready;
				this.assertActive();
				check?.();
				const entry = this.apps.get(appId);
				if (!entry) throw new Error("Application unavailable: " + appId);
				const id = await this.mutate((state) => {
					check?.();
					const app = this.assertGeneration(appId, entry.generation);
					const existing = state.instances.find((i) => i.appId === appId);
					if (!app.allowMultiple && existing) return existing.instanceId;
					const instance = this.newInstance(app, crypto.randomUUID(), title, config, state.instances.length);
					state.instances.push(instance);
					return instance.instanceId;
				});
				await this.prepareInstance(id);
				return this.publicInstance(this.require(id));
			}
			async startCreation(templateId) {
				this.assertActive();
				if (this.creation.status === "creating") throw new Error("A creation is already in progress");
				const template = this.templates.get(templateId);
				if (!template) throw new Error("Template unavailable");
				const abort = new AbortController();
				this.creationAbort = abort;
				this.creation = {
					status: "creating",
					templateId
				};
				this.publish();
				try {
					let result;
					if (template.kind === "instance") result = { instanceId: (await this.createCheckedInstance(template.appId, template.defaultTitle, template.defaultConfig, () => {
						if (abort.signal.aborted || this.creationAbort !== abort || this.templates.get(templateId) !== template) throw new Error("Creation cancelled");
					})).instanceId };
					else {
						const creator = this.creators.get(template.creatorId);
						if (!creator) throw new Error("Creator unavailable");
						result = await this.track(creator, creator.start({ ...template }, {
							signal: abort.signal,
							requestId: crypto.randomUUID()
						}));
						if (this.creators.get(template.creatorId) !== creator) throw new Error("Creator activation changed");
					}
					this.assertActive();
					if (abort.signal.aborted || this.creationAbort !== abort) throw new Error("Creation cancelled");
					if (!result || ("instanceId" in result ? typeof result.instanceId !== "string" || !result.instanceId : !("sessionId" in result) || typeof result.sessionId !== "string" || !result.sessionId)) throw new Error("Creator returned an invalid result");
					await this.refresh();
					this.assertActive();
					if (abort.signal.aborted || this.creationAbort !== abort) throw new Error("Creation cancelled");
					if ("instanceId" in result) this.require(result.instanceId);
					this.creation = {
						status: "complete",
						templateId,
						result
					};
					this.publish();
					return result;
				} catch (error) {
					if (this.creationAbort === abort) {
						this.creation = {
							status: abort.signal.aborted ? "cancelled" : "failed",
							templateId,
							error: message(error)
						};
						this.publish();
					}
					throw error;
				}
			}
			cancelCreation() {
				this.creationAbort?.abort();
				this.creationAbort = void 0;
				if (this.creation.status === "creating") {
					this.creation = {
						status: "cancelled",
						templateId: this.creation.templateId
					};
					this.publish();
				}
			}
			async prepareInstance(id) {
				const instance = this.state.instances.find((i) => i.instanceId === id);
				const entry = instance ? this.apps.get(instance.appId) : void 0;
				if (!instance || !entry) return;
				const status = this.statuses.get(id);
				if (status?.revision === instance.revision && status.generation === entry.generation && status.status !== "preparing") return;
				const pending = this.pending.get(id);
				if (pending) return pending;
				const generation = entry.generation, revision = instance.revision;
				const work = async () => {
					this.statuses.set(id, {
						status: "preparing",
						revision,
						generation
					});
					this.publish();
					try {
						const app = this.assertGeneration(instance.appId, generation);
						if (instance.configVersion > app.config.version) throw new Error("Configuration belongs to a newer application version");
						let config = cloneConfig(instance.config);
						if (instance.configVersion < app.config.version) {
							if (!app.config.migrate) throw new Error("Application does not provide a configuration migration");
							config = cloneConfig(await this.track(entry, Promise.resolve().then(() => {
								entry.abort.signal.throwIfAborted();
								return app.config.migrate(config, instance.configVersion, { signal: entry.abort.signal });
							})));
						}
						this.assertGeneration(instance.appId, generation);
						app.config.validate(cloneConfig(config));
						if (instance.configVersion !== app.config.version) await this.mutate((state) => {
							this.assertGeneration(instance.appId, generation);
							const current = this.require(id, state);
							if (current.revision !== revision) throw new Error("Configuration changed during migration; retry");
							state.backups.push({
								instanceId: id,
								config: cloneConfig(current.config),
								configVersion: current.configVersion,
								revision,
								createdAt: Date.now()
							});
							current.config = config;
							current.configVersion = app.config.version;
							current.revision++;
							current.updatedAt = Date.now();
						});
						this.assertGeneration(instance.appId, generation);
						const validatedRevision = revision + (instance.configVersion !== app.config.version ? 1 : 0);
						if (this.require(id).revision === validatedRevision) this.statuses.set(id, {
							status: "ready",
							revision: validatedRevision,
							generation
						});
					} catch (error) {
						if (this.apps.get(instance.appId)?.generation === generation) this.statuses.set(id, {
							status: instance.configVersion > entry.definition.config.version ? "incompatible" : "migration-error",
							error: message(error),
							revision,
							generation
						});
					} finally {
						this.publish();
					}
				};
				const task = Promise.resolve().then(work);
				this.pending.set(id, task);
				try {
					await task;
				} finally {
					if (this.pending.get(id) === task) {
						this.pending.delete(id);
						const current = this.state.instances.find((item) => item.instanceId === id);
						if (this.active && current && this.apps.get(current.appId)?.generation === generation && this.statuses.get(id)?.revision !== current.revision) await this.prepareInstance(id);
					}
				}
			}
			async renameInstance(id, title) {
				if (!title.trim()) throw new Error("Title cannot be empty");
				const revision = this.require(id).revision;
				await this.mutate((state) => {
					const i = this.require(id, state);
					if (i.revision !== revision) throw new Error("Instance changed in another tab");
					i.title = title.trim();
					i.revision++;
					i.updatedAt = Date.now();
				});
			}
			async deleteInstance(id) {
				const revision = this.require(id).revision;
				await this.mutate((state) => {
					const i = this.require(id, state);
					if (i.revision !== revision) throw new Error("Instance changed in another tab");
					state.instances = state.instances.filter((item) => item.instanceId !== id);
					if (!state.instances.some((item) => item.appId === i.appId) && !state.dismissedDefaultAppIds.includes(i.appId)) state.dismissedDefaultAppIds.push(i.appId);
					state.instances.forEach((item, index) => {
						item.order = index;
					});
				});
			}
			async updateInstanceConfig(id, patch, expectedRevision = this.require(id).revision, generation = this.apps.get(this.require(id).appId)?.generation) {
				const instance = this.require(id);
				if (generation === void 0) throw new Error("Application unavailable");
				const app = this.assertGeneration(instance.appId, generation);
				if (instance.configVersion !== app.config.version) throw new Error("Configuration must be migrated before editing");
				const owned = cloneConfig(patch);
				return this.mutate((state) => {
					this.assertGeneration(instance.appId, generation);
					const i = this.require(id, state);
					if (i.revision !== expectedRevision) throw new Error("Configuration conflict: another editor saved changes. Reload before retrying.");
					const config = {
						...i.config,
						...owned
					};
					app.config.validate(cloneConfig(config));
					i.config = config;
					i.revision++;
					i.updatedAt = Date.now();
					return i.revision;
				});
			}
			async exportInstance(id) {
				this.assertActive();
				const state = await this.repository.read();
				this.assertActive();
				const instance = this.require(id, state);
				return {
					instance: {
						...instance,
						config: cloneConfig(instance.config)
					},
					backups: state.backups.filter((backup) => backup.instanceId === id).map((backup) => ({
						...backup,
						config: cloneConfig(backup.config)
					}))
				};
			}
			async restoreBackup(id, backupRevision, expectedRevision) {
				this.assertActive();
				const instance = this.require(id);
				const entry = this.apps.get(instance.appId);
				if (!entry) throw new Error("Application unavailable");
				await this.mutate((state) => {
					const app = this.assertGeneration(instance.appId, entry.generation);
					const current = this.require(id, state);
					if (current.revision !== expectedRevision) throw new Error("Configuration conflict: instance changed before restore");
					const backup = state.backups.find((item) => item.instanceId === id && item.revision === backupRevision);
					if (!backup) throw new Error("Configuration backup not found");
					if (backup.configVersion !== app.config.version) throw new Error("Backup requires a matching application configuration version; install that version before restoring");
					const config = cloneConfig(backup.config);
					app.config.validate(cloneConfig(config));
					state.backups.push({
						instanceId: id,
						config: cloneConfig(current.config),
						configVersion: current.configVersion,
						revision: current.revision,
						createdAt: Date.now()
					});
					current.config = config;
					current.configVersion = backup.configVersion;
					current.revision++;
					current.updatedAt = Date.now();
				});
				this.dirty.delete(id);
				this.publish();
			}
			async reorderInstances(ids) {
				await this.mutate((state) => {
					const map = new Map(state.instances.map((i) => [i.instanceId, i]));
					const next = [];
					for (const id of ids) {
						const i = map.get(id);
						if (i) {
							next.push(i);
							map.delete(id);
						}
					}
					next.push(...map.values());
					next.forEach((i, index) => {
						i.order = index;
					});
					state.instances = next;
				});
			}
			setDirty(id, dirty) {
				if (dirty) this.dirty.add(id);
				else this.dirty.delete(id);
				this.publish();
			}
			navigate(route) {
				if (this.route.kind === "workbench-instance" && (route.kind !== "workbench-instance" || route.instanceId !== this.route.instanceId || route.presentation !== this.route.presentation) && this.dirty.has(this.route.instanceId)) {
					if (!this.confirmDiscard()) return false;
					this.dirty.delete(this.route.instanceId);
				}
				this.route = route;
				try {
					this.navigationStorage?.setItem(ROUTE_KEY, JSON.stringify(route));
				} catch {
					this.error = "无法保存此标签页的导航状态";
				}
				this.publish();
				return true;
			}
			open(id, presentation) {
				this.assertActive();
				const i = this.require(id);
				const app = this.getApp(i.appId);
				const saved = this.presentations.get(id);
				const remembered = saved && (!app || app.presentations.some((item) => item.kind === saved)) ? saved : void 0;
				const kind = presentation ?? remembered ?? app?.defaultPresentation ?? "page";
				if (app && !app.presentations.some((p) => p.kind === kind)) throw new Error("Unsupported presentation");
				if (!this.navigate({
					kind: "workbench-instance",
					instanceId: id,
					presentation: kind
				})) return;
				this.presentations.set(id, kind);
				try {
					this.navigationStorage?.setItem(PRESENTATIONS_KEY, JSON.stringify(Object.fromEntries(this.presentations)));
				} catch {
					this.error = "无法保存此标签页的显示偏好";
					this.publish();
				}
				this.prepareInstance(id).catch((error) => this.fail(error));
				this.mutate((state) => {
					this.require(id, state).lastOpenedAt = Date.now();
				}).catch((error) => this.fail(error));
			}
			openHome(creating = false) {
				this.navigate({
					kind: "workbench-home",
					creating
				});
			}
			openConversation() {
				this.navigate({ kind: "conversation" });
			}
			close() {
				this.openConversation();
			}
			publicInstance(i) {
				const app = this.apps.get(i.appId), state = this.statuses.get(i.instanceId);
				const status = !app ? { status: "unavailable" } : state?.generation === app.generation && state.revision === i.revision ? state : { status: "preparing" };
				return {
					...i,
					config: cloneConfig(i.config),
					available: !!app,
					status: status.status,
					error: "error" in status ? status.error : void 0
				};
			}
			publish() {
				if (!this.active) return;
				this.snapshot = {
					apps: [...this.apps.values()].map(({ definition: a, generation }) => ({
						appId: a.appId,
						title: a.title,
						description: a.description,
						icon: a.icon,
						source: a.source ? { ...a.source } : void 0,
						allowMultiple: a.allowMultiple === true,
						presentations: a.presentations.map((p) => ({ ...p })),
						defaultPresentation: a.defaultPresentation,
						generation
					})),
					instances: [...this.state.instances].sort((a, b) => a.order - b.order).map((i) => this.publicInstance(i)),
					templates: [...this.templates.values()].map((t) => ({
						...ownTemplate(t),
						available: t.kind === "instance" ? this.apps.has(t.appId) : this.creators.has(t.creatorId)
					})),
					route: { ...this.route },
					currentInstanceId: this.route.kind === "workbench-instance" ? this.route.instanceId : null,
					loading: this.loading,
					error: this.error,
					dirtyInstanceIds: [...this.dirty],
					recovery: this.state.recovery ? structuredClone(this.state.recovery) : void 0,
					creation: { ...this.creation }
				};
				for (const listener of [...this.listeners]) try {
					listener();
				} catch (error) {
					console.error("[dsh-better-workbench] subscriber failed", error);
				}
			}
			dispose() {
				if (this.disposal) return this.disposal;
				this.cancelCreation();
				this.active = false;
				this.unsubscribe();
				for (const entry of this.apps.values()) entry.abort.abort();
				if (this.ownsRepository) this.repository.dispose();
				const tasks = [...this.tasks.values()].flatMap((tasks) => [...tasks]);
				tasks.push(this.refreshTail);
				this.listeners.clear();
				this.apps.clear();
				this.templates.clear();
				this.creators.clear();
				return this.disposal = this.drain(tasks, "Workbench");
			}
		};
		//#endregion
		//#region src/client/WorkbenchSidebar.tsx
		function useWorkbenchSnapshot(service) {
			return (0, react.useSyncExternalStore)((listener) => service.subscribe(listener), () => service.getSnapshot(), () => service.getSnapshot());
		}
		function normalize(value) {
			return value.trim().toLocaleLowerCase();
		}
		function requestSidebarExpand() {
			const button = [...document.querySelectorAll("button")].find((item) => item.getAttribute("aria-label") === "展开侧边栏");
			if (button instanceof HTMLButtonElement) button.click();
		}
		function WorkbenchHomeIcon({ className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: "16",
				height: "16",
				className,
				viewBox: "0 0 16 16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				focusable: "false",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M1.5 7.25 8 1.75l6.5 5.5" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M2.75 6.5v8h10.5v-8" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6 14.5V9.25h4v5.25" })
				]
			});
		}
		function WorkbenchHomeRow({ active, onOpen }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "dsh-better-workbench-sidebar-row dsh-better-workbench-sidebar-home",
				"data-active": active,
				onClick: onOpen,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchHomeIcon, { className: "dsh-better-workbench-sidebar-home-icon" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-better-workbench-sidebar-row-label",
					children: "首页"
				})]
			});
		}
		function ViewOptionsMenu({ orderBy, onOrderPick }) {
			const [open, setOpen] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
				open,
				onClose: () => {
					setOpen(false);
				},
				items: [
					{
						type: "label",
						id: "order-by",
						text: "排序方式"
					},
					{
						id: "manual",
						label: "手动排序"
					},
					{
						id: "updated",
						label: "最近使用"
					}
				],
				selectedId: orderBy,
				onSelect: (id) => {
					if (id === "manual" || id === "updated") onOrderPick(id);
					setOpen(false);
				},
				align: "end",
				dense: true,
				portal: true,
				anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: "视图选项",
					side: "bottom",
					delayMs: 500,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dsh-better-workbench-sidebar-icon-button dsh-better-workbench-sidebar-wide-only",
						"aria-label": "视图选项",
						onClick: () => {
							setOpen((value) => !value);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16, {})
					})
				})
			});
		}
		function WorkbenchRow({ instance, compact, active, draggable, dropPosition, busy, canMoveUp, canMoveDown, onMove, onOpen, onRename, onDelete, onDragStart, onDragOver, onDrop, onDragEnd }) {
			const [menuOpen, setMenuOpen] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-better-workbench-sidebar-row",
				"data-active": active,
				"data-menu-open": menuOpen,
				"data-drop-position": dropPosition ?? void 0,
				role: "button",
				tabIndex: compact ? -1 : 0,
				draggable,
				onClick: onOpen,
				onKeyDown: (event) => {
					if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
						event.preventDefault();
						onOpen();
					}
				},
				onDragStart,
				onDragOver,
				onDrop,
				onDragEnd,
				children: [
					compact && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16, { className: "dsh-better-workbench-sidebar-rail-icon" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-better-workbench-sidebar-row-label",
						children: instance.title
					}),
					!compact && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-better-workbench-sidebar-row-actions",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
							open: menuOpen,
							onClose: () => {
								setMenuOpen(false);
							},
							items: [
								{
									id: "rename",
									label: "重命名",
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutline16, {}),
									disabled: busy
								},
								{
									id: "move-up",
									label: "上移",
									disabled: !canMoveUp
								},
								{
									id: "move-down",
									label: "下移",
									disabled: !canMoveDown
								},
								{
									id: "delete",
									label: "删除",
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, {}),
									danger: true,
									disabled: busy
								}
							],
							onSelect: (id) => {
								setMenuOpen(false);
								if (id === "rename") onRename();
								if (id === "delete") onDelete();
								if (id === "move-up" && canMoveUp) onMove(-1);
								if (id === "move-down" && canMoveDown) onMove(1);
							},
							dense: true,
							portal: true,
							closeOnPointerLeave: true,
							anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dsh-better-workbench-sidebar-row-action",
								"aria-label": `工作台“${instance.title}”的操作`,
								title: "更多操作",
								disabled: busy,
								onClick: (event) => {
									event.stopPropagation();
									setMenuOpen((value) => !value);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, {})
							})
						})
					})
				]
			});
		}
		/** Launcher inserted above DSH's workspace/session browser. */
		function WorkbenchSidebar({ service }) {
			const snapshot = useWorkbenchSnapshot(service);
			const section = (0, react.useRef)(null);
			const searchRoot = (0, react.useRef)(null);
			const searchInput = (0, react.useRef)(null);
			const composingRef = (0, react.useRef)(false);
			const [compact, setCompact] = (0, react.useState)(false);
			const [searchExpanded, setSearchExpanded] = (0, react.useState)(false);
			const [query, setQuery] = (0, react.useState)("");
			const [orderBy, setOrderBy] = (0, react.useState)("manual");
			const [draggedId, setDraggedId] = (0, react.useState)(null);
			const [dropTarget, setDropTarget] = (0, react.useState)(null);
			const [renameTarget, setRenameTarget] = (0, react.useState)(null);
			const [renameDraft, setRenameDraft] = (0, react.useState)("");
			const [renaming, setRenaming] = (0, react.useState)(false);
			const [renameError, setRenameError] = (0, react.useState)(null);
			const [deleteTarget, setDeleteTarget] = (0, react.useState)(null);
			const [deleting, setDeleting] = (0, react.useState)(false);
			const [deleteError, setDeleteError] = (0, react.useState)(null);
			const [reordering, setReordering] = (0, react.useState)(false);
			const [reorderError, setReorderError] = (0, react.useState)(null);
			const mutation = (0, react.useRef)(false);
			const lifecycle = (0, react.useRef)({ active: true });
			(0, react.useEffect)(() => {
				const current = { active: true };
				lifecycle.current = current;
				mutation.current = false;
				setRenaming(false);
				setDeleting(false);
				setReordering(false);
				return () => {
					current.active = false;
				};
			}, [service]);
			const busy = snapshot.loading || snapshot.creation.status === "creating" || renaming || deleting || reordering;
			const renameTrimmed = renameDraft.trim();
			const renameBlocked = busy || renameTrimmed === "" || renameTarget === null;
			const normalizedQuery = normalize(query);
			const canReorder = orderBy === "manual" && normalizedQuery === "" && !busy;
			(0, react.useEffect)(() => {
				const element = section.current;
				if (element === null) return;
				const update = () => {
					setCompact(element.clientWidth <= 170);
				};
				update();
				const observer = new ResizeObserver(update);
				observer.observe(element);
				return () => {
					observer.disconnect();
				};
			}, []);
			(0, react.useEffect)(() => {
				if (!compact && searchExpanded) searchInput.current?.focus({ preventScroll: true });
			}, [compact, searchExpanded]);
			(0, react.useEffect)(() => {
				if (compact || !searchExpanded) return;
				const onClick = (event) => {
					if (!(event.target instanceof Node) || searchRoot.current?.contains(event.target) === true) return;
					searchInput.current?.blur();
					if (normalizedQuery === "") setSearchExpanded(false);
				};
				document.addEventListener("click", onClick);
				return () => {
					document.removeEventListener("click", onClick);
				};
			}, [
				compact,
				normalizedQuery,
				searchExpanded
			]);
			const instances = (0, react.useMemo)(() => {
				return [...snapshot.instances.filter((instance) => normalizedQuery === "" || normalize(instance.title).includes(normalizedQuery))].sort((a, b) => orderBy === "updated" ? b.updatedAt - a.updatedAt : a.order - b.order);
			}, [
				normalizedQuery,
				orderBy,
				snapshot.instances
			]);
			const persistOrder = async (ids) => {
				if (!canReorder || mutation.current) return;
				const current = lifecycle.current;
				mutation.current = true;
				setReordering(true);
				setReorderError(null);
				try {
					await service.reorderInstances(ids);
				} catch (reason) {
					if (current.active) setReorderError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					if (current.active) {
						mutation.current = false;
						setReordering(false);
					}
				}
			};
			const moveInstance = (instanceId, direction) => {
				if (!canReorder) return;
				const ids = instances.map((instance) => instance.instanceId);
				const index = ids.indexOf(instanceId);
				const nextIndex = index + direction;
				if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return;
				ids.splice(index, 1);
				ids.splice(nextIndex, 0, instanceId);
				persistOrder(ids);
			};
			const handleDrop = (targetId, event) => {
				event.preventDefault();
				if (!canReorder) {
					setDraggedId(null);
					setDropTarget(null);
					return;
				}
				const sourceId = draggedId ?? event.dataTransfer.getData("text/plain");
				if (sourceId === "" || sourceId === targetId) {
					setDropTarget(null);
					return;
				}
				const target = instances.findIndex((instance) => instance.instanceId === targetId);
				const source = instances.findIndex((instance) => instance.instanceId === sourceId);
				if (target < 0 || source < 0) return;
				const position = event.clientY < event.currentTarget.getBoundingClientRect().top + event.currentTarget.getBoundingClientRect().height / 2 ? "before" : "after";
				const nextVisible = instances.map((instance) => instance.instanceId).filter((id) => id !== sourceId);
				const insertAt = nextVisible.indexOf(targetId) + (position === "after" ? 1 : 0);
				nextVisible.splice(insertAt, 0, sourceId);
				persistOrder(nextVisible);
				setDraggedId(null);
				setDropTarget(null);
			};
			const closeRename = () => {
				if (renaming || mutation.current) return;
				setRenameTarget(null);
				setRenameError(null);
			};
			const confirmRename = async () => {
				if (renameBlocked || renameTarget === null || mutation.current) return;
				const current = lifecycle.current;
				mutation.current = true;
				setRenaming(true);
				setRenameError(null);
				try {
					await service.renameInstance(renameTarget.instanceId, renameTrimmed);
					if (current.active) setRenameTarget(null);
				} catch (reason) {
					if (current.active) setRenameError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					if (current.active) {
						mutation.current = false;
						setRenaming(false);
					}
				}
			};
			const requestRename = (instance) => {
				if (busy || mutation.current) return;
				setRenameTarget({
					instanceId: instance.instanceId,
					currentTitle: instance.title
				});
				setRenameDraft(instance.title);
				setRenameError(null);
			};
			const closeDelete = () => {
				if (deleting || mutation.current) return;
				setDeleteTarget(null);
				setDeleteError(null);
			};
			const confirmDelete = async () => {
				if (busy || deleteTarget === null || mutation.current) return;
				const current = lifecycle.current;
				mutation.current = true;
				setDeleting(true);
				setDeleteError(null);
				try {
					await service.deleteInstance(deleteTarget.instanceId);
					if (current.active) setDeleteTarget(null);
				} catch (reason) {
					if (current.active) setDeleteError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					if (current.active) {
						mutation.current = false;
						setDeleting(false);
					}
				}
			};
			const requestDelete = (instance) => {
				if (busy || mutation.current) return;
				setDeleteTarget({
					instanceId: instance.instanceId,
					title: instance.title
				});
				setDeleteError(null);
			};
			const renameDialog = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: renameTarget !== null,
				onClose: closeRename,
				closeLabel: "关闭",
				title: "重命名工作台",
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					disabled: renaming,
					onClick: closeRename,
					children: "取消"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "primary",
					disabled: renameBlocked,
					onClick: confirmRename,
					children: "重命名"
				})] }),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						className: "dsh-better-workbench-rename-input",
						value: renameDraft,
						"aria-label": "工作台名称",
						autoFocus: true,
						disabled: renaming,
						onFocus: (event) => {
							event.target.select();
						},
						onChange: (event) => {
							setRenameDraft(event.target.value);
							setRenameError(null);
						},
						onCompositionStart: () => {
							composingRef.current = true;
						},
						onCompositionEnd: () => {
							composingRef.current = false;
						},
						onKeyDown: (event) => {
							if (event.key === "Enter" && !composingRef.current) {
								event.preventDefault();
								event.stopPropagation();
								confirmRename();
							}
						}
					}),
					renaming && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						role: "status",
						children: "正在重命名..."
					}),
					renameError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-rename-error",
						role: "alert",
						children: renameError
					})
				]
			});
			const deleteDialog = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: deleteTarget !== null,
				onClose: closeDelete,
				closeLabel: "关闭",
				title: "删除工作台？",
				...deleteTarget === null ? {} : { description: "删除“" + deleteTarget.title + "”？只移除工作台入口和配置，不会删除应用源码或项目文件。" },
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					disabled: deleting,
					onClick: closeDelete,
					children: "取消"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					className: "dsh-better-workbench-delete-action",
					disabled: deleting,
					onClick: confirmDelete,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, { size: 16 }), "删除"]
				})] }),
				children: [deleting && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					role: "status",
					children: "正在删除..."
				}), deleteError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-better-workbench-delete-error",
					role: "alert",
					children: deleteError
				})]
			});
			if (compact) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				ref: section,
				className: "dsh-better-workbench-sidebar-section",
				"aria-label": "工作台",
				"data-compact": "true",
				children: [renameDialog, deleteDialog]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				ref: section,
				className: "dsh-better-workbench-sidebar-section",
				"aria-label": "工作台",
				"aria-busy": busy,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-better-workbench-sidebar-heading",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `dsh-better-workbench-sidebar-heading-label${searchExpanded && !compact ? " is-hidden" : ""}`,
								children: "工作台"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								ref: searchRoot,
								className: `dsh-better-workbench-sidebar-search-slot${searchExpanded ? " is-expanded" : ""}`,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-better-workbench-sidebar-search",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
											label: "搜索工作台",
											side: "bottom",
											delayMs: 500,
											disabled: searchExpanded,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh-better-workbench-sidebar-search-button",
												"aria-label": "搜索工作台",
												"aria-expanded": searchExpanded,
												onClick: () => {
													setSearchExpanded(true);
													if (compact) requestSidebarExpand();
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { size: searchExpanded ? 11 : 14 })
											})
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											ref: searchInput,
											className: "dsh-better-workbench-sidebar-search-input",
											type: "text",
											placeholder: "搜索工作台…",
											value: query,
											tabIndex: searchExpanded && !compact ? 0 : -1,
											onChange: (event) => {
												setQuery(event.target.value);
											},
											onKeyDown: (event) => {
												if (event.key === "Escape") {
													setQuery("");
													setSearchExpanded(false);
												}
											}
										}),
										searchExpanded && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "dsh-better-workbench-sidebar-search-clear",
											"aria-label": "清除搜索",
											onClick: (event) => {
												event.stopPropagation();
												setQuery("");
												setSearchExpanded(false);
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFill14, {})
										})
									]
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: `dsh-better-workbench-sidebar-heading-actions${searchExpanded && !compact ? " is-hidden" : ""}`,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ViewOptionsMenu, {
									orderBy,
									onOrderPick: setOrderBy
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
									label: "创建工作台",
									side: "bottom",
									delayMs: 500,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-better-workbench-sidebar-icon-button dsh-better-workbench-sidebar-add",
										"aria-label": "创建工作台",
										disabled: busy,
										onClick: () => {
											setSearchExpanded(false);
											service.openHome(true);
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconProjectAddOutline16, { size: 16 })
									})
								})]
							})
						]
					}),
					compact && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-sidebar-rail-search",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
							label: "搜索工作台",
							side: "right",
							delayMs: 500,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dsh-better-workbench-sidebar-search-button",
								"aria-label": "搜索工作台",
								"aria-expanded": searchExpanded,
								onClick: () => {
									setSearchExpanded(true);
									requestSidebarExpand();
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { size: 18 })
							})
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-better-workbench-sidebar-list",
						"aria-label": "工作台列表",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchHomeRow, {
							active: snapshot.route.kind === "workbench-home",
							onOpen: () => {
								service.openHome();
							}
						}), instances.map((instance, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchRow, {
							instance,
							compact,
							active: snapshot.route.kind === "workbench-instance" && snapshot.route.instanceId === instance.instanceId,
							draggable: canReorder,
							busy,
							canMoveUp: canReorder && index > 0,
							canMoveDown: canReorder && index < instances.length - 1,
							onMove: (direction) => {
								moveInstance(instance.instanceId, direction);
							},
							dropPosition: dropTarget?.id === instance.instanceId ? dropTarget.position : null,
							onOpen: () => {
								service.open(instance.instanceId);
							},
							onRename: () => {
								requestRename(instance);
							},
							onDelete: () => {
								requestDelete(instance);
							},
							onDragStart: (event) => {
								if (!canReorder) {
									event.preventDefault();
									return;
								}
								setDraggedId(instance.instanceId);
								event.dataTransfer.effectAllowed = "move";
								event.dataTransfer.setData("text/plain", instance.instanceId);
							},
							onDragOver: (event) => {
								if (!canReorder || draggedId === null || draggedId === instance.instanceId) return;
								event.preventDefault();
								const rect = event.currentTarget.getBoundingClientRect();
								setDropTarget({
									id: instance.instanceId,
									position: event.clientY < rect.top + rect.height / 2 ? "before" : "after"
								});
							},
							onDrop: (event) => {
								handleDrop(instance.instanceId, event);
							},
							onDragEnd: () => {
								setDraggedId(null);
								setDropTarget(null);
							}
						}, instance.instanceId))]
					}),
					snapshot.loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-sidebar-empty",
						role: "status",
						children: "正在加载工作台..."
					}),
					reordering && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-sidebar-empty",
						role: "status",
						children: "正在保存排序..."
					}),
					(reorderError ?? snapshot.error) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-rename-error",
						role: "alert",
						children: reorderError ?? snapshot.error
					}),
					!snapshot.loading && instances.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-sidebar-empty",
						children: normalizedQuery === "" ? "从首页创建实例。" : "无匹配工作台"
					}),
					renameDialog,
					deleteDialog
				]
			});
		}
		//#endregion
		//#region src/client/WorkbenchHome.tsx
		function WorkbenchCard({ badge, description, disabled = false, id, onOpen, title, footer }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: "dsh-better-workbench-home-card",
				"data-disabled": disabled,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dsh-better-workbench-home-card-main",
					"aria-label": disabled ? `${title}：${badge}` : title,
					disabled,
					onClick: onOpen,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-better-workbench-home-card-head",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-better-workbench-home-card-name",
								children: title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-better-workbench-home-card-badge",
								children: badge
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-better-workbench-home-card-description",
							children: description
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							className: "dsh-better-workbench-home-card-id",
							children: id
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-better-workbench-home-card-foot",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: footer })
				})]
			});
		}
		function AppCard({ app, disabled, existing, pending, onCreate }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchCard, {
				badge: "应用",
				description: app.description ?? "从默认配置创建新的工作台实例",
				disabled,
				id: app.appId,
				onOpen: onCreate,
				title: app.title,
				footer: pending ? "正在创建..." : existing ? "打开已有" : "创建实例"
			});
		}
		function TemplateCard({ template, disabled, existing, pending, onCreate }) {
			const unavailableReason = template.kind === "agent" ? "需要 Agent Creator" : "对应应用暂不可用";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchCard, {
				badge: template.available ? "模板" : unavailableReason,
				description: template.description ?? "从预设配置创建新的工作台实例",
				disabled: disabled || !template.available,
				id: template.templateId,
				onOpen: onCreate,
				title: template.title,
				footer: pending ? "正在创建..." : existing ? "打开已有" : "使用模板"
			});
		}
		function InstanceCard({ appTitle, available, status, instanceId, title, onOpen }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchCard, {
				badge: status === "preparing" ? "准备中" : status === "migration-error" ? "升级失败" : status === "incompatible" ? "版本不兼容" : available && status === "ready" ? "可用" : "不可用",
				description: available ? appTitle : `应用暂不可用 · ${appTitle}`,
				id: instanceId,
				onOpen,
				title,
				footer: available ? "打开工作台" : "查看状态"
			});
		}
		/** Built-in hub page that remains available without third-party applications. */
		function WorkbenchHome({ service, snapshot }) {
			const creating = snapshot.route.kind === "workbench-home" && snapshot.route.creating === true;
			const [pending, setPending] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(null);
			const [sessionId, setSessionId] = (0, react.useState)(null);
			const inFlight = (0, react.useRef)(false);
			const operation = (0, react.useRef)(0);
			const lifecycle = (0, react.useRef)({ active: true });
			(0, react.useEffect)(() => {
				const current = { active: true };
				lifecycle.current = current;
				inFlight.current = false;
				setPending(null);
				setError(null);
				setSessionId(null);
				return () => {
					current.active = false;
				};
			}, [service]);
			const creationPending = snapshot.creation.status === "creating";
			const busy = snapshot.loading || pending !== null || creationPending;
			const creationError = snapshot.creation.status === "failed" ? snapshot.creation.error : null;
			const visibleError = error ?? creationError ?? snapshot.error;
			const creationResult = snapshot.creation.status === "complete" ? snapshot.creation.result : void 0;
			const handedOffSessionId = sessionId ?? (creationResult !== void 0 && "sessionId" in creationResult ? creationResult.sessionId : null);
			const availableInstances = (0, react.useMemo)(() => snapshot.instances.filter((instance) => instance.available), [snapshot.instances]);
			const unavailableInstances = (0, react.useMemo)(() => snapshot.instances.filter((instance) => !instance.available), [snapshot.instances]);
			const templatedAppIds = (0, react.useMemo)(() => new Set(snapshot.templates.flatMap((template) => template.kind === "instance" ? [template.appId] : [])), [snapshot.templates]);
			const appsWithoutTemplates = (0, react.useMemo)(() => snapshot.apps.filter((app) => !templatedAppIds.has(app.appId)), [snapshot.apps, templatedAppIds]);
			const existingInstance = (appId) => {
				return snapshot.apps.find((item) => item.appId === appId)?.allowMultiple === false ? snapshot.instances.find((instance) => instance.appId === appId) : void 0;
			};
			const runCreation = async (key, create) => {
				if (busy || inFlight.current) return;
				const current = lifecycle.current;
				const token = ++operation.current;
				inFlight.current = true;
				setPending(key);
				setError(null);
				setSessionId(null);
				try {
					const result = await create();
					if (!current.active || token !== operation.current) return;
					if ("instanceId" in result) {
						const latest = service.getSnapshot();
						const instance = latest.instances.find((item) => item.instanceId === result.instanceId);
						const app = latest.apps.find((item) => item.appId === instance?.appId);
						service.open(result.instanceId, app?.defaultPresentation);
					} else setSessionId(result.sessionId);
				} catch (reason) {
					if (current.active && token === operation.current) setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					if (current.active && token === operation.current) {
						inFlight.current = false;
						setPending(null);
					}
				}
			};
			const cancelWaiting = () => {
				operation.current++;
				inFlight.current = false;
				setPending(null);
				setError(null);
				setSessionId(null);
				service.cancelCreation();
			};
			const retryLoading = async () => {
				if (busy || inFlight.current) return;
				const current = lifecycle.current;
				inFlight.current = true;
				setPending("reload");
				setError(null);
				try {
					await service.retry();
				} catch (reason) {
					if (current.active) setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					if (current.active) {
						inFlight.current = false;
						setPending(null);
					}
				}
			};
			const createApp = (app) => {
				if (busy || inFlight.current) return;
				const existing = existingInstance(app.appId);
				if (existing !== void 0) {
					service.open(existing.instanceId, app.defaultPresentation);
					return;
				}
				runCreation(`app:${app.appId}`, () => service.createInstance(app.appId));
			};
			const createTemplate = (template) => {
				if (busy || inFlight.current || !template.available) return;
				const existing = template.kind === "instance" ? existingInstance(template.appId) : void 0;
				if (existing !== void 0) {
					service.open(existing.instanceId, snapshot.apps.find((app) => app.appId === existing.appId)?.defaultPresentation);
					return;
				}
				runCreation(`template:${template.templateId}`, () => service.startCreation(template.templateId));
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("main", {
				className: "dsh-better-workbench-home",
				"aria-busy": busy,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dsh-better-workbench-home-header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Workbench" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: "工作台" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-better-workbench-home-actions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "dsh-better-workbench-home-add-button",
								"aria-expanded": creating,
								disabled: busy,
								onClick: () => {
									service.openHome(!creating);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "创建工作台" })]
							})
						})]
					}),
					snapshot.recovery && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						role: "alert",
						className: "dsh-better-workbench-frame-error",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "部分旧数据无法导入，原始内容已保留" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: snapshot.recovery.errors.map((error, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: error }, index)) }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
								download: "workbench-legacy-backup.json",
								href: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot.recovery, null, 2)),
								children: "导出原始备份"
							})
						]
					}),
					snapshot.loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						role: "status",
						children: "正在加载工作台..."
					}),
					pending === "reload" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						role: "status",
						children: "正在重新加载..."
					}) : (pending !== null || creationPending) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						role: "status",
						children: "正在创建工作台..."
					}),
					creationPending && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						onClick: cancelWaiting,
						children: "取消等待"
					}),
					visibleError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-rename-error",
						role: "alert",
						children: visibleError
					}),
					snapshot.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						disabled: busy,
						onClick: () => {
							retryLoading();
						},
						children: "重新加载"
					}),
					!busy && handedOffSessionId !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						role: "status",
						children: ["创建已交接，会话：", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: handedOffSessionId })]
					}),
					creating && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-better-workbench-home-section",
						"aria-label": "创建工作台",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-better-workbench-home-section-heading",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "创建工作台" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "从已安装应用或模板开始" })]
							}),
							snapshot.templates.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-better-workbench-home-grid",
								children: snapshot.templates.map((template) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TemplateCard, {
									template,
									disabled: busy,
									existing: template.kind === "instance" && existingInstance(template.appId) !== void 0,
									pending: pending === `template:${template.templateId}` || creationPending && snapshot.creation.templateId === template.templateId,
									onCreate: () => {
										createTemplate(template);
									}
								}, template.templateId))
							}),
							appsWithoutTemplates.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-better-workbench-home-grid",
								children: appsWithoutTemplates.map((app) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AppCard, {
									app,
									disabled: busy,
									existing: existingInstance(app.appId) !== void 0,
									pending: pending === `app:${app.appId}`,
									onCreate: () => {
										createApp(app);
									}
								}, app.appId))
							}) : !snapshot.loading && snapshot.templates.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-better-workbench-home-empty",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "暂无可用的工作台应用" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "安装工作台应用后，可在这里创建实例。" })]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-better-workbench-home-section",
						"aria-label": "已有工作台",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-better-workbench-home-section-heading",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "已有工作台" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [snapshot.instances.length, " 个实例"] })]
						}), snapshot.loading ? null : snapshot.instances.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-better-workbench-home-empty",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "还没有工作台" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "从已安装应用或模板创建第一个实例。" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									disabled: busy,
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {}),
									onClick: () => {
										service.openHome(true);
									},
									children: "创建第一个工作台"
								})
							]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-better-workbench-home-grid dsh-better-workbench-home-instance-grid",
							children: [availableInstances.map((instance) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstanceCard, {
								instanceId: instance.instanceId,
								title: instance.title,
								available: true,
								status: instance.status,
								appTitle: snapshot.apps.find((app) => app.appId === instance.appId)?.title ?? instance.appId,
								onOpen: () => {
									service.open(instance.instanceId);
								}
							}, instance.instanceId)), unavailableInstances.map((instance) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstanceCard, {
								instanceId: instance.instanceId,
								title: instance.title,
								available: false,
								status: instance.status,
								appTitle: instance.appId,
								onOpen: () => {
									service.open(instance.instanceId);
								}
							}, instance.instanceId))]
						})]
					})
				]
			});
		}
		//#endregion
		//#region src/client/WorkbenchErrorBoundary.tsx
		/** Keep application failures below the host navigation and recovery controls. */
		var WorkbenchErrorBoundary = class extends react.Component {
			state = { error: null };
			static getDerivedStateFromError(error) {
				return { error: error instanceof Error ? error.message : String(error) };
			}
			componentDidCatch(error, info) {
				console.error("[dsh-better-workbench] application render failed", error, info.componentStack);
			}
			render() {
				if (this.state.error !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-better-workbench-unavailable",
					role: "alert",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "工作台显示失败" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: this.state.error }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							onClick: this.props.onRetry,
							children: "重新加载视图"
						})
					]
				});
				return this.props.children;
			}
		};
		//#endregion
		//#region src/client/presentation.ts
		function fallbackPresentation(kind) {
			if (kind === "panel") return {
				kind: "panel",
				placement: "right",
				behavior: "overlay",
				conversation: "resident"
			};
			if (kind === "capsule") return {
				kind: "capsule",
				placement: "floating",
				conversation: "resident"
			};
			return {
				kind: "page",
				conversation: "exclusive"
			};
		}
		/** Resolve geometry once for both the conversation inset and the app surface. */
		function resolvePresentationLayout(presentation, width, height) {
			const availableWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
			const availableHeight = Number.isFinite(height) ? Math.max(0, height) : 0;
			if (presentation?.kind !== "panel") return {
				presentation,
				panelSize: 0,
				rightInset: 0,
				bottomInset: 0
			};
			const right = presentation.placement === "right";
			const panelSize = right ? Math.min(360, availableWidth) : Math.min(280, availableHeight * .55);
			const canPush = right ? availableWidth >= 720 : availableHeight >= 560;
			const effective = presentation.behavior === "push" && !canPush ? {
				...presentation,
				behavior: "overlay"
			} : presentation;
			const push = effective.behavior === "push";
			return {
				presentation: effective,
				panelSize,
				rightInset: push && right ? panelSize : 0,
				bottomInset: push && !right ? panelSize : 0
			};
		}
		/** Resolve a durable route against the currently available runtime definition. */
		function resolveActivePresentation(snapshot, service) {
			if (snapshot.route.kind === "conversation") return void 0;
			if (snapshot.route.kind === "workbench-home") return fallbackPresentation("page");
			const route = snapshot.route;
			const instance = snapshot.instances.find((item) => item.instanceId === route.instanceId);
			const app = instance === void 0 ? void 0 : service.getApp(instance.appId);
			if (app === void 0) return fallbackPresentation(route.presentation);
			return app.presentations.find((item) => item.kind === route.presentation) ?? app.presentations.find((item) => item.kind === app.defaultPresentation) ?? fallbackPresentation("page");
		}
		//#endregion
		//#region src/client/WorkbenchSurface.tsx
		const modes = {
			page: {
				label: "页面",
				Icon: _deepseek_ai_dsh_client_ui_primitives.IconFullscreenOutline16
			},
			panel: {
				label: "面板",
				Icon: _deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16
			},
			capsule: {
				label: "胶囊",
				Icon: _deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16
			}
		};
		function SurfaceToolbar({ service, title, presentation, app, onMode, exporting, onExport }) {
			const [menuOpen, setMenuOpen] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: "dsh-better-workbench-frame-toolbar",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: "工作台首页",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-better-workbench-frame-button",
							"aria-label": "工作台首页",
							onClick: () => {
								service.openHome();
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16, {})
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-better-workbench-frame-title",
						title,
						children: title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-frame-modes",
						role: "group",
						"aria-label": "显示模式",
						children: [...new Set(app?.presentations.map((item) => item.kind) ?? [])].map((kind) => {
							const { label, Icon } = modes[kind];
							return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
								label,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dsh-better-workbench-frame-button",
									"aria-label": label,
									"aria-pressed": presentation?.kind === kind,
									onClick: () => {
										onMode?.(kind);
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {})
								})
							}, kind);
						})
					}),
					onExport !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
						open: menuOpen,
						onClose: () => {
							setMenuOpen(false);
						},
						portal: true,
						dense: true,
						items: [{
							id: "export",
							label: "导出配置",
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, {}),
							disabled: exporting
						}],
						onSelect: () => {
							setMenuOpen(false);
							onExport();
						},
						anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-better-workbench-frame-button",
							"aria-label": "工作台操作",
							title: "工作台操作",
							onClick: () => {
								setMenuOpen((value) => !value);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, {})
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: "关闭工作台",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "dsh-better-workbench-frame-button",
							"aria-label": "关闭工作台",
							onClick: () => {
								service.close();
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, {})
						})
					})
				]
			});
		}
		function repositoryUrl(value) {
			if (value === void 0) return void 0;
			try {
				const url = new URL(value);
				return url.protocol === "https:" || url.protocol === "http:" ? url.href : void 0;
			} catch {
				return;
			}
		}
		function InstanceFrame({ service, instance, app, generation, presentation }) {
			const [error, setError] = (0, react.useState)(null);
			const [saving, setSaving] = (0, react.useState)(0);
			const [exporting, setExporting] = (0, react.useState)(false);
			const exportingRef = (0, react.useRef)(false);
			const download = (0, react.useRef)(null);
			const clearDownload = () => {
				if (download.current === null) return;
				clearTimeout(download.current.timer);
				URL.revokeObjectURL(download.current.url);
				download.current = null;
			};
			(0, react.useEffect)(() => clearDownload, []);
			const [preparing, setPreparing] = (0, react.useState)(false);
			const [retry, setRetry] = (0, react.useState)(0);
			const owner = (0, react.useMemo)(() => ({
				active: true,
				draftRevision: void 0
			}), [service, retry]);
			(0, react.useEffect)(() => {
				const current = owner;
				current.active = true;
				setError(null);
				setSaving(0);
				setPreparing(false);
				setExporting(false);
				if (instance !== void 0 && app !== void 0 && instance.status !== "ready") {
					setPreparing(true);
					service.prepareInstance(instance.instanceId).catch((reason) => {
						if (current.active) setError(reason instanceof Error ? reason.message : String(reason));
					}).finally(() => {
						if (current.active) setPreparing(false);
					});
				}
				return () => {
					current.active = false;
				};
			}, [service, owner]);
			const retryView = () => {
				owner.active = false;
				setRetry((value) => value + 1);
			};
			const retryPreparation = async () => {
				if (preparing || !owner.active) return;
				setPreparing(true);
				setError(null);
				try {
					await service.retry();
					if (owner.active) retryView();
				} catch (reason) {
					if (owner.active) setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					if (owner.active) setPreparing(false);
				}
			};
			const exportConfig = async () => {
				if (instance === void 0 || !owner.active || exportingRef.current) return;
				exportingRef.current = true;
				setExporting(true);
				try {
					const data = await service.exportInstance(instance.instanceId);
					if (!owner.active) return;
					clearDownload();
					const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
					download.current = {
						url,
						timer: setTimeout(clearDownload, 1e3)
					};
					const anchor = document.createElement("a");
					anchor.href = url;
					anchor.download = `${instance.instanceId.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
					anchor.click();
				} catch (reason) {
					if (owner.active) setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					exportingRef.current = false;
					if (owner.active) setExporting(false);
				}
			};
			const setPresentation = (kind) => {
				if (owner.active && instance !== void 0) service.open(instance.instanceId, kind);
			};
			const renderProps = instance === void 0 ? void 0 : {
				instance,
				presentation,
				updateConfig: async (patch, expectedRevision) => {
					const current = owner;
					if (!current.active) throw new Error("工作台视图已失效");
					setSaving((value) => value + 1);
					setError(null);
					try {
						const revision = await service.updateInstanceConfig(instance.instanceId, patch, expectedRevision ?? current.draftRevision ?? instance.revision, generation);
						if (current.active && current.draftRevision !== void 0) current.draftRevision = revision;
						return revision;
					} catch (reason) {
						if (current.active) setError(reason instanceof Error ? reason.message : String(reason));
						throw reason;
					} finally {
						if (current.active) setSaving((value) => value - 1);
					}
				},
				setDirty: (dirty) => {
					if (!owner.active) return;
					if (dirty) owner.draftRevision ??= instance.revision;
					else owner.draftRevision = void 0;
					service.setDirty(instance.instanceId, dirty);
				},
				reportError: (reason) => {
					if (owner.active) setError(reason);
				},
				setPresentation,
				close: () => {
					if (owner.active) service.close();
				},
				openHome: () => {
					if (owner.active) service.openHome();
				},
				openConversation: () => {
					if (owner.active) service.openConversation();
				}
			};
			const ready = instance?.status === "ready" && instance.available && !preparing;
			const Renderer = presentation.kind === "panel" ? app?.renderPanel : presentation.kind === "capsule" ? app?.renderCapsule : app?.renderMain;
			const Secondary = presentation.kind === "page" ? app?.renderSecondary : void 0;
			let content = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-better-workbench-unavailable",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: preparing || instance?.status === "preparing" ? "正在准备工作台..." : "工作台应用暂不可用" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: instance === void 0 ? "实例不存在" : instance.error ?? `应用标识：${instance.appId}` }),
					app !== void 0 && !preparing && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							retryPreparation();
						},
						children: "重试"
					})
				]
			});
			if (ready && Renderer !== void 0 && renderProps !== void 0) content = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-better-workbench-center-body",
				children: [Secondary !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("aside", {
					className: "dsh-better-workbench-center-secondary",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Secondary, { ...renderProps })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("main", {
					className: "dsh-better-workbench-center-main",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Renderer, { ...renderProps })
				})]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-better-workbench-frame",
				children: [
					presentation.kind !== "page" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SurfaceToolbar, {
						service,
						title: instance?.title ?? "工作台",
						app,
						presentation,
						onMode: setPresentation,
						exporting,
						onExport: instance === void 0 ? void 0 : () => {
							exportConfig();
						}
					}),
					presentation.kind !== "page" && app?.source !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
						className: "dsh-better-workbench-frame-source",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "开发者声明" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								app.source.packageName,
								" · ",
								app.source.version
							] }),
							repositoryUrl(app.source.repository) !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
								href: repositoryUrl(app.source.repository),
								target: "_blank",
								rel: "noopener noreferrer",
								children: "项目仓库"
							})
						]
					}),
					exporting && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-frame-status",
						role: "status",
						children: "正在导出..."
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-save-status",
						role: "status",
						"aria-live": "polite",
						"aria-atomic": "true",
						children: saving > 0 ? "正在保存..." : ""
					}),
					(preparing || instance?.status === "preparing") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-frame-status",
						role: "status",
						children: "正在准备工作台..."
					}),
					(error ?? instance?.error) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-better-workbench-frame-error",
						role: "alert",
						children: error ?? instance?.error
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchErrorBoundary, {
						onRetry: retryView,
						children: content
					}, retry)
				]
			});
		}
		/** Keep host controls outside application failure and instance state boundaries. */
		function WorkbenchSurface({ service }) {
			const snapshot = (0, react.useSyncExternalStore)((listener) => service.subscribe(listener), () => service.getSnapshot(), () => service.getSnapshot());
			const root = (0, react.useRef)(null);
			const [size, setSize] = (0, react.useState)({
				width: 0,
				height: 0
			});
			(0, react.useEffect)(() => {
				const mount = root.current?.parentElement;
				const host = mount?.hasAttribute("data-dsh-better-workbench-center") ? mount.parentElement : mount;
				if (host === void 0 || host === null) return;
				const update = () => {
					setSize({
						width: host.clientWidth,
						height: host.clientHeight
					});
				};
				update();
				const observer = new ResizeObserver(update);
				observer.observe(host);
				return () => {
					observer.disconnect();
				};
			}, []);
			const route = snapshot.route;
			const layout = resolvePresentationLayout(resolveActivePresentation(snapshot, service), size.width, size.height);
			if (route.kind === "conversation") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: root,
				className: "dsh-better-workbench-center",
				"data-open": "false",
				"aria-hidden": "true"
			});
			if (route.kind === "workbench-home") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: root,
				className: "dsh-better-workbench-center",
				"data-open": "true",
				"data-kind": "page",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-better-workbench-frame",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchHome, {
						service,
						snapshot
					})
				})
			});
			const instance = snapshot.instances.find((item) => item.instanceId === route.instanceId);
			const app = instance === void 0 ? void 0 : service.getApp(instance.appId);
			const generation = snapshot.apps.find((item) => item.appId === instance?.appId)?.generation;
			const presentation = layout.presentation ?? {
				kind: "page",
				conversation: "exclusive"
			};
			const frame = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstanceFrame, {
				service,
				instance,
				app,
				generation,
				presentation
			}, JSON.stringify([
				instance?.appId,
				route.instanceId,
				generation
			]));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: root,
				className: "dsh-better-workbench-center",
				"data-open": "true",
				"data-kind": presentation.kind,
				"data-placement": presentation.kind === "page" ? void 0 : presentation.placement,
				"data-behavior": presentation.kind === "panel" ? presentation.behavior : void 0,
				style: { "--workbench-panel-size": `${layout.panelSize}px` },
				children: presentation.kind === "page" ? frame : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("aside", {
					className: presentation.kind === "panel" ? "dsh-better-workbench-panel" : "dsh-better-workbench-capsule",
					"aria-label": instance?.title ?? "工作台",
					children: frame
				})
			});
		}
		//#endregion
		//#region src/client/dom-adapter.ts
		const SIDEBAR_SLOT = "[data-slot=\"sidebar.workspaces\"]";
		const CONVERSATION_SLOT = "[data-slot=\"conversation\"]";
		const OWNED = "[data-dsh-better-workbench-sidebar], [data-dsh-better-workbench-center]";
		const PANEL_SIZE = "--workbench-panel-size";
		const CONVERSATION_PROPERTIES = [
			"visibility",
			"pointer-events",
			"margin-right",
			"margin-bottom"
		];
		function saveStyle(element, properties) {
			return new Map(properties.map((property) => [property, {
				value: element.style.getPropertyValue(property),
				priority: element.style.getPropertyPriority(property)
			}]));
		}
		function setStyle(element, property, value, priority = "") {
			if (element.style.getPropertyValue(property) === value && element.style.getPropertyPriority(property) === priority) return;
			if (value === "") element.style.removeProperty(property);
			else element.style.setProperty(property, value, priority);
		}
		function restoreStyle(element, saved) {
			for (const [property, { value, priority }] of saved) setStyle(element, property, value, priority);
		}
		/** Narrow fallback for reselecting a leaf Session. No localized labels or CSS-module names. */
		function isSessionNavigationClick(event) {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
			const target = event.target;
			if (target === null || typeof target.closest !== "function" || target.closest(OWNED)) return false;
			const row = target.closest(SIDEBAR_SLOT + " [role=\"treeitem\"][aria-selected]");
			if (row === null || row.hasAttribute("aria-expanded")) return false;
			const control = target.closest("button, a, input, textarea, select, [role=\"button\"], [role=\"menu\"], [role=\"menuitem\"], [contenteditable=\"true\"]");
			return control === null || control === row;
		}
		function sessionList(value) {
			if (typeof value !== "object" || value === null || !("list" in value)) return void 0;
			const list = value.list;
			if (typeof list !== "object" || list === null || !("getSnapshot" in list) || !("subscribe" in list)) return void 0;
			if (typeof list.getSnapshot !== "function" || typeof list.subscribe !== "function") return void 0;
			return list;
		}
		/** Own the compatibility DOM without replacing DSH slots, methods, or React roots. */
		function mountWorkbenchDom(service, options) {
			const doc = options.document ?? document;
			const view = doc.defaultView;
			if (view === null || doc.body === null) return () => {};
			const report = options.onError ?? ((error) => console.error("Workbench DOM adapter:", error));
			let active = true;
			let sidebar;
			let center;
			let queued = false;
			let navigation;
			let unsubscribeNavigation;
			const style = doc.createElement("style");
			style.setAttribute("data-dsh-better-workbench-style", "");
			style.textContent = options.style;
			doc.head.appendChild(style);
			const restoreConversation = (surface) => {
				for (const [element, saved] of surface.originals) restoreStyle(element, saved);
				surface.originals.clear();
			};
			const sync = () => {
				if (!active || center === void 0) return;
				const surface = center;
				const layout = resolvePresentationLayout(resolveActivePresentation(service.getSnapshot(), service), surface.parent.clientWidth, surface.parent.clientHeight);
				const effective = layout.presentation;
				setStyle(surface.host, PANEL_SIZE, layout.panelSize + "px");
				setStyle(surface.parent, PANEL_SIZE, layout.panelSize + "px");
				surface.host.dataset.workbenchPresentation = effective?.kind ?? "conversation";
				surface.host.dataset.workbenchBehavior = effective?.kind === "panel" ? effective.behavior : "";
				surface.host.dataset.workbenchPlacement = effective !== void 0 && "placement" in effective ? effective.placement : "";
				if (!surface.ready || !surface.host.isConnected) {
					restoreConversation(surface);
					return;
				}
				for (const [element, saved] of surface.originals) if (element.parentElement !== surface.anchor) {
					restoreStyle(element, saved);
					surface.originals.delete(element);
				}
				for (const child of Array.from(surface.anchor.children)) {
					if (!(child instanceof view.HTMLElement)) continue;
					if (!surface.originals.has(child)) surface.originals.set(child, saveStyle(child, CONVERSATION_PROPERTIES));
					const saved = surface.originals.get(child);
					const overrides = {
						visibility: effective?.conversation === "exclusive" ? "hidden" : void 0,
						"pointer-events": effective?.conversation === "exclusive" ? "none" : void 0,
						"margin-right": layout.rightInset > 0 ? layout.rightInset + "px" : void 0,
						"margin-bottom": layout.bottomInset > 0 ? layout.bottomInset + "px" : void 0
					};
					for (const [property, original] of saved) {
						const override = overrides[property];
						setStyle(child, property, override ?? original.value, override === void 0 ? original.priority : "");
					}
				}
			};
			const disposeSurface = (surface) => {
				surface.resize?.disconnect();
				surface.children?.disconnect();
				restoreConversation(surface);
				try {
					surface.dispose();
				} catch (error) {
					report(error);
				}
				surface.host.remove();
				restoreStyle(surface.parent, surface.parentStyle);
			};
			const insert = (kind) => {
				const anchor = doc.querySelector(kind === "sidebar" ? SIDEBAR_SLOT : CONVERSATION_SLOT);
				if (!(anchor instanceof view.HTMLElement) || anchor.parentElement === null) return void 0;
				const parent = anchor.parentElement;
				const host = doc.createElement("div");
				host.setAttribute("data-dsh-better-workbench-" + kind, "");
				const surface = {
					host,
					anchor,
					parent,
					dispose: () => {},
					ready: false,
					failed: false,
					originals: /* @__PURE__ */ new Map(),
					parentStyle: saveStyle(parent, kind === "center" ? ["position", PANEL_SIZE] : [])
				};
				try {
					if (kind === "center") {
						setStyle(parent, "position", "relative");
						parent.appendChild(host);
					} else parent.insertBefore(host, anchor);
					const ready = (value) => {
						surface.ready = value;
						surface.failed = !value;
						if (active) sync();
					};
					surface.dispose = (kind === "center" ? options.renderCenter : options.renderSidebar)(host, ready);
					if (surface.failed) throw new Error("Workbench surface failed to render");
					if (kind === "center") {
						surface.children = new view.MutationObserver(sync);
						surface.children.observe(anchor, { childList: true });
						if (typeof view.ResizeObserver === "function") {
							surface.resize = new view.ResizeObserver(sync);
							surface.resize.observe(parent);
						}
					}
					return surface;
				} catch (error) {
					disposeSurface(surface);
					report(error);
					return;
				}
			};
			const connected = (surface) => surface.host.isConnected && surface.anchor.isConnected && surface.anchor.parentElement === surface.parent && surface.host.parentElement === surface.parent;
			const valid = (surface) => !surface.failed && connected(surface);
			const close = () => {
				if (active && service.getSnapshot().route.kind !== "conversation") service.close();
			};
			const bindNavigation = () => {
				const next = sessionList(options.getSessions?.());
				if (next === navigation) return;
				unsubscribeNavigation?.();
				unsubscribeNavigation = void 0;
				navigation = next;
				if (next === void 0) return;
				let current = next.getSnapshot().current;
				unsubscribeNavigation = next.subscribe(() => {
					const selected = next.getSnapshot().current;
					if (selected === void 0) return;
					const changed = selected !== current;
					current = selected;
					if (changed) close();
				});
			};
			const reconcile = () => {
				if (!active) return;
				if (sidebar !== void 0 && !valid(sidebar)) {
					disposeSurface(sidebar);
					sidebar = void 0;
				}
				if (center !== void 0 && !valid(center)) {
					disposeSurface(center);
					center = void 0;
				}
				sidebar ??= insert("sidebar");
				center ??= insert("center");
				try {
					bindNavigation();
				} catch (error) {
					report(error);
				}
				sync();
			};
			const schedule = () => {
				if (queued || !active) return;
				queued = true;
				view.queueMicrotask(() => {
					queued = false;
					if (active) reconcile();
				});
			};
			const bodyObserver = new view.MutationObserver((records) => {
				if (!active) return;
				if (sidebar !== void 0 && !connected(sidebar) || center !== void 0 && !connected(center)) {
					schedule();
					return;
				}
				for (const record of records) {
					if ((record.target instanceof view.Element ? record.target : record.target.parentElement)?.closest(OWNED)) continue;
					if ([...Array.from(record.addedNodes), ...Array.from(record.removedNodes)].some((node) => node instanceof view.Element && !node.matches(OWNED) && (node.matches(SIDEBAR_SLOT + ", " + CONVERSATION_SLOT) || node.querySelector(SIDEBAR_SLOT + ", " + CONVERSATION_SLOT)))) {
						schedule();
						return;
					}
				}
			});
			const click = (event) => {
				if (isSessionNavigationClick(event)) close();
			};
			const headObserver = new view.MutationObserver(() => {
				if (active && !style.isConnected) doc.head.appendChild(style);
			});
			let unsubscribe = () => {};
			let retry;
			const dispose = () => {
				if (!active) return;
				active = false;
				bodyObserver.disconnect();
				headObserver.disconnect();
				if (retry !== void 0) view.clearInterval(retry);
				view.removeEventListener("resize", sync);
				doc.removeEventListener("click", click);
				unsubscribe();
				unsubscribeNavigation?.();
				if (sidebar !== void 0) disposeSurface(sidebar);
				if (center !== void 0) disposeSurface(center);
				style.remove();
			};
			try {
				bodyObserver.observe(doc.body, {
					childList: true,
					subtree: true
				});
				headObserver.observe(doc.head, { childList: true });
				doc.addEventListener("click", click);
				view.addEventListener("resize", sync);
				unsubscribe = service.subscribe(sync);
				reconcile();
				retry = view.setInterval(() => {
					if (sidebar === void 0 || center === void 0 || sidebar.failed || center.failed) reconcile();
					else try {
						bindNavigation();
					} catch (error) {
						report(error);
					}
				}, 250);
			} catch (error) {
				dispose();
				throw error;
			}
			return dispose;
		}
		//#endregion
		//#region src/client/styles.ts
		const WORKBENCH_STYLE = `
[data-dsh-better-workbench-sidebar] {
  flex: none;
  width: 100%;
  min-height: 0;
  container-type: inline-size;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-s-14);
}
[data-dsh-better-workbench-sidebar] *, [data-dsh-better-workbench-center] * { box-sizing: border-box; }
.dsh-better-workbench-sidebar-section {
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding-right: var(--dsh-sidebar-inline-padding);
}
.dsh-better-workbench-sidebar-heading {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  height: 36px;
  padding-left: 4px;
  margin: 2px -4px 4px 0;
  border-radius: 12px;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-s-14);
  font-weight: 400;
  line-height: 20px;
}
.dsh-better-workbench-sidebar-heading-label {
  flex: none;
  max-width: 45%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  line-height: 20px;
  opacity: 1;
  visibility: visible;
  transition: max-width 180ms var(--ds-ease-in-out), margin-right 180ms var(--ds-ease-in-out), opacity 120ms var(--ds-ease-in-out), transform 180ms var(--ds-ease-in-out), visibility 0s linear;
}
.dsh-better-workbench-sidebar-heading-label.is-hidden {
  max-width: 0;
  margin-right: -4px;
  opacity: 0;
  transform: translateX(-4px);
  visibility: hidden;
  transition-delay: 0s, 0s, 0s, 180ms;
}
.dsh-better-workbench-sidebar-icon-button,
.dsh-better-workbench-sidebar-search-button,
.dsh-better-workbench-sidebar-row-action {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
}
.dsh-better-workbench-sidebar-icon-button,
.dsh-better-workbench-sidebar-search-button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.dsh-better-workbench-sidebar-icon-button:hover,
.dsh-better-workbench-sidebar-search-button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-better-workbench-sidebar-search-slot {
  flex: 1;
  max-width: 28px;
  min-width: 0;
  display: flex;
  align-items: center;
  margin-left: auto;
  transition: max-width 180ms var(--ds-ease-in-out), padding-left 180ms var(--ds-ease-in-out);
}
.dsh-better-workbench-sidebar-search-slot.is-expanded {
  max-width: 100%;
  padding-left: 0;
}
.dsh-better-workbench-sidebar-search {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  height: 28px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  cursor: text;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  transition: width 180ms var(--ds-ease-in-out), padding 180ms var(--ds-ease-in-out), border-color 180ms var(--ds-ease-in-out), background-color 180ms var(--ds-ease-in-out);
}
.dsh-better-workbench-sidebar-search-slot.is-expanded .dsh-better-workbench-sidebar-search {
  width: calc(100% + 4px);
  height: 30px;
  margin-inline: -2px;
  padding: 0 4px 0 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: transparent;
  color: var(--dsw-alias-label-caption);
}
.dsh-better-workbench-sidebar-search-button { color: inherit; }
.dsh-better-workbench-sidebar-search-slot.is-expanded .dsh-better-workbench-sidebar-search-button { width: 28px; height: 30px; }
.dsh-better-workbench-sidebar-search-slot.is-expanded .dsh-better-workbench-sidebar-search-button:hover { background: transparent; }
.dsh-better-workbench-sidebar-search-input {
  flex: 1;
  width: 0;
  min-width: 0;
  border: none;
  outline: none;
  opacity: 0;
  pointer-events: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-xs-13);
  transition: opacity 120ms var(--ds-ease-in-out);
}
.dsh-better-workbench-sidebar-search-slot.is-expanded .dsh-better-workbench-sidebar-search-input {
  margin-left: -2px;
  opacity: 1;
  pointer-events: auto;
}
.dsh-better-workbench-sidebar-search-input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-better-workbench-sidebar-search-clear {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
}
.dsh-better-workbench-sidebar-search-clear:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-better-workbench-sidebar-heading-actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 60px;
  margin-right: 4px;
  opacity: 1;
  overflow: hidden;
  visibility: visible;
  transition: max-width 180ms var(--ds-ease-in-out), opacity 120ms var(--ds-ease-in-out), transform 180ms var(--ds-ease-in-out), visibility 0s linear;
}
.dsh-better-workbench-sidebar-heading-actions.is-hidden {
  max-width: 0;
  opacity: 0;
  transform: translateX(4px);
  visibility: hidden;
  pointer-events: none;
  transition-delay: 0s, 0s, 0s, 180ms;
}
.dsh-better-workbench-sidebar-rail-search { display: none; }
.dsh-better-workbench-sidebar-list {
  display: grid;
  gap: 2px;
  min-height: 0;
}
.dsh-better-workbench-sidebar-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 0;
  height: 32px;
  border-radius: 8px;
  padding: 0 8px;
  cursor: pointer;
  user-select: none;
  color: var(--dsw-alias-label-primary);
  background: transparent;
  text-align: left;
  font: var(--dsw-font-s-14);
  line-height: 20px;
}
.dsh-better-workbench-sidebar-row:hover,
.dsh-better-workbench-sidebar-row[data-active="true"],
.dsh-better-workbench-sidebar-row[data-menu-open="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-better-workbench-sidebar-row[data-drop-position="before"]::before,
.dsh-better-workbench-sidebar-row[data-drop-position="after"]::after {
  content: '';
  position: absolute;
  left: 0;
  right: 4px;
  height: 2px;
  background: var(--dsw-alias-state-business-primary);
  pointer-events: none;
}
.dsh-better-workbench-sidebar-row[data-drop-position="before"]::before { top: -1px; }
.dsh-better-workbench-sidebar-row[data-drop-position="after"]::after { bottom: -1px; }
.dsh-better-workbench-sidebar-home {
  width: 100%;
  border: 0;
}
.dsh-better-workbench-sidebar-home-icon {
  flex: none;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-better-workbench-sidebar-row-label {
  flex: 1;
  min-width: 0;
  margin: 0 6px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: var(--dsw-font-s-14);
  font-weight: 400;
  line-height: 20px;
}
.dsh-better-workbench-sidebar-row-actions {
  flex: none;
  display: none;
  align-items: center;
  gap: 12px;
  height: 20px;
}
.dsh-better-workbench-sidebar-row:focus-within .dsh-better-workbench-sidebar-row-actions,
.dsh-better-workbench-sidebar-row:hover .dsh-better-workbench-sidebar-row-actions,
.dsh-better-workbench-sidebar-row[data-menu-open="true"] .dsh-better-workbench-sidebar-row-actions { display: inline-flex; }
.dsh-better-workbench-sidebar-row-action {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-better-workbench-sidebar-row-action:hover { color: var(--dsw-alias-label-primary); }
.dsh-better-workbench-rename-input {
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 7px 14px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 22px;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-s-14);
  line-height: 22px;
}
.dsh-better-workbench-rename-input:disabled { color: var(--dsw-alias-label-dimmed); }
.dsh-better-workbench-rename-error {
  margin-top: 8px;
  color: var(--dsw-alias-state-error-primary);
  font: var(--dsw-font-xs-13);
  line-height: 18px;
}
.dsh-better-workbench-delete-action:not(:disabled) { color: var(--dsw-alias-state-error-primary); }
.dsh-better-workbench-delete-error {
  margin-top: 8px;
  color: var(--dsw-alias-state-error-primary);
  font: var(--dsw-font-xs-13);
  line-height: 18px;
}
.dsh-better-workbench-sidebar-empty {
  padding: 10px 12px;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-xs-13);
}
.dsh-better-workbench-center {
  position: absolute;
  inset: 0;
  z-index: 10;
  isolation: isolate;
  display: flex;
  container-type: inline-size;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-base);
}
.dsh-better-workbench-center[data-open="false"] { display: none; }
.dsh-better-workbench-frame {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.dsh-better-workbench-frame-toolbar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-base);
}
.dsh-better-workbench-frame-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font: var(--dsw-font-xs-13);
}
.dsh-better-workbench-frame-modes { display: flex; flex: none; gap: 2px; }
.dsh-better-workbench-frame-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 4px;
  padding: 0;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  cursor: pointer;
}
.dsh-better-workbench-frame-button:hover,
.dsh-better-workbench-frame-button[aria-pressed="true"] { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-better-workbench-frame-button:focus-visible,
.dsh-better-workbench-sidebar-row:focus-visible,
.dsh-better-workbench-sidebar-row-action:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: -2px;
}
.dsh-better-workbench-frame-status,
.dsh-better-workbench-frame-error {
  flex: none;
  padding: 6px 12px;
  font: var(--dsw-font-xs-13);
  overflow-wrap: anywhere;
}
.dsh-better-workbench-frame-source { flex: none; padding: 6px 12px; font: var(--dsw-font-xs-13); overflow-wrap: anywhere; }
.dsh-better-workbench-frame-source summary { cursor: pointer; color: var(--dsw-alias-label-tertiary); }
.dsh-better-workbench-frame-source span, .dsh-better-workbench-frame-source a { display: block; margin-top: 4px; }
.dsh-better-workbench-frame-status { color: var(--dsw-alias-label-secondary); }
/* Background config writes must not resize or cover the application surface. */
.dsh-better-workbench-save-status { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.dsh-better-workbench-frame-error { color: var(--dsw-alias-state-error-primary); }
.dsh-better-workbench-frame > .dsh-better-workbench-home { flex: 1; min-height: 0; }
.dsh-better-workbench-capsule > .dsh-better-workbench-frame { max-height: inherit; }
.dsh-better-workbench-home-add-button:disabled,
.dsh-better-workbench-sidebar-icon-button:disabled,
.dsh-better-workbench-sidebar-row-action:disabled { cursor: default; opacity: .5; }
@media (hover: none), (pointer: coarse) {
  .dsh-better-workbench-sidebar-row-actions { display: inline-flex; }
  .dsh-better-workbench-sidebar-row-action { width: 28px; height: 28px; }
}

.dsh-better-workbench-center-body {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.dsh-better-workbench-center-secondary {
  flex: none;
  width: 224px;
  min-height: 0;
  overflow: auto;
  border-right: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-specific-sidebar-fill);
}
.dsh-better-workbench-center-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
/* Keep both Workbench scroll surfaces usable without permanent visual rails. */
.dsh-better-workbench-center-secondary,
.dsh-better-workbench-center-main { scrollbar-width: thin; scrollbar-gutter: stable; scrollbar-color: transparent transparent; }
.dsh-better-workbench-center-secondary::-webkit-scrollbar,
.dsh-better-workbench-center-main::-webkit-scrollbar { width: 6px; height: 6px; }
.dsh-better-workbench-center-secondary::-webkit-scrollbar-thumb,
.dsh-better-workbench-center-main::-webkit-scrollbar-thumb { background: transparent; }
.dsh-better-workbench-center-secondary:hover,
.dsh-better-workbench-center-secondary:focus-within,
.dsh-better-workbench-center-main:hover,
.dsh-better-workbench-center-main:focus-within { scrollbar-width: thin; scrollbar-color: var(--dsw-alias-border-l3) transparent; }
.dsh-better-workbench-center-secondary:hover::-webkit-scrollbar,
.dsh-better-workbench-center-secondary:focus-within::-webkit-scrollbar,
.dsh-better-workbench-center-main:hover::-webkit-scrollbar,
.dsh-better-workbench-center-main:focus-within::-webkit-scrollbar { width: 6px; height: 6px; }
.dsh-better-workbench-center-secondary:hover::-webkit-scrollbar-thumb,
.dsh-better-workbench-center-secondary:focus-within::-webkit-scrollbar-thumb,
.dsh-better-workbench-center-main:hover::-webkit-scrollbar-thumb,
.dsh-better-workbench-center-main:focus-within::-webkit-scrollbar-thumb { border-radius: 6px; background: var(--dsw-alias-border-l3); }
.dsh-better-workbench-center-secondary::-webkit-scrollbar-track,
.dsh-better-workbench-center-main::-webkit-scrollbar-track { background: transparent; }
.dsh-better-workbench-unavailable {
  display: grid;
  justify-items: center;
  gap: 8px;
  max-width: 430px;
  margin: auto;
  padding: 28px;
  color: var(--dsw-alias-label-secondary);
  text-align: center;
}
.dsh-better-workbench-unavailable strong { color: var(--dsw-alias-label-primary); }
.dsh-better-workbench-unavailable > button { margin-top: 8px; }
.dsh-better-workbench-home {
  width: 100%;
  min-height: 100%;
  overflow: auto;
  padding: 40px clamp(24px, 6cqw, 72px) 64px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-base);
}
.dsh-better-workbench-home-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  max-width: 1040px;
  margin: 0 auto 36px;
}
.dsh-better-workbench-home-header > div:first-child { min-width: 0; }
.dsh-better-workbench-home-header span:first-child {
  display: block;
  margin-bottom: 4px;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-xs-13);
}
.dsh-better-workbench-home-header h1 {
  margin: 0;
  font-size: 28px;
  line-height: 36px;
  font-weight: 650;
  letter-spacing: 0;
}
.dsh-better-workbench-home-actions { flex: none; display: flex; align-items: center; }
.dsh-better-workbench-home-add-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  border: 1px dashed var(--dsw-alias-border-l3);
  border-radius: 12px;
  padding: 0 14px;
  cursor: pointer;
  color: var(--dsw-alias-label-primary);
  background: transparent;
  font: var(--dsw-font-s-14);
}
.dsh-better-workbench-home-add-button:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-better-workbench-home-add-button:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}
.dsh-better-workbench-home-add-button[aria-expanded="true"] { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-better-workbench-home-section {
  max-width: 1040px;
  margin: 0 auto 36px;
}
.dsh-better-workbench-home-section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.dsh-better-workbench-home-section-heading h2 {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: 0;
}
.dsh-better-workbench-home-section-heading span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-better-workbench-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
}
.dsh-better-workbench-home-grid + .dsh-better-workbench-home-grid { margin-top: 12px; }
.dsh-better-workbench-home-card {
  display: flex;
  min-width: 0;
  min-height: 184px;
  flex-direction: column;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  overflow: hidden;
  background: var(--dsw-alias-bg-layer-3);
  transition: border-color .16s, background .16s;
}
.dsh-better-workbench-home-card:hover:not([data-disabled="true"]) {
  border-color: var(--dsw-alias-label-dimmed);
}
.dsh-better-workbench-home-card[data-disabled="true"] {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-better-workbench-home-card-main {
  flex: 1;
  appearance: none;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  border: 0;
  border-radius: 12px 12px 0 0;
  padding: 14px 16px 12px;
  color: inherit;
  background: transparent;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.dsh-better-workbench-home-card-main:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
.dsh-better-workbench-home-card-main:disabled { cursor: default; }
.dsh-better-workbench-home-card-main:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -2px;
}
.dsh-better-workbench-home-card-head {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}
.dsh-better-workbench-home-card-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.dsh-better-workbench-home-card-badge {
  flex: none;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  padding: 1px 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-weight: 500;
  line-height: 17px;
  white-space: nowrap;
}
.dsh-better-workbench-home-card-description {
  display: -webkit-box;
  min-height: 42px;
  overflow: hidden;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.dsh-better-workbench-home-card-id {
  min-width: 0;
  margin-top: auto;
  overflow: hidden;
  color: var(--dsw-alias-label-dimmed);
  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-better-workbench-home-card-foot {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: flex-end;
  padding: 6px 12px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-workbench-home-card[data-disabled="true"] .dsh-better-workbench-home-card-foot { color: var(--dsw-alias-state-error-primary); }
.dsh-better-workbench-home-empty {
  display: grid;
  justify-items: start;
  gap: 6px;
  width: 100%;
  min-height: 136px;
  align-content: center;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  padding: 16px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-base);
  text-align: left;
}
.dsh-better-workbench-home-empty strong { color: var(--dsw-alias-label-primary); font: var(--dsw-font-s-strong-14); }
.dsh-better-workbench-home-empty span { font: var(--dsw-font-xs-13); }
.dsh-better-workbench-home-empty > button { margin-top: 4px; }
.dsh-better-workbench-center[data-kind="panel"],
.dsh-better-workbench-center[data-kind="capsule"] {
  pointer-events: none;
  background: transparent;
}
.dsh-better-workbench-panel,
.dsh-better-workbench-capsule {
  position: absolute;
  pointer-events: auto;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: var(--dsw-shadow-lv3);
}
.dsh-better-workbench-center[data-kind="panel"][data-placement="right"] .dsh-better-workbench-panel {
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--workbench-panel-size, min(360px, 100%));
  border-left: 1px solid var(--dsw-alias-border-l2);
  overflow: auto;
}
.dsh-better-workbench-center[data-kind="panel"][data-placement="bottom"] .dsh-better-workbench-panel {
  right: 0;
  bottom: 0;
  left: 0;
  height: var(--workbench-panel-size, min(280px, 55%));
  border-top: 1px solid var(--dsw-alias-border-l2);
  overflow: auto;
}
.dsh-better-workbench-capsule {
  right: 16px;
  bottom: 16px;
  max-width: min(420px, calc(100% - 32px));
  max-height: min(320px, calc(100% - 32px));
  overflow: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
}
@container (max-width: 170px) {
  .dsh-better-workbench-sidebar-section { padding-right: 0; }
  .dsh-better-workbench-sidebar-heading { justify-content: flex-start; gap: 0; padding-left: 0; margin-right: 0; margin-bottom: 12px; }
  .dsh-better-workbench-sidebar-heading-label,
  .dsh-better-workbench-sidebar-search-slot,
  .dsh-better-workbench-sidebar-wide-only,
  .dsh-better-workbench-sidebar-empty { display: none; }
  .dsh-better-workbench-sidebar-heading-actions { max-width: none; }
  .dsh-better-workbench-sidebar-add { width: 36px; height: 36px; }
  .dsh-better-workbench-sidebar-rail-search { display: block; width: 36px; height: 36px; margin-bottom: 12px; }
  .dsh-better-workbench-sidebar-rail-search .dsh-better-workbench-sidebar-search-button { width: 36px; height: 36px; color: var(--dsw-alias-label-primary); }
  .dsh-better-workbench-sidebar-list { justify-items: center; }
  .dsh-better-workbench-sidebar-row { width: 36px; justify-content: center; padding: 0; }
  .dsh-better-workbench-sidebar-row-label,
  .dsh-better-workbench-sidebar-row-actions { display: none; }
  .dsh-better-workbench-sidebar-rail-icon { display: block; color: var(--dsw-alias-label-primary); }
}
@container (max-width: 720px) {
  .dsh-better-workbench-home { padding: 24px 16px 48px; }
  .dsh-better-workbench-home-header { align-items: center; margin-bottom: 28px; }
  .dsh-better-workbench-home-header h1 { font-size: 22px; line-height: 30px; }
  .dsh-better-workbench-home-section-heading { align-items: flex-start; flex-direction: column; gap: 2px; }
  .dsh-better-workbench-home-grid { grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .dsh-better-workbench-home-card { min-height: 128px; }
  .dsh-better-workbench-center-body { flex-direction: column; overflow: auto; scrollbar-width: none; }
  .dsh-better-workbench-center-body::-webkit-scrollbar { width: 0; height: 0; }
  .dsh-better-workbench-center-secondary { width: 100%; min-height: auto; overflow: visible; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l2); }
  .dsh-better-workbench-center-main { flex: none; overflow: visible; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-better-workbench-sidebar-heading-label,
  .dsh-better-workbench-sidebar-search-slot,
  .dsh-better-workbench-sidebar-search,
  .dsh-better-workbench-sidebar-search-input,
  .dsh-better-workbench-sidebar-heading-actions { transition: none; }
}
`;
		//#endregion
		//#region src/client/index.ts
		var MountBoundary = class extends react.Component {
			state = { failed: false };
			static getDerivedStateFromError() {
				return { failed: true };
			}
			componentDidMount() {
				this.props.ready(!this.state.failed);
			}
			componentDidCatch(error) {
				this.props.ready(false);
				console.error("Workbench surface failed:", error);
			}
			render() {
				return this.state.failed ? null : this.props.children;
			}
		};
		function renderSurface(host, content, ready) {
			const root = (0, react_dom_client.createRoot)(host);
			try {
				root.render((0, react.createElement)(MountBoundary, {
					ready,
					children: content
				}));
			} catch (error) {
				root.unmount();
				throw error;
			}
			return () => root.unmount();
		}
		/** Mount the service and reversible compatibility surfaces in this Cordis lifetime. */
		function apply(ctx) {
			const service = new WorkbenchController();
			ctx.effect(() => () => service.dispose(), "dsh-better-workbench: controller lifetime");
			ctx.effect(() => {
				const beforeUnload = (event) => {
					if (service.getSnapshot().dirtyInstanceIds.length === 0) return;
					event.preventDefault();
					event.returnValue = "";
				};
				window.addEventListener("beforeunload", beforeUnload);
				return () => {
					window.removeEventListener("beforeunload", beforeUnload);
				};
			}, "dsh-better-workbench: unsaved changes warning");
			ctx.effect(() => ctx.reflect.provide("workbench", service), "dsh-better-workbench: service");
			ctx.effect(() => mountWorkbenchDom(service, {
				style: WORKBENCH_STYLE,
				getSessions: () => ctx.get("sessions"),
				renderSidebar: (host, ready) => renderSurface(host, (0, react.createElement)(WorkbenchSidebar, { service }), ready),
				renderCenter: (host, ready) => renderSurface(host, (0, react.createElement)(WorkbenchSurface, { service }), ready)
			}), "dsh-better-workbench: DOM surfaces");
		}
		//#endregion
		exports.apply = apply;
		exports.resolveActivePresentation = resolveActivePresentation;
		exports.resolvePresentationLayout = resolvePresentationLayout;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map