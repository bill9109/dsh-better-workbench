import type { WorkbenchAppDefinition, WorkbenchConfig, WorkbenchCreatorDefinition, WorkbenchInstance, WorkbenchPresentationKind, WorkbenchService, WorkbenchSnapshot, WorkbenchTemplateDefinition } from './types.ts';
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
/** Runtime registries and local durable state for workbench applications. */
export declare class WorkbenchController implements WorkbenchService {
    private readonly storage;
    private readonly apps;
    private readonly templates;
    private readonly creators;
    private readonly instances;
    private route;
    private snapshot;
    private readonly listeners;
    constructor(storage?: StorageLike | undefined);
    getSnapshot(): WorkbenchSnapshot;
    subscribe(listener: () => void): () => void;
    registerApp(definition: WorkbenchAppDefinition): () => void;
    getApp(appId: string): WorkbenchAppDefinition | undefined;
    registerTemplate(definition: WorkbenchTemplateDefinition): () => void;
    getTemplate(templateId: string): WorkbenchTemplateDefinition | undefined;
    registerCreator(definition: WorkbenchCreatorDefinition): () => void;
    createInstance(appId: string, title?: string, config?: WorkbenchConfig): WorkbenchInstance;
    startCreation(templateId: string): WorkbenchInstance | undefined;
    renameInstance(instanceId: string, title: string): void;
    updateInstanceConfig(instanceId: string, patch: WorkbenchConfig): void;
    reorderInstances(instanceIds: readonly string[]): void;
    open(instanceId: string, presentation?: WorkbenchPresentationKind): void;
    openHome(): void;
    openConversation(): void;
    close(): void;
    private requireInstance;
    private publicInstance;
    private templateSummary;
    private buildSnapshot;
    private rebuild;
    private persist;
}
export {};
