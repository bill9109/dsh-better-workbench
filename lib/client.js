window.__ModuleLoader__.load({
	id: "dsh-workbench",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/service.ts
		const STORAGE_KEY = "dsh-workbench.state.v2";
		const LEGACY_STORAGE_KEY = "dsh-workbench.instances.v1";
		const STORAGE_VERSION = 2;
		const ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:@/-]{0,95}$/;
		function isRecord(value) {
			return typeof value === "object" && value !== null && !Array.isArray(value);
		}
		function stringValue(value) {
			return typeof value === "string" && value.trim() !== "" ? value : void 0;
		}
		function cloneJson(value, seen = /* @__PURE__ */ new Set()) {
			if (value === null || typeof value === "string" || typeof value === "boolean") return value;
			if (typeof value === "number" && Number.isFinite(value)) return value;
			if (typeof value !== "object") throw new Error("Workbench configuration must contain JSON values only");
			if (!Array.isArray(value)) {
				const prototype = Object.getPrototypeOf(value);
				if (prototype !== Object.prototype && prototype !== null) throw new Error("Workbench configuration must use plain JSON objects");
			}
			if (seen.has(value)) throw new Error("Workbench configuration cannot contain cyclic values");
			seen.add(value);
			try {
				if (Array.isArray(value)) return value.map((item) => cloneJson(item, seen));
				const output = {};
				for (const [key, item] of Object.entries(value)) output[key] = cloneJson(item, seen);
				return output;
			} finally {
				seen.delete(value);
			}
		}
		function cloneConfig(value) {
			if (!isRecord(value)) throw new Error("Workbench configuration must be a JSON object");
			return cloneJson(value);
		}
		function storedConfigValue(value) {
			try {
				return cloneConfig(value);
			} catch {
				return {};
			}
		}
		function createId(appId) {
			return `${appId}-${typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`.slice(0, 96);
		}
		function storageFromGlobal() {
			if (typeof localStorage === "undefined") return void 0;
			return localStorage;
		}
		function defaultStored() {
			return {
				version: STORAGE_VERSION,
				route: { kind: "conversation" },
				instances: []
			};
		}
		function parseInstances(value) {
			if (!Array.isArray(value)) return [];
			const seen = /* @__PURE__ */ new Set();
			return value.flatMap((entry) => {
				if (!isRecord(entry)) return [];
				const instanceId = stringValue(entry.instanceId);
				const appId = stringValue(entry.appId);
				const title = stringValue(entry.title);
				const order = typeof entry.order === "number" && Number.isFinite(entry.order) ? entry.order : 0;
				const updatedAt = typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt) ? entry.updatedAt : Date.now();
				if (instanceId === void 0 || appId === void 0 || title === void 0 || !ID_PATTERN.test(instanceId) || seen.has(instanceId)) return [];
				seen.add(instanceId);
				return [{
					instanceId,
					appId,
					title,
					config: storedConfigValue(entry.config),
					order,
					updatedAt
				}];
			});
		}
		function parseRoute(value, instances) {
			if (!isRecord(value)) return { kind: "conversation" };
			if (value.kind === "conversation") return { kind: "conversation" };
			if (value.kind === "workbench-home") return { kind: "workbench-home" };
			if (value.kind !== "workbench-instance") return { kind: "conversation" };
			const instanceId = stringValue(value.instanceId);
			const presentation = value.presentation;
			if (instanceId === void 0 || !instances.some((item) => item.instanceId === instanceId)) return { kind: "workbench-home" };
			if (presentation !== "page" && presentation !== "panel" && presentation !== "capsule") return {
				kind: "workbench-instance",
				instanceId,
				presentation: "page"
			};
			return {
				kind: "workbench-instance",
				instanceId,
				presentation
			};
		}
		function parseStored(raw) {
			if (raw === null) return void 0;
			try {
				const parsed = JSON.parse(raw);
				if (!isRecord(parsed) || !Array.isArray(parsed.instances)) return void 0;
				const instances = parseInstances(parsed.instances);
				if (parsed.version === STORAGE_VERSION) return {
					version: STORAGE_VERSION,
					route: parseRoute(parsed.route, instances),
					instances
				};
				if (parsed.version === 1) {
					const currentInstanceId = stringValue(parsed.currentInstanceId);
					return {
						version: STORAGE_VERSION,
						route: currentInstanceId !== void 0 && instances.some((item) => item.instanceId === currentInstanceId) ? {
							kind: "workbench-instance",
							instanceId: currentInstanceId,
							presentation: "page"
						} : { kind: "conversation" },
						instances
					};
				}
				return;
			} catch {
				return;
			}
		}
		function loadStored(storage) {
			if (storage === void 0) return defaultStored();
			return parseStored(storage.getItem(STORAGE_KEY)) ?? parseStored(storage.getItem(LEGACY_STORAGE_KEY)) ?? defaultStored();
		}
		function samePresentationKind(presentation, kind) {
			return presentation.kind === kind;
		}
		function validateApp(definition) {
			if (definition.protocolVersion !== 1) throw new Error(`Unsupported workbench protocol: ${String(definition.protocolVersion)}`);
			if (!ID_PATTERN.test(definition.appId)) throw new Error(`Invalid workbench appId: ${definition.appId}`);
			if (definition.title.trim() === "") throw new Error("Workbench title cannot be empty");
			if (definition.presentations.length === 0) throw new Error(`Workbench app has no presentations: ${definition.appId}`);
			const kinds = /* @__PURE__ */ new Set();
			for (const presentation of definition.presentations) {
				if (kinds.has(presentation.kind)) throw new Error(`Duplicate workbench presentation: ${definition.appId}/${presentation.kind}`);
				kinds.add(presentation.kind);
				if (presentation.kind === "page" && presentation.conversation !== "exclusive") throw new Error("Page presentations must be exclusive");
				if (presentation.kind === "panel" && presentation.conversation !== "resident") throw new Error("Panel presentations must keep conversation resident");
				if (presentation.kind === "capsule" && presentation.conversation !== "resident") throw new Error("Capsule presentations must keep conversation resident");
			}
			if (!kinds.has(definition.defaultPresentation)) throw new Error(`Unknown default presentation: ${definition.defaultPresentation}`);
			if (kinds.has("page") && definition.renderMain === void 0) throw new Error(`Page renderer is required: ${definition.appId}`);
			if (kinds.has("panel") && definition.renderPanel === void 0) throw new Error(`Panel renderer is required: ${definition.appId}`);
			if (kinds.has("capsule") && definition.renderCapsule === void 0) throw new Error(`Capsule renderer is required: ${definition.appId}`);
			if (definition.defaultInstance?.config !== void 0) cloneConfig(definition.defaultInstance.config);
		}
		function validateTemplate(definition) {
			if (!ID_PATTERN.test(definition.templateId)) throw new Error(`Invalid workbench templateId: ${definition.templateId}`);
			if (definition.title.trim() === "") throw new Error("Workbench template title cannot be empty");
			if (definition.kind === "instance") {
				if (!ID_PATTERN.test(definition.appId)) throw new Error(`Instance template requires a valid appId: ${definition.templateId}`);
				if (definition.defaultConfig !== void 0) cloneConfig(definition.defaultConfig);
			} else if (!ID_PATTERN.test(definition.creatorId)) throw new Error(`Agent template requires a valid creatorId: ${definition.templateId}`);
		}
		/** Runtime registries and local durable state for workbench applications. */
		var WorkbenchController = class {
			storage;
			apps = /* @__PURE__ */ new Map();
			templates = /* @__PURE__ */ new Map();
			creators = /* @__PURE__ */ new Map();
			instances;
			route;
			snapshot;
			listeners = /* @__PURE__ */ new Set();
			constructor(storage = storageFromGlobal()) {
				this.storage = storage;
				const stored = loadStored(storage);
				this.instances = stored.instances;
				this.route = stored.route;
				this.snapshot = this.buildSnapshot();
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
			registerApp(definition) {
				validateApp(definition);
				if (this.apps.has(definition.appId)) throw new Error(`Workbench app already registered: ${definition.appId}`);
				this.apps.set(definition.appId, definition);
				let persisted = false;
				if (definition.defaultInstance !== void 0 && !this.instances.some((item) => item.appId === definition.appId)) {
					const requestedId = definition.defaultInstance.instanceId ?? createId(definition.appId);
					if (!ID_PATTERN.test(requestedId) || this.instances.some((item) => item.instanceId === requestedId)) {
						this.apps.delete(definition.appId);
						throw new Error(`Invalid default workbench instanceId: ${requestedId}`);
					}
					this.instances.push({
						instanceId: requestedId,
						appId: definition.appId,
						title: definition.defaultInstance.title?.trim() || definition.title,
						config: cloneConfig(definition.defaultInstance.config ?? {}),
						order: this.instances.length,
						updatedAt: Date.now()
					});
					persisted = true;
				}
				this.rebuild(persisted);
				let active = true;
				return () => {
					if (!active) return;
					active = false;
					if (this.apps.get(definition.appId) === definition) {
						this.apps.delete(definition.appId);
						this.rebuild(false);
					}
				};
			}
			getApp(appId) {
				return this.apps.get(appId);
			}
			registerTemplate(definition) {
				validateTemplate(definition);
				if (this.templates.has(definition.templateId)) throw new Error(`Workbench template already registered: ${definition.templateId}`);
				const owned = definition.kind === "instance" ? {
					...definition,
					defaultConfig: definition.defaultConfig === void 0 ? void 0 : cloneConfig(definition.defaultConfig)
				} : { ...definition };
				this.templates.set(definition.templateId, owned);
				this.rebuild(false);
				let active = true;
				return () => {
					if (!active) return;
					active = false;
					if (this.templates.get(definition.templateId) === owned) {
						this.templates.delete(definition.templateId);
						this.rebuild(false);
					}
				};
			}
			getTemplate(templateId) {
				return this.templates.get(templateId);
			}
			registerCreator(definition) {
				if (!ID_PATTERN.test(definition.creatorId)) throw new Error(`Invalid workbench creatorId: ${definition.creatorId}`);
				if (this.creators.has(definition.creatorId)) throw new Error(`Workbench creator already registered: ${definition.creatorId}`);
				this.creators.set(definition.creatorId, definition);
				this.rebuild(false);
				let active = true;
				return () => {
					if (!active) return;
					active = false;
					if (this.creators.get(definition.creatorId) === definition) {
						this.creators.delete(definition.creatorId);
						this.rebuild(false);
					}
				};
			}
			createInstance(appId, title, config = {}) {
				const app = this.apps.get(appId);
				if (app === void 0) throw new Error(`Unknown workbench app: ${appId}`);
				const existing = this.instances.find((item) => item.appId === appId);
				if (app.allowMultiple !== true && existing !== void 0) return this.publicInstance(existing);
				const instance = {
					instanceId: createId(appId),
					appId,
					title: title?.trim() || app.title,
					config: cloneConfig(config),
					order: this.instances.length,
					updatedAt: Date.now()
				};
				this.instances.push(instance);
				this.rebuild(true);
				return this.publicInstance(instance);
			}
			startCreation(templateId) {
				const template = this.templates.get(templateId);
				if (template === void 0) throw new Error(`Unknown workbench template: ${templateId}`);
				if (template.kind === "instance") return this.createInstance(template.appId, template.defaultTitle, template.defaultConfig ?? {});
				const creator = this.creators.get(template.creatorId);
				if (creator === void 0) throw new Error(`Workbench template creator is unavailable: ${template.creatorId}`);
				creator.start({ ...template });
			}
			renameInstance(instanceId, title) {
				const value = title.trim();
				if (value === "") throw new Error("Workbench title cannot be empty");
				const instance = this.requireInstance(instanceId);
				instance.title = value;
				instance.updatedAt = Date.now();
				this.rebuild(true);
			}
			updateInstanceConfig(instanceId, patch) {
				const instance = this.requireInstance(instanceId);
				instance.config = {
					...instance.config,
					...cloneConfig(patch)
				};
				instance.updatedAt = Date.now();
				this.rebuild(true);
			}
			reorderInstances(instanceIds) {
				const byId = new Map(this.instances.map((item) => [item.instanceId, item]));
				const ordered = instanceIds.flatMap((id) => {
					const item = byId.get(id);
					if (item === void 0) return [];
					byId.delete(id);
					return [item];
				});
				ordered.push(...byId.values());
				ordered.forEach((item, index) => {
					item.order = index;
				});
				this.instances.splice(0, this.instances.length, ...ordered);
				this.rebuild(true);
			}
			open(instanceId, presentation) {
				const instance = this.requireInstance(instanceId);
				const app = this.apps.get(instance.appId);
				const nextPresentation = presentation ?? app?.defaultPresentation ?? "page";
				if (app !== void 0 && !app.presentations.some((item) => samePresentationKind(item, nextPresentation))) throw new Error(`Unsupported workbench presentation: ${instance.appId}/${nextPresentation}`);
				instance.updatedAt = Date.now();
				this.route = {
					kind: "workbench-instance",
					instanceId,
					presentation: nextPresentation
				};
				this.rebuild(true);
			}
			openHome() {
				if (this.route.kind === "workbench-home") return;
				this.route = { kind: "workbench-home" };
				this.rebuild(true);
			}
			openConversation() {
				if (this.route.kind === "conversation") return;
				this.route = { kind: "conversation" };
				this.rebuild(true);
			}
			close() {
				this.openConversation();
			}
			requireInstance(instanceId) {
				const instance = this.instances.find((item) => item.instanceId === instanceId);
				if (instance === void 0) throw new Error(`Unknown workbench instance: ${instanceId}`);
				return instance;
			}
			publicInstance(instance) {
				return {
					...instance,
					config: cloneConfig(instance.config),
					available: this.apps.has(instance.appId)
				};
			}
			templateSummary(template) {
				if (template.kind === "instance") return {
					...template,
					defaultConfig: template.defaultConfig === void 0 ? void 0 : cloneConfig(template.defaultConfig),
					available: this.apps.has(template.appId)
				};
				return {
					...template,
					available: this.creators.has(template.creatorId)
				};
			}
			buildSnapshot() {
				return {
					apps: [...this.apps.values()].map((app) => ({
						appId: app.appId,
						title: app.title,
						icon: app.icon,
						description: app.description,
						allowMultiple: app.allowMultiple === true,
						presentations: app.presentations.map((item) => ({ ...item })),
						defaultPresentation: app.defaultPresentation
					})),
					instances: [...this.instances].sort((a, b) => a.order - b.order).map((instance) => this.publicInstance(instance)),
					templates: [...this.templates.values()].map((template) => this.templateSummary(template)),
					route: { ...this.route },
					currentInstanceId: this.route.kind === "workbench-instance" ? this.route.instanceId : null
				};
			}
			rebuild(persist) {
				this.snapshot = this.buildSnapshot();
				if (persist) this.persist();
				for (const listener of [...this.listeners]) try {
					listener();
				} catch (error) {
					console.error("[dsh-workbench] snapshot listener failed", error);
				}
			}
			persist() {
				if (this.storage === void 0) return;
				const state = {
					version: STORAGE_VERSION,
					route: { ...this.route },
					instances: this.instances.map((instance) => ({
						...instance,
						config: cloneConfig(instance.config)
					}))
				};
				try {
					this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
				} catch {}
			}
		};
		//#endregion
		//#region src/client/WorkbenchSidebar.tsx
		function useWorkbenchSnapshot$1(service) {
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
				className: "dsh-workbench-sidebar-row dsh-workbench-sidebar-home",
				"data-active": active,
				onClick: onOpen,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchHomeIcon, { className: "dsh-workbench-sidebar-home-icon" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dsh-workbench-sidebar-row-label",
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
						className: "dsh-workbench-sidebar-icon-button dsh-workbench-sidebar-wide-only",
						"aria-label": "视图选项",
						onClick: () => {
							setOpen((value) => !value);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16, {})
					})
				})
			});
		}
		function WorkbenchRow({ instance, compact, active, draggable, dropPosition, onOpen, onRename, onDragStart, onDragOver, onDrop, onDragEnd }) {
			const [menuOpen, setMenuOpen] = (0, react.useState)(false);
			const [renaming, setRenaming] = (0, react.useState)(false);
			const [renameDraft, setRenameDraft] = (0, react.useState)(instance.title);
			const input = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (renaming) input.current?.focus();
			}, [renaming]);
			const commitRename = () => {
				const next = renameDraft.trim();
				if (next !== "" && next !== instance.title) onRename(next);
				setRenaming(false);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-workbench-sidebar-row",
				"data-active": active,
				"data-menu-open": menuOpen,
				"data-drop-position": dropPosition ?? void 0,
				role: "button",
				tabIndex: compact ? -1 : 0,
				draggable: draggable && !renaming,
				onClick: onOpen,
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						onOpen();
					}
				},
				onDragStart,
				onDragOver,
				onDrop,
				onDragEnd,
				children: [
					compact && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16, { className: "dsh-workbench-sidebar-rail-icon" }),
					renaming ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: input,
						className: "dsh-workbench-sidebar-rename",
						value: renameDraft,
						"aria-label": "工作台名称",
						onChange: (event) => {
							setRenameDraft(event.target.value);
						},
						onClick: (event) => {
							event.stopPropagation();
						},
						onBlur: commitRename,
						onKeyDown: (event) => {
							if (event.key === "Enter") commitRename();
							if (event.key === "Escape") setRenaming(false);
						}
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-workbench-sidebar-row-label",
						children: instance.title
					}),
					!compact && !renaming && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-workbench-sidebar-row-actions",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
							open: menuOpen,
							onClose: () => {
								setMenuOpen(false);
							},
							items: [{
								id: "rename",
								label: "重命名",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutline16, {})
							}],
							onSelect: (id) => {
								setMenuOpen(false);
								if (id === "rename") {
									setRenameDraft(instance.title);
									setRenaming(true);
								}
							},
							dense: true,
							portal: true,
							closeOnPointerLeave: true,
							anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dsh-workbench-sidebar-row-action",
								"aria-label": `工作台“${instance.title}”的操作`,
								title: "更多操作",
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
			const snapshot = useWorkbenchSnapshot$1(service);
			const section = (0, react.useRef)(null);
			const searchRoot = (0, react.useRef)(null);
			const searchInput = (0, react.useRef)(null);
			const [compact, setCompact] = (0, react.useState)(false);
			const [searchExpanded, setSearchExpanded] = (0, react.useState)(false);
			const [query, setQuery] = (0, react.useState)("");
			const [orderBy, setOrderBy] = (0, react.useState)("manual");
			const [draggedId, setDraggedId] = (0, react.useState)(null);
			const [dropTarget, setDropTarget] = (0, react.useState)(null);
			const normalizedQuery = normalize(query);
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
			const handleDrop = (targetId, event) => {
				event.preventDefault();
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
				const hidden = snapshot.instances.map((instance) => instance.instanceId).filter((id) => !nextVisible.includes(id));
				service.reorderInstances([...nextVisible, ...hidden]);
				setDraggedId(null);
				setDropTarget(null);
			};
			if (compact) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
				ref: section,
				className: "dsh-workbench-sidebar-section",
				"aria-label": "工作台",
				"data-compact": "true"
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				ref: section,
				className: "dsh-workbench-sidebar-section",
				"aria-label": "工作台",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-workbench-sidebar-heading",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `dsh-workbench-sidebar-heading-label${searchExpanded && !compact ? " is-hidden" : ""}`,
								children: "工作台"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								ref: searchRoot,
								className: `dsh-workbench-sidebar-search-slot${searchExpanded ? " is-expanded" : ""}`,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-workbench-sidebar-search",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
											label: "搜索工作台",
											side: "bottom",
											delayMs: 500,
											disabled: searchExpanded,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh-workbench-sidebar-search-button",
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
											className: "dsh-workbench-sidebar-search-input",
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
											className: "dsh-workbench-sidebar-search-clear",
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
								className: `dsh-workbench-sidebar-heading-actions${searchExpanded && !compact ? " is-hidden" : ""}`,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ViewOptionsMenu, {
									orderBy,
									onOrderPick: setOrderBy
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
									label: "创建工作台",
									side: "bottom",
									delayMs: 500,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-workbench-sidebar-icon-button dsh-workbench-sidebar-add",
										"aria-label": "创建工作台",
										onClick: () => {
											setSearchExpanded(false);
											service.openHome();
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconProjectAddOutline16, { size: 16 })
									})
								})]
							})
						]
					}),
					compact && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-workbench-sidebar-rail-search",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
							label: "搜索工作台",
							side: "right",
							delayMs: 500,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dsh-workbench-sidebar-search-button",
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
						className: "dsh-workbench-sidebar-list",
						"aria-label": "工作台列表",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchHomeRow, {
							active: snapshot.route.kind === "workbench-home",
							onOpen: () => {
								service.openHome();
							}
						}), instances.map((instance) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchRow, {
							instance,
							compact,
							active: snapshot.route.kind === "workbench-instance" && snapshot.route.instanceId === instance.instanceId,
							draggable: orderBy === "manual",
							dropPosition: dropTarget?.id === instance.instanceId ? dropTarget.position : null,
							onOpen: () => {
								service.open(instance.instanceId);
							},
							onRename: (title) => {
								service.renameInstance(instance.instanceId, title);
							},
							onDragStart: (event) => {
								setDraggedId(instance.instanceId);
								event.dataTransfer.effectAllowed = "move";
								event.dataTransfer.setData("text/plain", instance.instanceId);
							},
							onDragOver: (event) => {
								if (draggedId === null || draggedId === instance.instanceId) return;
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
					instances.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-workbench-sidebar-empty",
						children: normalizedQuery === "" ? "从首页创建实例。" : "无匹配工作台"
					})
				]
			});
		}
		//#endregion
		//#region src/client/WorkbenchHome.tsx
		function WorkbenchCard({ badge, description, disabled = false, id, onOpen, title, footer }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: "dsh-workbench-home-card",
				"data-disabled": disabled,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dsh-workbench-home-card-main",
					"aria-label": disabled ? `${title}：${badge}` : title,
					disabled,
					onClick: onOpen,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "dsh-workbench-home-card-head",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-workbench-home-card-name",
								children: title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dsh-workbench-home-card-badge",
								children: badge
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-workbench-home-card-description",
							children: description
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							className: "dsh-workbench-home-card-id",
							children: id
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-workbench-home-card-foot",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: footer })
				})]
			});
		}
		function AppCard({ app, onCreate }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchCard, {
				badge: "应用",
				description: app.description ?? "从默认配置创建新的工作台实例",
				id: app.appId,
				onOpen: onCreate,
				title: app.title,
				footer: "创建实例"
			});
		}
		function TemplateCard({ template, onCreate }) {
			const unavailableReason = template.kind === "agent" ? "需要 Agent Creator" : "对应应用暂不可用";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchCard, {
				badge: template.available ? "模板" : unavailableReason,
				description: template.description ?? "从预设配置创建新的工作台实例",
				disabled: !template.available,
				id: template.templateId,
				onOpen: onCreate,
				title: template.title,
				footer: "使用模板"
			});
		}
		function InstanceCard({ appTitle, available, instanceId, title, onOpen }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchCard, {
				badge: available ? "可用" : "不可用",
				description: available ? appTitle : `应用暂不可用 · ${appTitle}`,
				id: instanceId,
				onOpen,
				title,
				footer: available ? "打开工作台" : "查看状态"
			});
		}
		/** Built-in hub page that remains available without third-party applications. */
		function WorkbenchHome({ service, snapshot }) {
			const [creating, setCreating] = (0, react.useState)(false);
			const availableInstances = (0, react.useMemo)(() => snapshot.instances.filter((instance) => instance.available), [snapshot.instances]);
			const unavailableInstances = (0, react.useMemo)(() => snapshot.instances.filter((instance) => !instance.available), [snapshot.instances]);
			const templatedAppIds = (0, react.useMemo)(() => new Set(snapshot.templates.flatMap((template) => template.kind === "instance" ? [template.appId] : [])), [snapshot.templates]);
			const appsWithoutTemplates = (0, react.useMemo)(() => snapshot.apps.filter((app) => !templatedAppIds.has(app.appId)), [snapshot.apps, templatedAppIds]);
			const createApp = (app) => {
				const instance = service.createInstance(app.appId);
				service.open(instance.instanceId, app.defaultPresentation);
			};
			const createTemplate = (template) => {
				const instance = service.startCreation(template.templateId);
				if (instance === void 0) return;
				const app = snapshot.apps.find((item) => item.appId === instance.appId);
				service.open(instance.instanceId, app?.defaultPresentation);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("main", {
				className: "dsh-workbench-home",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dsh-workbench-home-header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Workbench" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: "工作台" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-workbench-home-actions",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "dsh-workbench-home-add-button",
								"aria-expanded": creating,
								onClick: () => {
									setCreating((value) => !value);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "创建工作台" })]
							})
						})]
					}),
					creating && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-workbench-home-section",
						"aria-label": "创建工作台",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-workbench-home-section-heading",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "创建工作台" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "从已安装应用或模板开始" })]
							}),
							snapshot.templates.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-workbench-home-grid",
								children: snapshot.templates.map((template) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TemplateCard, {
									template,
									onCreate: () => {
										createTemplate(template);
									}
								}, template.templateId))
							}),
							appsWithoutTemplates.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-workbench-home-grid",
								children: appsWithoutTemplates.map((app) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AppCard, {
									app,
									onCreate: () => {
										createApp(app);
									}
								}, app.appId))
							}) : snapshot.templates.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-workbench-home-empty",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "暂无可用的工作台应用" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "安装工作台应用后，可在这里创建实例。" })]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-workbench-home-section",
						"aria-label": "已有工作台",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-workbench-home-section-heading",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "已有工作台" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [snapshot.instances.length, " 个实例"] })]
						}), snapshot.instances.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-workbench-home-empty",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "还没有工作台" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "从已安装应用或模板创建第一个实例。" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {}),
									onClick: () => {
										setCreating(true);
									},
									children: "创建第一个工作台"
								})
							]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-workbench-home-grid dsh-workbench-home-instance-grid",
							children: [availableInstances.map((instance) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstanceCard, {
								instanceId: instance.instanceId,
								title: instance.title,
								available: true,
								appTitle: snapshot.apps.find((app) => app.appId === instance.appId)?.title ?? instance.appId,
								onOpen: () => {
									service.open(instance.instanceId);
								}
							}, instance.instanceId)), unavailableInstances.map((instance) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstanceCard, {
								instanceId: instance.instanceId,
								title: instance.title,
								available: false,
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
		function useWorkbenchSnapshot(service) {
			return (0, react.useSyncExternalStore)((listener) => service.subscribe(listener), () => service.getSnapshot(), () => service.getSnapshot());
		}
		/** Compatibility surface; a future DSH center-page Slot can host this component unchanged. */
		function WorkbenchSurface({ service }) {
			const snapshot = useWorkbenchSnapshot(service);
			const route = snapshot.route;
			const open = route.kind !== "conversation";
			const presentation = resolveActivePresentation(snapshot, service);
			if (route.kind === "conversation") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-workbench-center",
				"data-open": "false",
				"aria-hidden": "true"
			});
			if (route.kind === "workbench-home") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-workbench-center",
				"data-open": "true",
				"data-kind": "page",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchHome, {
					service,
					snapshot
				})
			});
			const instance = snapshot.instances.find((item) => item.instanceId === route.instanceId);
			const app = instance === void 0 ? void 0 : service.getApp(instance.appId);
			const effectivePresentation = presentation ?? {
				kind: "page",
				conversation: "exclusive"
			};
			const renderProps = instance === void 0 ? void 0 : {
				instance,
				presentation: effectivePresentation,
				updateConfig: (patch) => {
					service.updateInstanceConfig(instance.instanceId, patch);
				},
				close: () => {
					service.openConversation();
				},
				openHome: () => {
					service.openHome();
				},
				openConversation: () => {
					service.openConversation();
				}
			};
			const unavailable = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-workbench-unavailable",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "工作台应用暂不可用" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: instance === void 0 ? "实例不存在" : `应用标识：${instance.appId}` }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						size: "sm",
						onClick: () => {
							service.openHome();
						},
						children: "返回首页"
					})
				]
			});
			if (effectivePresentation.kind === "panel") {
				const Panel = app?.renderPanel;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-workbench-center",
					"data-open": open,
					"data-kind": "panel",
					"data-placement": effectivePresentation.placement,
					"data-behavior": effectivePresentation.behavior,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("aside", {
						className: "dsh-workbench-panel",
						"aria-label": instance?.title ?? "工作台面板",
						children: Panel !== void 0 && renderProps !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Panel, { ...renderProps }) : unavailable
					})
				});
			}
			if (effectivePresentation.kind === "capsule") {
				const Capsule = app?.renderCapsule;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dsh-workbench-center",
					"data-open": open,
					"data-kind": "capsule",
					"data-placement": effectivePresentation.placement,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("aside", {
						className: "dsh-workbench-capsule",
						"aria-label": instance?.title ?? "工作台胶囊",
						children: Capsule !== void 0 && renderProps !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Capsule, { ...renderProps }) : unavailable
					})
				});
			}
			const Main = app?.renderMain;
			const Secondary = app?.renderSecondary;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-workbench-center",
				"data-open": open,
				"data-kind": "page",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-workbench-center-body",
					children: [Secondary !== void 0 && renderProps !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("aside", {
						className: "dsh-workbench-center-secondary",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Secondary, { ...renderProps })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("main", {
						className: "dsh-workbench-center-main",
						children: Main !== void 0 && renderProps !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Main, { ...renderProps }) : unavailable
					})]
				})
			});
		}
		//#endregion
		//#region src/client/styles.ts
		const WORKBENCH_STYLE = `
[data-dsh-workbench-sidebar] {
  flex: none;
  width: 100%;
  min-height: 0;
  container-type: inline-size;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-s-14);
}
[data-dsh-workbench-sidebar] *, [data-dsh-workbench-center] * { box-sizing: border-box; }
.dsh-workbench-sidebar-section {
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding-right: var(--dsh-sidebar-inline-padding);
}
.dsh-workbench-sidebar-heading {
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
.dsh-workbench-sidebar-heading-label {
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
.dsh-workbench-sidebar-heading-label.is-hidden {
  max-width: 0;
  margin-right: -4px;
  opacity: 0;
  transform: translateX(-4px);
  visibility: hidden;
  transition-delay: 0s, 0s, 0s, 180ms;
}
.dsh-workbench-sidebar-icon-button,
.dsh-workbench-sidebar-search-button,
.dsh-workbench-sidebar-row-action {
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
.dsh-workbench-sidebar-icon-button,
.dsh-workbench-sidebar-search-button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.dsh-workbench-sidebar-icon-button:hover,
.dsh-workbench-sidebar-search-button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-workbench-sidebar-search-slot {
  flex: 1;
  max-width: 28px;
  min-width: 0;
  display: flex;
  align-items: center;
  margin-left: auto;
  transition: max-width 180ms var(--ds-ease-in-out), padding-left 180ms var(--ds-ease-in-out);
}
.dsh-workbench-sidebar-search-slot.is-expanded {
  max-width: 100%;
  padding-left: 0;
}
.dsh-workbench-sidebar-search {
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
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search {
  width: calc(100% + 4px);
  height: 30px;
  margin-inline: -2px;
  padding: 0 4px 0 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: transparent;
  color: var(--dsw-alias-label-caption);
}
.dsh-workbench-sidebar-search-button { color: inherit; }
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search-button { width: 28px; height: 30px; }
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search-button:hover { background: transparent; }
.dsh-workbench-sidebar-search-input {
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
.dsh-workbench-sidebar-search-slot.is-expanded .dsh-workbench-sidebar-search-input {
  margin-left: -2px;
  opacity: 1;
  pointer-events: auto;
}
.dsh-workbench-sidebar-search-input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-workbench-sidebar-search-clear {
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
.dsh-workbench-sidebar-search-clear:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-workbench-sidebar-heading-actions {
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
.dsh-workbench-sidebar-heading-actions.is-hidden {
  max-width: 0;
  opacity: 0;
  transform: translateX(4px);
  visibility: hidden;
  pointer-events: none;
  transition-delay: 0s, 0s, 0s, 180ms;
}
.dsh-workbench-sidebar-rail-search { display: none; }
.dsh-workbench-sidebar-list {
  display: grid;
  gap: 2px;
  min-height: 0;
}
.dsh-workbench-sidebar-row {
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
.dsh-workbench-sidebar-row:hover,
.dsh-workbench-sidebar-row[data-active="true"],
.dsh-workbench-sidebar-row[data-menu-open="true"] {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-workbench-sidebar-row[data-drop-position="before"]::before,
.dsh-workbench-sidebar-row[data-drop-position="after"]::after {
  content: '';
  position: absolute;
  left: 0;
  right: 4px;
  height: 2px;
  background: var(--dsw-alias-state-business-primary);
  pointer-events: none;
}
.dsh-workbench-sidebar-row[data-drop-position="before"]::before { top: -1px; }
.dsh-workbench-sidebar-row[data-drop-position="after"]::after { bottom: -1px; }
.dsh-workbench-sidebar-home {
  width: 100%;
  border: 0;
}
.dsh-workbench-sidebar-home-icon {
  flex: none;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-workbench-sidebar-row-label {
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
.dsh-workbench-sidebar-row-actions {
  flex: none;
  display: none;
  align-items: center;
  gap: 12px;
  height: 20px;
}
.dsh-workbench-sidebar-row:hover .dsh-workbench-sidebar-row-actions,
.dsh-workbench-sidebar-row[data-menu-open="true"] .dsh-workbench-sidebar-row-actions { display: inline-flex; }
.dsh-workbench-sidebar-row-action {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-workbench-sidebar-row-action:hover { color: var(--dsw-alias-label-primary); }
.dsh-workbench-sidebar-rename {
  flex: 1;
  min-width: 0;
  height: 22px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 4px;
  padding: 0 2px;
  outline: none;
  color: inherit;
  background: var(--dsw-alias-button-elevated-fill);
  font: var(--dsw-font-s-14);
}
.dsh-workbench-sidebar-empty {
  padding: 10px 12px;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-xs-13);
}
.dsh-workbench-center {
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
.dsh-workbench-center[data-open="false"] { display: none; }
.dsh-workbench-center-body {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.dsh-workbench-center-secondary {
  flex: none;
  width: 224px;
  min-height: 0;
  overflow: auto;
  border-right: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-specific-sidebar-fill);
}
.dsh-workbench-center-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
/* Keep both Workbench scroll surfaces usable without permanent visual rails. */
.dsh-workbench-center-secondary,
.dsh-workbench-center-main { scrollbar-width: none; }
.dsh-workbench-center-secondary::-webkit-scrollbar,
.dsh-workbench-center-main::-webkit-scrollbar { width: 0; height: 0; }
.dsh-workbench-center-secondary:hover,
.dsh-workbench-center-secondary:focus-within,
.dsh-workbench-center-main:hover,
.dsh-workbench-center-main:focus-within { scrollbar-width: thin; scrollbar-color: var(--dsw-alias-border-l3) transparent; }
.dsh-workbench-center-secondary:hover::-webkit-scrollbar,
.dsh-workbench-center-secondary:focus-within::-webkit-scrollbar,
.dsh-workbench-center-main:hover::-webkit-scrollbar,
.dsh-workbench-center-main:focus-within::-webkit-scrollbar { width: 6px; height: 6px; }
.dsh-workbench-center-secondary:hover::-webkit-scrollbar-thumb,
.dsh-workbench-center-secondary:focus-within::-webkit-scrollbar-thumb,
.dsh-workbench-center-main:hover::-webkit-scrollbar-thumb,
.dsh-workbench-center-main:focus-within::-webkit-scrollbar-thumb { border-radius: 6px; background: var(--dsw-alias-border-l3); }
.dsh-workbench-center-secondary::-webkit-scrollbar-track,
.dsh-workbench-center-main::-webkit-scrollbar-track { background: transparent; }
.dsh-workbench-unavailable {
  display: grid;
  justify-items: center;
  gap: 8px;
  max-width: 430px;
  margin: auto;
  padding: 28px;
  color: var(--dsw-alias-label-secondary);
  text-align: center;
}
.dsh-workbench-unavailable strong { color: var(--dsw-alias-label-primary); }
.dsh-workbench-unavailable > button { margin-top: 8px; }
.dsh-workbench-home {
  width: 100%;
  min-height: 100%;
  overflow: auto;
  padding: 40px clamp(24px, 6cqw, 72px) 64px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-base);
}
.dsh-workbench-home-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  max-width: 1040px;
  margin: 0 auto 36px;
}
.dsh-workbench-home-header > div:first-child { min-width: 0; }
.dsh-workbench-home-header span:first-child {
  display: block;
  margin-bottom: 4px;
  color: var(--dsw-alias-label-tertiary);
  font: var(--dsw-font-xs-13);
}
.dsh-workbench-home-header h1 {
  margin: 0;
  font-size: 28px;
  line-height: 36px;
  font-weight: 650;
  letter-spacing: 0;
}
.dsh-workbench-home-actions { flex: none; display: flex; align-items: center; }
.dsh-workbench-home-add-button {
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
.dsh-workbench-home-add-button:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-workbench-home-add-button:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}
.dsh-workbench-home-add-button[aria-expanded="true"] { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-workbench-home-section {
  max-width: 1040px;
  margin: 0 auto 36px;
}
.dsh-workbench-home-section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.dsh-workbench-home-section-heading h2 {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: 0;
}
.dsh-workbench-home-section-heading span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-workbench-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
}
.dsh-workbench-home-grid + .dsh-workbench-home-grid { margin-top: 12px; }
.dsh-workbench-home-card {
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
.dsh-workbench-home-card:hover:not([data-disabled="true"]) {
  border-color: var(--dsw-alias-label-dimmed);
}
.dsh-workbench-home-card[data-disabled="true"] {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-workbench-home-card-main {
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
.dsh-workbench-home-card-main:hover:not(:disabled) { background: var(--dsw-alias-bg-layer-2); }
.dsh-workbench-home-card-main:disabled { cursor: default; }
.dsh-workbench-home-card-main:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -2px;
}
.dsh-workbench-home-card-head {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}
.dsh-workbench-home-card-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.dsh-workbench-home-card-badge {
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
.dsh-workbench-home-card-description {
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
.dsh-workbench-home-card-id {
  min-width: 0;
  margin-top: auto;
  overflow: hidden;
  color: var(--dsw-alias-label-dimmed);
  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-workbench-home-card-foot {
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
.dsh-workbench-home-card[data-disabled="true"] .dsh-workbench-home-card-foot { color: var(--dsw-alias-state-error-primary); }
.dsh-workbench-home-empty {
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
.dsh-workbench-home-empty strong { color: var(--dsw-alias-label-primary); font: var(--dsw-font-s-strong-14); }
.dsh-workbench-home-empty span { font: var(--dsw-font-xs-13); }
.dsh-workbench-home-empty > button { margin-top: 4px; }
.dsh-workbench-center[data-kind="panel"],
.dsh-workbench-center[data-kind="capsule"] {
  pointer-events: none;
  background: transparent;
}
.dsh-workbench-panel,
.dsh-workbench-capsule {
  position: absolute;
  pointer-events: auto;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: var(--dsw-shadow-lv3);
}
.dsh-workbench-center[data-kind="panel"][data-placement="right"] .dsh-workbench-panel {
  top: 0;
  right: 0;
  bottom: 0;
  width: min(360px, 100%);
  border-left: 1px solid var(--dsw-alias-border-l2);
  overflow: auto;
}
.dsh-workbench-center[data-kind="panel"][data-placement="bottom"] .dsh-workbench-panel {
  right: 0;
  bottom: 0;
  left: 0;
  height: min(280px, 55%);
  border-top: 1px solid var(--dsw-alias-border-l2);
  overflow: auto;
}
.dsh-workbench-capsule {
  right: 16px;
  bottom: 16px;
  max-width: min(420px, calc(100% - 32px));
  max-height: min(320px, calc(100% - 32px));
  overflow: auto;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
}
@container (max-width: 170px) {
  .dsh-workbench-sidebar-section { padding-right: 0; }
  .dsh-workbench-sidebar-heading { justify-content: flex-start; gap: 0; padding-left: 0; margin-right: 0; margin-bottom: 12px; }
  .dsh-workbench-sidebar-heading-label,
  .dsh-workbench-sidebar-search-slot,
  .dsh-workbench-sidebar-wide-only,
  .dsh-workbench-sidebar-empty { display: none; }
  .dsh-workbench-sidebar-heading-actions { max-width: none; }
  .dsh-workbench-sidebar-add { width: 36px; height: 36px; }
  .dsh-workbench-sidebar-rail-search { display: block; width: 36px; height: 36px; margin-bottom: 12px; }
  .dsh-workbench-sidebar-rail-search .dsh-workbench-sidebar-search-button { width: 36px; height: 36px; color: var(--dsw-alias-label-primary); }
  .dsh-workbench-sidebar-list { justify-items: center; }
  .dsh-workbench-sidebar-row { width: 36px; justify-content: center; padding: 0; }
  .dsh-workbench-sidebar-row-label,
  .dsh-workbench-sidebar-row-actions { display: none; }
  .dsh-workbench-sidebar-rail-icon { display: block; color: var(--dsw-alias-label-primary); }
}
@container (max-width: 720px) {
  .dsh-workbench-home { padding: 24px 16px 48px; }
  .dsh-workbench-home-header { align-items: center; margin-bottom: 28px; }
  .dsh-workbench-home-header h1 { font-size: 22px; line-height: 30px; }
  .dsh-workbench-home-section-heading { align-items: flex-start; flex-direction: column; gap: 2px; }
  .dsh-workbench-home-grid { grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .dsh-workbench-home-card { min-height: 128px; }
  .dsh-workbench-center-body { flex-direction: column; overflow: auto; scrollbar-width: none; }
  .dsh-workbench-center-body::-webkit-scrollbar { width: 0; height: 0; }
  .dsh-workbench-center-secondary { width: 100%; min-height: auto; overflow: visible; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l2); }
  .dsh-workbench-center-main { flex: none; overflow: visible; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-workbench-sidebar-heading-label,
  .dsh-workbench-sidebar-search-slot,
  .dsh-workbench-sidebar-search,
  .dsh-workbench-sidebar-search-input,
  .dsh-workbench-sidebar-heading-actions { transition: none; }
}
`;
		//#endregion
		//#region src/client/index.ts
		function asElement(value) {
			return value instanceof Element ? value : null;
		}
		function workbenchAnchor() {
			return document.querySelector("[data-slot=\"sidebar.workspaces\"]") ?? void 0;
		}
		function conversationSlot(parent) {
			return parent.querySelector("[data-slot=\"conversation\"]") ?? void 0;
		}
		function syncConversationPresentation(center, service) {
			const slot = conversationSlot(center.parent);
			if (slot === void 0) return;
			const snapshot = service.getSnapshot();
			const presentation = resolveActivePresentation(snapshot, service);
			const hidden = snapshot.route.kind === "workbench-home" || presentation?.conversation === "exclusive";
			const pushRight = presentation?.kind === "panel" && presentation.behavior === "push" && presentation.placement === "right";
			const pushBottom = presentation?.kind === "panel" && presentation.behavior === "push" && presentation.placement === "bottom";
			for (const child of [...slot.children]) {
				if (!(child instanceof HTMLElement)) continue;
				if (!center.originals.has(child)) center.originals.set(child, {
					visibility: child.style.visibility,
					pointerEvents: child.style.pointerEvents,
					marginRight: child.style.marginRight,
					marginBottom: child.style.marginBottom
				});
				const original = center.originals.get(child);
				child.style.visibility = hidden ? "hidden" : original?.visibility ?? "";
				child.style.pointerEvents = hidden ? "none" : original?.pointerEvents ?? "";
				child.style.marginRight = pushRight ? "360px" : original?.marginRight ?? "";
				child.style.marginBottom = pushBottom ? "280px" : original?.marginBottom ?? "";
			}
		}
		function restoreConversation(center) {
			for (const [element, original] of center.originals) {
				element.style.visibility = original.visibility;
				element.style.pointerEvents = original.pointerEvents;
				element.style.marginRight = original.marginRight;
				element.style.marginBottom = original.marginBottom;
			}
		}
		function insertSidebar(service) {
			const anchor = workbenchAnchor();
			if (!(anchor instanceof HTMLElement) || !(anchor.parentElement instanceof HTMLElement)) return void 0;
			const parent = anchor.parentElement;
			const host = document.createElement("div");
			host.setAttribute("data-dsh-workbench-sidebar", "");
			parent.insertBefore(host, anchor);
			const root = (0, react_dom_client.createRoot)(host);
			root.render((0, react.createElement)(WorkbenchSidebar, { service }));
			return {
				host,
				root,
				parent,
				anchor
			};
		}
		function insertCenter(service) {
			const slot = document.querySelector("[data-slot=\"conversation\"]");
			const parent = slot?.parentElement instanceof HTMLElement ? slot.parentElement : void 0;
			if (parent === void 0) return void 0;
			const previousPosition = parent.style.position;
			parent.style.position = "relative";
			const host = document.createElement("div");
			host.setAttribute("data-dsh-workbench-center", "");
			parent.appendChild(host);
			const center = {
				host,
				root: (0, react_dom_client.createRoot)(host),
				parent,
				previousPosition,
				originals: /* @__PURE__ */ new Map()
			};
			center.root.render((0, react.createElement)(WorkbenchSurface, { service }));
			syncConversationPresentation(center, service);
			return center;
		}
		function disposeSidebar(surface) {
			surface.root.unmount();
			surface.host.remove();
		}
		function disposeCenter(surface) {
			restoreConversation(surface);
			surface.root.unmount();
			surface.host.remove();
			surface.parent.style.position = surface.previousPosition;
		}
		function createMount(service) {
			const sidebar = insertSidebar(service);
			const center = insertCenter(service);
			if (sidebar === void 0 || center === void 0) {
				if (sidebar !== void 0) disposeSidebar(sidebar);
				if (center !== void 0) disposeCenter(center);
				return;
			}
			const record = {
				sidebar,
				center
			};
			const clickHandler = (event) => {
				if (service.getSnapshot().route.kind === "conversation") return;
				const target = asElement(event.target);
				if (target === null || target.closest("[data-dsh-workbench-sidebar]") !== null) return;
				const sessionRow = target.closest("[data-slot=\"sidebar.workspaces\"] [role=\"treeitem\"]");
				const startsSession = target.closest("[data-slot=\"sidebar\"] button[aria-label=\"新建会话\"]") !== null;
				if (sessionRow !== null && !sessionRow.hasAttribute("aria-expanded")) service.close();
				else if (startsSession) service.close();
			};
			document.addEventListener("click", clickHandler, true);
			record.clickHandler = clickHandler;
			record.observer = new MutationObserver(() => {
				if (!document.body.contains(record.sidebar.host)) {
					disposeSidebar(record.sidebar);
					const replacement = insertSidebar(service);
					if (replacement !== void 0) record.sidebar = replacement;
				}
				if (!document.body.contains(record.center.host)) {
					disposeCenter(record.center);
					const replacement = insertCenter(service);
					if (replacement !== void 0) record.center = replacement;
				}
				syncConversationPresentation(record.center, service);
			});
			record.observer.observe(document.body, {
				childList: true,
				subtree: true
			});
			return record;
		}
		function mount(service) {
			const style = document.createElement("style");
			style.setAttribute("data-dsh-workbench-style", "");
			style.textContent = WORKBENCH_STYLE;
			document.head.appendChild(style);
			let record = createMount(service);
			let active = true;
			const styleObserver = new MutationObserver(() => {
				if (active && !style.isConnected) document.head.appendChild(style);
			});
			styleObserver.observe(document.head, { childList: true });
			const unsubscribe = service.subscribe(() => {
				if (record !== void 0) syncConversationPresentation(record.center, service);
			});
			const retry = window.setInterval(() => {
				if (record !== void 0 || !active) return;
				record = createMount(service);
			}, 250);
			return () => {
				if (!active) return;
				active = false;
				styleObserver.disconnect();
				window.clearInterval(retry);
				unsubscribe();
				if (record !== void 0) {
					record.observer.disconnect();
					document.removeEventListener("click", record.clickHandler, true);
					disposeSidebar(record.sidebar);
					disposeCenter(record.center);
				}
				style.remove();
			};
		}
		/** Mounts the base workbench service, launcher, and center surface. */
		function apply(ctx) {
			const service = new WorkbenchController();
			ctx.effect(() => ctx.reflect.provide("workbench", service), "dsh-workbench: service");
			ctx.effect(() => mount(service), "dsh-workbench: DOM surfaces");
		}
		//#endregion
		exports.apply = apply;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map