const STORAGE_KEY = 'dsh-workbench.state.v3';
const PREVIOUS_STORAGE_KEY = 'dsh-workbench.state.v2';
const LEGACY_STORAGE_KEY = 'dsh-workbench.instances.v1';
const STORAGE_VERSION = 3;
const ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:@/-]{0,95}$/;
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function stringValue(value) {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}
function cloneJson(value, seen = new Set()) {
    if (value === null || typeof value === 'string' || typeof value === 'boolean')
        return value;
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    if (typeof value !== 'object')
        throw new Error('Workbench configuration must contain JSON values only');
    if (!Array.isArray(value)) {
        const prototype = Object.getPrototypeOf(value);
        if (prototype !== Object.prototype && prototype !== null)
            throw new Error('Workbench configuration must use plain JSON objects');
    }
    if (seen.has(value))
        throw new Error('Workbench configuration cannot contain cyclic values');
    seen.add(value);
    try {
        if (Array.isArray(value))
            return value.map(item => cloneJson(item, seen));
        const output = {};
        for (const [key, item] of Object.entries(value))
            output[key] = cloneJson(item, seen);
        return output;
    }
    finally {
        seen.delete(value);
    }
}
function cloneConfig(value) {
    if (!isRecord(value))
        throw new Error('Workbench configuration must be a JSON object');
    return cloneJson(value);
}
function storedConfigValue(value) {
    try {
        return cloneConfig(value);
    }
    catch {
        return {};
    }
}
function createId(appId) {
    const random = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    return `${appId}-${random}`.slice(0, 96);
}
function storageFromGlobal() {
    if (typeof localStorage === 'undefined')
        return undefined;
    return localStorage;
}
function defaultStored() {
    return { version: STORAGE_VERSION, route: { kind: 'conversation' }, instances: [], dismissedDefaultAppIds: [] };
}
function parseInstances(value) {
    if (!Array.isArray(value))
        return [];
    const seen = new Set();
    return value.flatMap((entry) => {
        if (!isRecord(entry))
            return [];
        const instanceId = stringValue(entry.instanceId);
        const appId = stringValue(entry.appId);
        const title = stringValue(entry.title);
        const order = typeof entry.order === 'number' && Number.isFinite(entry.order) ? entry.order : 0;
        const updatedAt = typeof entry.updatedAt === 'number' && Number.isFinite(entry.updatedAt) ? entry.updatedAt : Date.now();
        if (instanceId === undefined || appId === undefined || title === undefined || !ID_PATTERN.test(instanceId) || seen.has(instanceId))
            return [];
        seen.add(instanceId);
        return [{ instanceId, appId, title, config: storedConfigValue(entry.config), order, updatedAt }];
    });
}
function parseIds(value) {
    if (!Array.isArray(value))
        return [];
    const seen = new Set();
    return value.flatMap((entry) => {
        if (typeof entry !== 'string' || !ID_PATTERN.test(entry) || seen.has(entry))
            return [];
        seen.add(entry);
        return [entry];
    });
}
function parseRoute(value, instances) {
    if (!isRecord(value))
        return { kind: 'conversation' };
    if (value.kind === 'conversation')
        return { kind: 'conversation' };
    if (value.kind === 'workbench-home')
        return { kind: 'workbench-home' };
    if (value.kind !== 'workbench-instance')
        return { kind: 'conversation' };
    const instanceId = stringValue(value.instanceId);
    const presentation = value.presentation;
    if (instanceId === undefined || !instances.some(item => item.instanceId === instanceId))
        return { kind: 'workbench-home' };
    if (presentation !== 'page' && presentation !== 'panel' && presentation !== 'capsule') {
        return { kind: 'workbench-instance', instanceId, presentation: 'page' };
    }
    return { kind: 'workbench-instance', instanceId, presentation };
}
function parseStored(raw) {
    if (raw === null)
        return undefined;
    try {
        const parsed = JSON.parse(raw);
        if (!isRecord(parsed) || !Array.isArray(parsed.instances))
            return undefined;
        const instances = parseInstances(parsed.instances);
        if (parsed.version === STORAGE_VERSION) {
            return {
                version: STORAGE_VERSION,
                route: parseRoute(parsed.route, instances),
                instances,
                dismissedDefaultAppIds: parseIds(parsed.dismissedDefaultAppIds),
            };
        }
        if (parsed.version === 2) {
            return {
                version: STORAGE_VERSION,
                route: parseRoute(parsed.route, instances),
                instances,
                dismissedDefaultAppIds: [],
            };
        }
        if (parsed.version === 1) {
            const currentInstanceId = stringValue(parsed.currentInstanceId);
            const route = currentInstanceId !== undefined && instances.some(item => item.instanceId === currentInstanceId)
                ? { kind: 'workbench-instance', instanceId: currentInstanceId, presentation: 'page' }
                : { kind: 'conversation' };
            return { version: STORAGE_VERSION, route, instances, dismissedDefaultAppIds: [] };
        }
        return undefined;
    }
    catch {
        return undefined;
    }
}
function loadStored(storage) {
    if (storage === undefined)
        return defaultStored();
    return parseStored(storage.getItem(STORAGE_KEY))
        ?? parseStored(storage.getItem(PREVIOUS_STORAGE_KEY))
        ?? parseStored(storage.getItem(LEGACY_STORAGE_KEY))
        ?? defaultStored();
}
function samePresentationKind(presentation, kind) {
    return presentation.kind === kind;
}
function validateApp(definition) {
    if (definition.protocolVersion !== 1)
        throw new Error(`Unsupported workbench protocol: ${String(definition.protocolVersion)}`);
    if (!ID_PATTERN.test(definition.appId))
        throw new Error(`Invalid workbench appId: ${definition.appId}`);
    if (definition.title.trim() === '')
        throw new Error('Workbench title cannot be empty');
    if (definition.presentations.length === 0)
        throw new Error(`Workbench app has no presentations: ${definition.appId}`);
    const kinds = new Set();
    for (const presentation of definition.presentations) {
        if (kinds.has(presentation.kind))
            throw new Error(`Duplicate workbench presentation: ${definition.appId}/${presentation.kind}`);
        kinds.add(presentation.kind);
        if (presentation.kind === 'page' && presentation.conversation !== 'exclusive')
            throw new Error('Page presentations must be exclusive');
        if (presentation.kind === 'panel' && presentation.conversation !== 'resident')
            throw new Error('Panel presentations must keep conversation resident');
        if (presentation.kind === 'capsule' && presentation.conversation !== 'resident')
            throw new Error('Capsule presentations must keep conversation resident');
    }
    if (!kinds.has(definition.defaultPresentation))
        throw new Error(`Unknown default presentation: ${definition.defaultPresentation}`);
    if (kinds.has('page') && definition.renderMain === undefined)
        throw new Error(`Page renderer is required: ${definition.appId}`);
    if (kinds.has('panel') && definition.renderPanel === undefined)
        throw new Error(`Panel renderer is required: ${definition.appId}`);
    if (kinds.has('capsule') && definition.renderCapsule === undefined)
        throw new Error(`Capsule renderer is required: ${definition.appId}`);
    if (definition.defaultInstance?.config !== undefined)
        cloneConfig(definition.defaultInstance.config);
}
function validateTemplate(definition) {
    if (!ID_PATTERN.test(definition.templateId))
        throw new Error(`Invalid workbench templateId: ${definition.templateId}`);
    if (definition.title.trim() === '')
        throw new Error('Workbench template title cannot be empty');
    if (definition.kind === 'instance') {
        if (!ID_PATTERN.test(definition.appId))
            throw new Error(`Instance template requires a valid appId: ${definition.templateId}`);
        if (definition.defaultConfig !== undefined)
            cloneConfig(definition.defaultConfig);
    }
    else if (!ID_PATTERN.test(definition.creatorId)) {
        throw new Error(`Agent template requires a valid creatorId: ${definition.templateId}`);
    }
}
/** Runtime registries and local durable state for workbench applications. */
export class WorkbenchController {
    storage;
    apps = new Map();
    templates = new Map();
    creators = new Map();
    instances;
    dismissedDefaultAppIds;
    route;
    snapshot;
    listeners = new Set();
    constructor(storage = storageFromGlobal()) {
        this.storage = storage;
        const stored = loadStored(storage);
        this.instances = stored.instances;
        this.dismissedDefaultAppIds = new Set(stored.dismissedDefaultAppIds);
        this.route = stored.route;
        this.snapshot = this.buildSnapshot();
    }
    getSnapshot() {
        return this.snapshot;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }
    registerApp(definition) {
        validateApp(definition);
        if (this.apps.has(definition.appId))
            throw new Error(`Workbench app already registered: ${definition.appId}`);
        this.apps.set(definition.appId, definition);
        let persisted = false;
        if (definition.defaultInstance !== undefined
            && !this.dismissedDefaultAppIds.has(definition.appId)
            && !this.instances.some(item => item.appId === definition.appId)) {
            const requestedId = definition.defaultInstance.instanceId ?? createId(definition.appId);
            if (!ID_PATTERN.test(requestedId) || this.instances.some(item => item.instanceId === requestedId)) {
                this.apps.delete(definition.appId);
                throw new Error(`Invalid default workbench instanceId: ${requestedId}`);
            }
            this.instances.push({
                instanceId: requestedId,
                appId: definition.appId,
                title: definition.defaultInstance.title?.trim() || definition.title,
                config: cloneConfig(definition.defaultInstance.config ?? {}),
                order: this.instances.length,
                updatedAt: Date.now(),
            });
            persisted = true;
        }
        this.rebuild(persisted);
        let active = true;
        return () => {
            if (!active)
                return;
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
        if (this.templates.has(definition.templateId))
            throw new Error(`Workbench template already registered: ${definition.templateId}`);
        const owned = definition.kind === 'instance'
            ? { ...definition, defaultConfig: definition.defaultConfig === undefined ? undefined : cloneConfig(definition.defaultConfig) }
            : { ...definition };
        this.templates.set(definition.templateId, owned);
        this.rebuild(false);
        let active = true;
        return () => {
            if (!active)
                return;
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
        if (!ID_PATTERN.test(definition.creatorId))
            throw new Error(`Invalid workbench creatorId: ${definition.creatorId}`);
        if (this.creators.has(definition.creatorId))
            throw new Error(`Workbench creator already registered: ${definition.creatorId}`);
        this.creators.set(definition.creatorId, definition);
        this.rebuild(false);
        let active = true;
        return () => {
            if (!active)
                return;
            active = false;
            if (this.creators.get(definition.creatorId) === definition) {
                this.creators.delete(definition.creatorId);
                this.rebuild(false);
            }
        };
    }
    createInstance(appId, title, config = {}) {
        const app = this.apps.get(appId);
        if (app === undefined)
            throw new Error(`Unknown workbench app: ${appId}`);
        const existing = this.instances.find(item => item.appId === appId);
        if (app.allowMultiple !== true && existing !== undefined)
            return this.publicInstance(existing);
        const instance = {
            instanceId: createId(appId),
            appId,
            title: title?.trim() || app.title,
            config: cloneConfig(config),
            order: this.instances.length,
            updatedAt: Date.now(),
        };
        this.instances.push(instance);
        this.rebuild(true);
        return this.publicInstance(instance);
    }
    startCreation(templateId) {
        const template = this.templates.get(templateId);
        if (template === undefined)
            throw new Error(`Unknown workbench template: ${templateId}`);
        if (template.kind === 'instance')
            return this.createInstance(template.appId, template.defaultTitle, template.defaultConfig ?? {});
        const creator = this.creators.get(template.creatorId);
        if (creator === undefined)
            throw new Error(`Workbench template creator is unavailable: ${template.creatorId}`);
        creator.start({ ...template });
        return undefined;
    }
    renameInstance(instanceId, title) {
        const value = title.trim();
        if (value === '')
            throw new Error('Workbench title cannot be empty');
        const instance = this.requireInstance(instanceId);
        instance.title = value;
        instance.updatedAt = Date.now();
        this.rebuild(true);
    }
    deleteInstance(instanceId) {
        const instance = this.requireInstance(instanceId);
        const index = this.instances.indexOf(instance);
        this.instances.splice(index, 1);
        if (!this.instances.some(item => item.appId === instance.appId)) {
            // A deleted last instance must not be recreated from the app default on reload.
            this.dismissedDefaultAppIds.add(instance.appId);
        }
        this.instances.forEach((item, nextOrder) => { item.order = nextOrder; });
        if (this.route.kind === 'workbench-instance' && this.route.instanceId === instanceId) {
            this.route = { kind: 'workbench-home' };
        }
        this.rebuild(true);
    }
    updateInstanceConfig(instanceId, patch) {
        const instance = this.requireInstance(instanceId);
        instance.config = { ...instance.config, ...cloneConfig(patch) };
        instance.updatedAt = Date.now();
        this.rebuild(true);
    }
    reorderInstances(instanceIds) {
        const byId = new Map(this.instances.map(item => [item.instanceId, item]));
        const ordered = instanceIds.flatMap(id => {
            const item = byId.get(id);
            if (item === undefined)
                return [];
            byId.delete(id);
            return [item];
        });
        ordered.push(...byId.values());
        ordered.forEach((item, index) => { item.order = index; });
        this.instances.splice(0, this.instances.length, ...ordered);
        this.rebuild(true);
    }
    open(instanceId, presentation) {
        const instance = this.requireInstance(instanceId);
        const app = this.apps.get(instance.appId);
        const nextPresentation = presentation ?? app?.defaultPresentation ?? 'page';
        if (app !== undefined && !app.presentations.some(item => samePresentationKind(item, nextPresentation))) {
            throw new Error(`Unsupported workbench presentation: ${instance.appId}/${nextPresentation}`);
        }
        instance.updatedAt = Date.now();
        this.route = { kind: 'workbench-instance', instanceId, presentation: nextPresentation };
        this.rebuild(true);
    }
    openHome() {
        if (this.route.kind === 'workbench-home')
            return;
        this.route = { kind: 'workbench-home' };
        this.rebuild(true);
    }
    openConversation() {
        if (this.route.kind === 'conversation')
            return;
        this.route = { kind: 'conversation' };
        this.rebuild(true);
    }
    close() {
        this.openConversation();
    }
    requireInstance(instanceId) {
        const instance = this.instances.find(item => item.instanceId === instanceId);
        if (instance === undefined)
            throw new Error(`Unknown workbench instance: ${instanceId}`);
        return instance;
    }
    publicInstance(instance) {
        return { ...instance, config: cloneConfig(instance.config), available: this.apps.has(instance.appId) };
    }
    templateSummary(template) {
        if (template.kind === 'instance') {
            return {
                ...template,
                defaultConfig: template.defaultConfig === undefined ? undefined : cloneConfig(template.defaultConfig),
                available: this.apps.has(template.appId),
            };
        }
        return { ...template, available: this.creators.has(template.creatorId) };
    }
    buildSnapshot() {
        const apps = [...this.apps.values()].map(app => ({
            appId: app.appId,
            title: app.title,
            icon: app.icon,
            description: app.description,
            allowMultiple: app.allowMultiple === true,
            presentations: app.presentations.map(item => ({ ...item })),
            defaultPresentation: app.defaultPresentation,
        }));
        const instances = [...this.instances].sort((a, b) => a.order - b.order).map(instance => this.publicInstance(instance));
        return {
            apps,
            instances,
            templates: [...this.templates.values()].map(template => this.templateSummary(template)),
            route: { ...this.route },
            currentInstanceId: this.route.kind === 'workbench-instance' ? this.route.instanceId : null,
        };
    }
    rebuild(persist) {
        this.snapshot = this.buildSnapshot();
        if (persist)
            this.persist();
        for (const listener of [...this.listeners]) {
            try {
                listener();
            }
            catch (error) {
                console.error('[dsh-workbench] snapshot listener failed', error);
            }
        }
    }
    persist() {
        if (this.storage === undefined)
            return;
        const state = {
            version: STORAGE_VERSION,
            route: { ...this.route },
            instances: this.instances.map(instance => ({ ...instance, config: cloneConfig(instance.config) })),
            dismissedDefaultAppIds: [...this.dismissedDefaultAppIds],
        };
        try {
            this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
        catch {
            // A blocked or full browser store must not prevent the UI from working.
        }
    }
}
