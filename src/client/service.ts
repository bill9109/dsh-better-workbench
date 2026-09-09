import { IndexedDbRepository, type WorkbenchRepository, type RepositoryState, type StoredInstance, type StoredConfigBackup } from './storage.ts';
import type { WorkbenchAppDefinition, WorkbenchConfig, WorkbenchCreatorDefinition, WorkbenchCreationResult, WorkbenchInstance, WorkbenchPresentationKind, WorkbenchRoute, WorkbenchService, WorkbenchSnapshot, WorkbenchTemplateDefinition } from './types.ts';
const ID_PATTERN = new RegExp('^(?:@[a-zA-Z0-9][a-zA-Z0-9._-]*/)?[a-zA-Z0-9][a-zA-Z0-9._:@/-]{0,159}$');
const ROUTE_KEY = 'dsh-better-workbench.navigation.v1';
const PRESENTATIONS_KEY = 'dsh-better-workbench.presentations.v1';
const message = (error: unknown): string => error instanceof Error ? error.message : String(error);
const validId = (id: string): void => { if (typeof id !== 'string' || !ID_PATTERN.test(id))
    throw new Error('Invalid workbench identifier: ' + String(id)); };
export function cloneConfig(value: unknown): WorkbenchConfig {
    const seen = new Set<object>();
    const copy = (item: unknown): unknown => {
        if (item === null || typeof item === 'string' || typeof item === 'boolean')
            return item;
        if (typeof item === 'number' && Number.isFinite(item))
            return item;
        if (typeof item !== 'object')
            throw new Error('Configuration must contain JSON values only');
        if (seen.has(item))
            throw new Error('Configuration cannot contain cycles');
        if (!Array.isArray(item) && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null)
            throw new Error('Configuration must contain plain JSON objects');
        seen.add(item);
        try {
            if (Array.isArray(item))
                return Array.from(item, copy);
            return Object.fromEntries(Object.entries(item).map(([key, entry]) => [key, copy(entry)]));
        }
        finally {
            seen.delete(item);
        }
    };
    if (value === null || typeof value !== 'object' || Array.isArray(value))
        throw new Error('Configuration must be a JSON object');
    return copy(value) as WorkbenchConfig;
}
function freezeConfig(config: WorkbenchConfig): WorkbenchConfig {
    const freeze = (value: unknown): void => {
        if (value && typeof value === 'object') {
            for (const item of Object.values(value)) freeze(item);
            Object.freeze(value);
        }
    };
    const owned = cloneConfig(config);
    freeze(owned);
    return owned;
}
function ownApp(definition: WorkbenchAppDefinition): WorkbenchAppDefinition {
    return Object.freeze({
        ...definition,
        config: Object.freeze({ ...definition.config }),
        presentations: Object.freeze(definition.presentations.map(item => Object.freeze({ ...item }))),
        source: definition.source ? Object.freeze({ ...definition.source }) : undefined,
        defaultInstance: definition.defaultInstance ? Object.freeze({
            ...definition.defaultInstance,
            config: definition.defaultInstance.config ? freezeConfig(definition.defaultInstance.config) : undefined,
        }) : undefined,
    });
}
function ownTemplate(definition: WorkbenchTemplateDefinition): WorkbenchTemplateDefinition {
    return Object.freeze(definition.kind === 'instance' ? {
        ...definition,
        defaultConfig: definition.defaultConfig ? freezeConfig(definition.defaultConfig) : undefined,
    } : { ...definition });
}
function validateApp(app: WorkbenchAppDefinition): void {
    validId(app.appId);
    if (app.protocolVersion !== 1 || !app.title?.trim())
        throw new Error('Invalid workbench application definition');
    if (!Number.isSafeInteger(app.config?.version) || app.config.version < 1 || typeof app.config.defaults !== 'function' || typeof app.config.validate !== 'function')
        throw new Error('Application requires a versioned configuration contract');
    const config = cloneConfig(app.config.defaults());
    app.config.validate(cloneConfig(config));
    const kinds = new Set<string>();
    for (const p of app.presentations) {
        if (kinds.has(p.kind))
            throw new Error('Duplicate presentation: ' + p.kind);
        kinds.add(p.kind);
        if (p.kind === 'page') {
            if (p.conversation !== 'exclusive' || !app.renderMain)
                throw new Error('Page requires renderMain and exclusive conversation');
        }
        else if (p.kind === 'panel') {
            if (!['right', 'bottom'].includes(p.placement) || !['push', 'overlay'].includes(p.behavior) || p.conversation !== 'resident' || !app.renderPanel)
                throw new Error('Invalid panel presentation');
        }
        else if (p.kind === 'capsule') {
            if (p.placement !== 'floating' || p.conversation !== 'resident' || !app.renderCapsule)
                throw new Error('Only floating capsules are supported');
        }
        else
            throw new Error('Unknown presentation');
    }
    if (!kinds.has(app.defaultPresentation))
        throw new Error('Default presentation must be supported');
    if (app.source) {
        if (typeof app.source.packageName !== 'string' || !app.source.packageName.trim()
            || typeof app.source.version !== 'string' || !app.source.version.trim())
            throw new Error('Invalid application source');
        if (app.source.repository !== undefined) {
            const url = new URL(app.source.repository);
            if (url.protocol !== 'https:' && url.protocol !== 'http:')
                throw new Error('Invalid application repository URL');
        }
    }
    if (app.defaultInstance?.instanceId)
        validId(app.defaultInstance.instanceId);
    if (app.defaultInstance?.config)
        app.config.validate(cloneConfig(app.defaultInstance.config));
}
type Status = {
    status: WorkbenchInstance['status'];
    error?: string;
    revision: number;
    generation: number;
};
export interface WorkbenchControllerOptions {
    repository?: WorkbenchRepository;
    navigationStorage?: Pick<Storage, 'getItem' | 'setItem'> | null;
    confirmDiscard?: () => boolean;
    teardownTimeoutMs?: number;
}
/** Durable transactions and activation-owned registries; no renderer lives in storage. */
export class WorkbenchController implements WorkbenchService {
    private readiness!: Promise<void>;
    private readonly ownsRepository: boolean;
    get ready(): Promise<void> { return this.readiness; }
    private readonly repository: WorkbenchRepository;
    private readonly navigationStorage?: Pick<Storage, 'getItem' | 'setItem'>;
    private readonly confirmDiscard: () => boolean;
    private readonly apps = new Map<string, {
        definition: WorkbenchAppDefinition;
        generation: number;
        abort: AbortController;
    }>();
    private readonly templates = new Map<string, WorkbenchTemplateDefinition>();
    private readonly creators = new Map<string, WorkbenchCreatorDefinition>();
    private state: RepositoryState = { instances: [], dismissedDefaultAppIds: [], backups: [] };
    private route: WorkbenchRoute = { kind: 'conversation' };
    private readonly presentations = new Map<string, WorkbenchPresentationKind>();
    private readonly statuses = new Map<string, Status>();
    private readonly pending = new Map<string, Promise<void>>();
    private readonly dirty = new Set<string>();
    private readonly listeners = new Set<() => void>();
    private loading = true;
    private error: string | null = null;
    private generation = 0;
    private active = true;
    private readonly tasks = new Map<object, Set<Promise<unknown>>>();
    private readonly teardownTimeoutMs: number;
    private disposal?: Promise<void>;
    private refreshTail: Promise<void> = Promise.resolve();
    private creation: WorkbenchSnapshot['creation'] = { status: 'idle' };
    private creationAbort?: AbortController;
    private snapshot!: WorkbenchSnapshot;
    private readonly unsubscribe: () => void;
    constructor(options: WorkbenchControllerOptions = {}) {
        this.teardownTimeoutMs = options.teardownTimeoutMs ?? 5000;
        this.ownsRepository = options.repository === undefined;
        this.repository = options.repository ?? new IndexedDbRepository();
        try {
            this.navigationStorage = options.navigationStorage === null ? undefined : options.navigationStorage ?? (typeof sessionStorage === 'undefined' ? undefined : sessionStorage);
        }
        catch {
            this.navigationStorage = undefined;
        }
        this.confirmDiscard = options.confirmDiscard ?? (() => typeof window !== 'undefined' && window.confirm('当前工作台有未保存内容，仍要离开吗？'));
        try {
            const raw = this.navigationStorage?.getItem(ROUTE_KEY);
            const saved = raw ? JSON.parse(raw) as WorkbenchRoute : undefined;
            if (saved?.kind === 'conversation' || saved?.kind === 'workbench-home' || (saved?.kind === 'workbench-instance' && typeof saved.instanceId === 'string' && ['page', 'panel', 'capsule'].includes(saved.presentation)))
                this.route = saved;
            const preferences = this.navigationStorage?.getItem(PRESENTATIONS_KEY);
            const parsed: unknown = preferences ? JSON.parse(preferences) : undefined;
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                for (const [id, kind] of Object.entries(parsed)) {
                    if (kind === 'page' || kind === 'panel' || kind === 'capsule')
                        this.presentations.set(id, kind);
                }
            }
        }
        catch {
            this.error = '无法恢复此标签页的导航状态';
        }
        this.publish();
        this.unsubscribe = this.repository.subscribe(() => { void this.refresh().catch(error => this.fail(error)); });
        this.readiness = this.refresh().finally(() => { this.loading = false; this.publish(); });
        void this.ready.catch(error => this.fail(error));
    }
    getSnapshot(): WorkbenchSnapshot { return this.snapshot; }
    subscribe(listener: () => void): () => void { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
    getApp(id: string): WorkbenchAppDefinition | undefined {
        const app = this.apps.get(id)?.definition;
        return app ? ownApp(app) : undefined;
    }
    getTemplate(id: string): WorkbenchTemplateDefinition | undefined {
        const template = this.templates.get(id);
        return template ? ownTemplate(template) : undefined;
    }
    private track<T>(owner: object, task: Promise<T>): Promise<T> {
        const tasks = this.tasks.get(owner) ?? new Set<Promise<unknown>>();
        this.tasks.set(owner, tasks);
        tasks.add(task);
        const remove = () => { tasks.delete(task); if (!tasks.size) this.tasks.delete(owner); };
        void task.then(remove, remove);
        return task;
    }
    private drain(tasks: Promise<unknown>[], label: string): Promise<void> {
        if (!tasks.length) return Promise.resolve();
        let timer: ReturnType<typeof setTimeout>;
        const result = Promise.race([
            Promise.allSettled(tasks).then(() => {}),
            new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(label + ': asynchronous teardown timed out')), this.teardownTimeoutMs); }),
        ]).finally(() => clearTimeout(timer));
        void result.catch(error => console.error('[dsh-better-workbench]', error));
        return result;
    }
    private assertActive(): void { if (!this.active)
        throw new Error('Workbench has been disposed'); }
    private assertGeneration(id: string, generation: number): WorkbenchAppDefinition {
        this.assertActive();
        const app = this.apps.get(id);
        if (app?.generation !== generation)
            throw new Error('Application activation changed; retry using the current application');
        return app.definition;
    }
    private require(id: string, state = this.state): StoredInstance {
        const instance = state.instances.find(item => item.instanceId === id);
        if (!instance)
            throw new Error('Unknown workbench instance: ' + id);
        return instance;
    }
    private fail(error: unknown): void { if (this.active) {
        this.error = message(error);
        this.publish();
    } }
    private refresh(): Promise<void> {
        const task = this.refreshTail.then(() => this.readAndPublish());
        this.refreshTail = task.catch(() => {});
        return task;
    }
    private async readAndPublish(): Promise<void> {
        if (!this.active) return;
        const state = await this.repository.read();
        if (!this.active) return;
        this.applyState(state);
    }
    private applyState(state: RepositoryState): void {
        this.state = state;
        if (!this.active) return;
        for (const instance of state.instances) {
            const entry = this.apps.get(instance.appId);
            const status = this.statuses.get(instance.instanceId);
            if (!entry || instance.configVersion !== entry.definition.config.version
                || status?.revision === instance.revision && status.generation === entry.generation)
                continue;
            try {
                entry.definition.config.validate(cloneConfig(instance.config));
                this.statuses.set(instance.instanceId, {
                    status: 'ready', revision: instance.revision, generation: entry.generation,
                });
            }
            catch (error) {
                this.statuses.set(instance.instanceId, {
                    status: 'migration-error', error: message(error), revision: instance.revision, generation: entry.generation,
                });
            }
        }
        if (this.route.kind === 'workbench-instance' && !state.instances.some(i => i.instanceId === (this.route as {
            instanceId: string;
        }).instanceId))
            this.route = { kind: 'workbench-home' };
        for (const id of this.dirty)
            if (!state.instances.some(i => i.instanceId === id))
                this.dirty.delete(id);
        this.publish();
        if (this.route.kind === 'workbench-instance')
            void this.prepareInstance(this.route.instanceId).catch(error => this.fail(error));
    }
    async retry(): Promise<void> {
        this.assertActive();
        this.error = null;
        this.loading = true;
        for (const [id, status] of this.statuses) {
            if (status.status === 'migration-error')
                this.statuses.delete(id);
        }
        this.publish();
        this.readiness = (async () => {
            try {
                await this.refresh();
                for (const id of this.apps.keys())
                    await this.ensureDefault(id);
                if (this.route.kind === 'workbench-instance')
                    await this.prepareInstance(this.route.instanceId);
            }
            catch (error) {
                this.fail(error);
                throw error;
            }
            finally {
                this.loading = false;
                this.publish();
            }
        })();
        return this.readiness;
    }
    private mutate<T>(operation: (state: RepositoryState) => T): Promise<T> {
        // Reads and writes share a queue: a successful commit never depends on a second read.
        const task = this.refreshTail.then(async () => {
            this.assertActive();
            const committed = await this.repository.transact(state => {
                this.assertActive();
                const result = operation(state);
                return { result, state: structuredClone(state) };
            });
            this.error = null;
            this.applyState(committed.state);
            return committed.result;
        });
        this.refreshTail = task.then(() => {}, () => {});
        return task.catch(error => {
            this.fail(error);
            throw error;
        });
    }
    registerApp(definition: WorkbenchAppDefinition): () => Promise<void> {
        this.assertActive();
        validateApp(definition);
        if (this.apps.has(definition.appId))
            throw new Error('Application already registered: ' + definition.appId);
        const id = definition.appId;
        const owned = ownApp(definition);
        const entry = { definition: owned, generation: ++this.generation, abort: new AbortController() };
        this.apps.set(id, entry);
        this.publish();
        void this.ready.then(() => this.ensureDefault(id, entry.generation)).then(() => {
            if (this.route.kind === 'workbench-instance')
                return this.prepareInstance(this.route.instanceId);
        }).catch(error => { if (this.apps.get(id) === entry)
            this.fail(error); });
        let unloading: Promise<void> | undefined;
        return () => {
            if (this.apps.get(id) !== entry)
                return unloading ?? Promise.resolve();
            this.apps.delete(id);
            entry.abort.abort();
            for (const instance of this.state.instances.filter(i => i.appId === id)) {
                this.statuses.delete(instance.instanceId);
                this.pending.delete(instance.instanceId);
                this.dirty.delete(instance.instanceId);
            }
            this.publish();
            return unloading = this.drain([...(this.tasks.get(entry) ?? [])], 'Application ' + id);
        };
    }
    private async ensureDefault(appId: string, expectedGeneration?: number): Promise<void> {
        const entry = this.apps.get(appId);
        if (!entry || (expectedGeneration !== undefined && entry.generation !== expectedGeneration))
            return;
        const app = entry.definition;
        if (!app.defaultInstance)
            return;
        await this.mutate(state => {
            this.assertGeneration(appId, entry.generation);
            if (state.dismissedDefaultAppIds.includes(appId) || state.instances.some(i => i.appId === appId))
                return;
            const id = app.defaultInstance!.instanceId ?? crypto.randomUUID();
            if (state.instances.some(i => i.instanceId === id))
                throw new Error('Default instance identifier collision');
            state.instances.push(this.newInstance(app, id, app.defaultInstance!.title, app.defaultInstance!.config, state.instances.length));
        });
    }
    private newInstance(app: WorkbenchAppDefinition, id: string, title: string | undefined, config: WorkbenchConfig | undefined, order: number): StoredInstance {
        const owned = cloneConfig(config ?? app.config.defaults());
        app.config.validate(cloneConfig(owned));
        const now = Date.now();
        return { instanceId: id, appId: app.appId, title: title?.trim() || app.title, config: owned, configVersion: app.config.version, revision: 1, order, createdAt: now, updatedAt: now, lastOpenedAt: 0 };
    }
    registerTemplate(definition: WorkbenchTemplateDefinition): () => void {
        this.assertActive();
        validId(definition.templateId);
        if (!definition.title?.trim() || this.templates.has(definition.templateId))
            throw new Error('Invalid or duplicate template');
        if (definition.kind === 'instance') {
            validId(definition.appId);
            if (definition.defaultConfig)
                cloneConfig(definition.defaultConfig);
        }
        else if (definition.kind === 'agent')
            validId(definition.creatorId);
        else
            throw new Error('Unknown template kind');
        const id = definition.templateId;
        const owned = ownTemplate(definition);
        this.templates.set(id, owned);
        this.publish();
        return () => { if (this.templates.get(id) === owned) {
            this.templates.delete(id);
            if (this.creation.templateId === id)
                this.cancelCreation();
            this.publish();
        } };
    }
    registerCreator(definition: WorkbenchCreatorDefinition): () => Promise<void> {
        this.assertActive();
        validId(definition.creatorId);
        if (typeof definition.start !== 'function' || this.creators.has(definition.creatorId))
            throw new Error('Invalid or duplicate creator');
        const id = definition.creatorId;
        const owned = Object.freeze({ ...definition });
        this.creators.set(id, owned);
        this.publish();
        let unloading: Promise<void> | undefined;
        return () => { if (this.creators.get(id) === owned) {
            this.creators.delete(id);
            const template = this.creation.templateId ? this.templates.get(this.creation.templateId) : undefined;
            if (template?.kind === 'agent' && template.creatorId === id)
                this.cancelCreation();
            this.publish();
            unloading = this.drain([...(this.tasks.get(owned) ?? [])], 'Creator ' + id);
        } return unloading ?? Promise.resolve(); };
    }
    async createInstance(appId: string, title?: string, config?: WorkbenchConfig): Promise<WorkbenchInstance> {
        return this.createCheckedInstance(appId, title, config);
    }
    private async createCheckedInstance(appId: string, title?: string, config?: WorkbenchConfig, check?: () => void): Promise<WorkbenchInstance> {
        await this.ready;
        this.assertActive();
        check?.();
        const entry = this.apps.get(appId);
        if (!entry)
            throw new Error('Application unavailable: ' + appId);
        const id = await this.mutate(state => {
            check?.();
            const app = this.assertGeneration(appId, entry.generation);
            const existing = state.instances.find(i => i.appId === appId);
            if (!app.allowMultiple && existing)
                return existing.instanceId;
            const instance = this.newInstance(app, crypto.randomUUID(), title, config, state.instances.length);
            state.instances.push(instance);
            return instance.instanceId;
        });
        await this.prepareInstance(id);
        return this.publicInstance(this.require(id));
    }
    async startCreation(templateId: string): Promise<WorkbenchCreationResult> {
        this.assertActive();
        if (this.creation.status === 'creating')
            throw new Error('A creation is already in progress');
        const template = this.templates.get(templateId);
        if (!template)
            throw new Error('Template unavailable');
        const abort = new AbortController();
        this.creationAbort = abort;
        this.creation = { status: 'creating', templateId };
        this.publish();
        try {
            let result: WorkbenchCreationResult;
            if (template.kind === 'instance') {
                const created = await this.createCheckedInstance(template.appId, template.defaultTitle, template.defaultConfig, () => {
                    if (abort.signal.aborted || this.creationAbort !== abort || this.templates.get(templateId) !== template) {
                        throw new Error('Creation cancelled');
                    }
                });
                result = { instanceId: created.instanceId };
            }
            else {
                const creator = this.creators.get(template.creatorId);
                if (!creator)
                    throw new Error('Creator unavailable');
                result = await this.track(creator, creator.start({ ...template }, { signal: abort.signal, requestId: crypto.randomUUID() }));
                if (this.creators.get(template.creatorId) !== creator)
                    throw new Error('Creator activation changed');
            }
            this.assertActive();
            if (abort.signal.aborted || this.creationAbort !== abort)
                throw new Error('Creation cancelled');
            if (!result || (('instanceId' in result ? typeof result.instanceId !== 'string' || !result.instanceId : !('sessionId' in result) || typeof result.sessionId !== 'string' || !result.sessionId)))
                throw new Error('Creator returned an invalid result');
            await this.refresh();
            this.assertActive();
            if (abort.signal.aborted || this.creationAbort !== abort)
                throw new Error('Creation cancelled');
            if ('instanceId' in result)
                this.require(result.instanceId);
            this.creation = { status: 'complete', templateId, result };
            this.publish();
            return result;
        }
        catch (error) {
            if (this.creationAbort === abort) {
                this.creation = { status: abort.signal.aborted ? 'cancelled' : 'failed', templateId, error: message(error) };
                this.publish();
            }
            throw error;
        }
    }
    cancelCreation(): void { this.creationAbort?.abort(); this.creationAbort = undefined; if (this.creation.status === 'creating') {
        this.creation = { status: 'cancelled', templateId: this.creation.templateId };
        this.publish();
    } }
    async prepareInstance(id: string): Promise<void> {
        const instance = this.state.instances.find(i => i.instanceId === id);
        const entry = instance ? this.apps.get(instance.appId) : undefined;
        if (!instance || !entry)
            return;
        const status = this.statuses.get(id);
        if (status?.revision === instance.revision && status.generation === entry.generation && status.status !== 'preparing')
            return;
        const pending = this.pending.get(id);
        if (pending)
            return pending;
        const generation = entry.generation, revision = instance.revision;
        const work = async (): Promise<void> => {
            this.statuses.set(id, { status: 'preparing', revision, generation });
            this.publish();
            try {
                const app = this.assertGeneration(instance.appId, generation);
                if (instance.configVersion > app.config.version)
                    throw new Error('Configuration belongs to a newer application version');
                let config = cloneConfig(instance.config);
                if (instance.configVersion < app.config.version) {
                    if (!app.config.migrate)
                        throw new Error('Application does not provide a configuration migration');
                    config = cloneConfig(await this.track(entry, Promise.resolve().then(() => {
                        entry.abort.signal.throwIfAborted();
                        return app.config.migrate!(config, instance.configVersion, { signal: entry.abort.signal });
                    })));
                }
                this.assertGeneration(instance.appId, generation);
                app.config.validate(cloneConfig(config));
                if (instance.configVersion !== app.config.version) {
                    await this.mutate(state => {
                        this.assertGeneration(instance.appId, generation);
                        const current = this.require(id, state);
                        if (current.revision !== revision)
                            throw new Error('Configuration changed during migration; retry');
                        state.backups.push({ instanceId: id, config: cloneConfig(current.config), configVersion: current.configVersion, revision, createdAt: Date.now() });
                        current.config = config;
                        current.configVersion = app.config.version;
                        current.revision++;
                        current.updatedAt = Date.now();
                    });
                }
                this.assertGeneration(instance.appId, generation);
                const validatedRevision = revision + (instance.configVersion !== app.config.version ? 1 : 0);
                if (this.require(id).revision === validatedRevision) {
                    this.statuses.set(id, { status: 'ready', revision: validatedRevision, generation });
                }
            }
            catch (error) {
                if (this.apps.get(instance.appId)?.generation === generation)
                    this.statuses.set(id, { status: instance.configVersion > entry.definition.config.version ? 'incompatible' : 'migration-error', error: message(error), revision, generation });
            }
            finally {
                this.publish();
            }
        };
        // Install the task before publishing: subscribers may prepare the same instance.
        const task = Promise.resolve().then(work);
        this.pending.set(id, task);
        try {
            await task;
        }
        finally {
            if (this.pending.get(id) === task) {
                this.pending.delete(id);
                const current = this.state.instances.find(item => item.instanceId === id);
                if (this.active && current && this.apps.get(current.appId)?.generation === generation
                    && this.statuses.get(id)?.revision !== current.revision) {
                    await this.prepareInstance(id);
                }
            }
        }
    }
    async renameInstance(id: string, title: string): Promise<void> {
        if (!title.trim())
            throw new Error('Title cannot be empty');
        const revision = this.require(id).revision;
        await this.mutate(state => { const i = this.require(id, state); if (i.revision !== revision)
            throw new Error('Instance changed in another tab'); i.title = title.trim(); i.revision++; i.updatedAt = Date.now(); });
    }
    async deleteInstance(id: string): Promise<void> {
        const revision = this.require(id).revision;
        await this.mutate(state => { const i = this.require(id, state); if (i.revision !== revision)
            throw new Error('Instance changed in another tab'); state.instances = state.instances.filter(item => item.instanceId !== id); if (!state.instances.some(item => item.appId === i.appId) && !state.dismissedDefaultAppIds.includes(i.appId))
            state.dismissedDefaultAppIds.push(i.appId); state.instances.forEach((item, index) => { item.order = index; }); });
    }
    async updateInstanceConfig(id: string, patch: WorkbenchConfig, expectedRevision = this.require(id).revision, generation = this.apps.get(this.require(id).appId)?.generation): Promise<number> {
        const instance = this.require(id);
        if (generation === undefined)
            throw new Error('Application unavailable');
        const app = this.assertGeneration(instance.appId, generation);
        if (instance.configVersion !== app.config.version)
            throw new Error('Configuration must be migrated before editing');
        const owned = cloneConfig(patch);
        return this.mutate(state => { this.assertGeneration(instance.appId, generation); const i = this.require(id, state); if (i.revision !== expectedRevision)
            throw new Error('Configuration conflict: another editor saved changes. Reload before retrying.'); const config = { ...i.config, ...owned }; app.config.validate(cloneConfig(config)); i.config = config; i.revision++; i.updatedAt = Date.now(); return i.revision; });
    }
    async exportInstance(id: string): Promise<{
        instance: StoredInstance;
        backups: StoredConfigBackup[];
    }> {
        this.assertActive();
        const state = await this.repository.read();
        this.assertActive();
        const instance = this.require(id, state);
        return {
            instance: { ...instance, config: cloneConfig(instance.config) },
            backups: state.backups.filter(backup => backup.instanceId === id).map(backup => ({
                ...backup, config: cloneConfig(backup.config),
            })),
        };
    }
    async restoreBackup(id: string, backupRevision: number, expectedRevision: number): Promise<void> {
        this.assertActive();
        const instance = this.require(id);
        const entry = this.apps.get(instance.appId);
        if (!entry)
            throw new Error('Application unavailable');
        await this.mutate(state => {
            const app = this.assertGeneration(instance.appId, entry.generation);
            const current = this.require(id, state);
            if (current.revision !== expectedRevision)
                throw new Error('Configuration conflict: instance changed before restore');
            const backup = state.backups.find(item => item.instanceId === id && item.revision === backupRevision);
            if (!backup)
                throw new Error('Configuration backup not found');
            if (backup.configVersion !== app.config.version) {
                throw new Error('Backup requires a matching application configuration version; install that version before restoring');
            }
            const config = cloneConfig(backup.config);
            app.config.validate(cloneConfig(config));
            state.backups.push({
                instanceId: id, config: cloneConfig(current.config), configVersion: current.configVersion,
                revision: current.revision, createdAt: Date.now(),
            });
            current.config = config;
            current.configVersion = backup.configVersion;
            current.revision++;
            current.updatedAt = Date.now();
        });
        this.dirty.delete(id);
        this.publish();
    }
    async reorderInstances(ids: readonly string[]): Promise<void> {
        await this.mutate(state => { const map = new Map(state.instances.map(i => [i.instanceId, i])); const next: StoredInstance[] = []; for (const id of ids) {
            const i = map.get(id);
            if (i) {
                next.push(i);
                map.delete(id);
            }
        } next.push(...map.values()); next.forEach((i, index) => { i.order = index; }); state.instances = next; });
    }
    setDirty(id: string, dirty: boolean): void { if (dirty)
        this.dirty.add(id);
    else
        this.dirty.delete(id); this.publish(); }
    private navigate(route: WorkbenchRoute): boolean {
        if (this.route.kind === 'workbench-instance' && (route.kind !== 'workbench-instance' || route.instanceId !== this.route.instanceId || route.presentation !== this.route.presentation) && this.dirty.has(this.route.instanceId)) {
            if (!this.confirmDiscard())
                return false;
            this.dirty.delete(this.route.instanceId);
        }
        this.route = route;
        try {
            this.navigationStorage?.setItem(ROUTE_KEY, JSON.stringify(route));
        }
        catch {
            this.error = '无法保存此标签页的导航状态';
        }
        this.publish();
        return true;
    }
    open(id: string, presentation?: WorkbenchPresentationKind): void {
        this.assertActive();
        const i = this.require(id);
        const app = this.getApp(i.appId);
        const saved = this.presentations.get(id);
        const remembered = saved && (!app || app.presentations.some(item => item.kind === saved)) ? saved : undefined;
        const kind = presentation ?? remembered ?? app?.defaultPresentation ?? 'page';
        if (app && !app.presentations.some(p => p.kind === kind))
            throw new Error('Unsupported presentation');
        if (!this.navigate({ kind: 'workbench-instance', instanceId: id, presentation: kind }))
            return;
        this.presentations.set(id, kind);
        try {
            this.navigationStorage?.setItem(PRESENTATIONS_KEY, JSON.stringify(Object.fromEntries(this.presentations)));
        }
        catch {
            this.error = '无法保存此标签页的显示偏好';
            this.publish();
        }
        void this.prepareInstance(id).catch(error => this.fail(error));
        void this.mutate(state => { this.require(id, state).lastOpenedAt = Date.now(); }).catch(error => this.fail(error));
    }
    openHome(creating = false): void { this.navigate({ kind: 'workbench-home', creating }); }
    openConversation(): void { this.navigate({ kind: 'conversation' }); }
    close(): void { this.openConversation(); }
    private publicInstance(i: StoredInstance): WorkbenchInstance {
        const app = this.apps.get(i.appId), state = this.statuses.get(i.instanceId);
        const status = !app ? { status: 'unavailable' as const } : state?.generation === app.generation && state.revision === i.revision ? state : { status: 'preparing' as const };
        return { ...i, config: cloneConfig(i.config), available: !!app, status: status.status, error: 'error' in status ? status.error : undefined };
    }
    private publish(): void {
        if (!this.active)
            return;
        this.snapshot = { apps: [...this.apps.values()].map(({ definition: a, generation }) => ({ appId: a.appId, title: a.title, description: a.description, icon: a.icon, source: a.source ? { ...a.source } : undefined, allowMultiple: a.allowMultiple === true, presentations: a.presentations.map(p => ({ ...p })), defaultPresentation: a.defaultPresentation, generation })), instances: [...this.state.instances].sort((a, b) => a.order - b.order).map(i => this.publicInstance(i)), templates: [...this.templates.values()].map(t => ({ ...ownTemplate(t), available: t.kind === 'instance' ? this.apps.has(t.appId) : this.creators.has(t.creatorId) })), route: { ...this.route }, currentInstanceId: this.route.kind === 'workbench-instance' ? this.route.instanceId : null, loading: this.loading, error: this.error, dirtyInstanceIds: [...this.dirty], recovery: this.state.recovery ? structuredClone(this.state.recovery) : undefined, creation: { ...this.creation } };
        for (const listener of [...this.listeners]) {
            try {
                listener();
            }
            catch (error) {
                console.error('[dsh-better-workbench] subscriber failed', error);
            }
        }
    }
    dispose(): Promise<void> {
        if (this.disposal) return this.disposal;
        this.cancelCreation();
        this.active = false;
        this.unsubscribe();
        for (const entry of this.apps.values()) entry.abort.abort();
        if (this.ownsRepository) this.repository.dispose();
        const tasks = [...this.tasks.values()].flatMap(tasks => [...tasks]);
        tasks.push(this.refreshTail);
        this.listeners.clear(); this.apps.clear(); this.templates.clear(); this.creators.clear();
        return this.disposal = this.drain(tasks, 'Workbench');
    }
}
