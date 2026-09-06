import type { Context as CordisContext } from '@deepseek-ai/cordis';
import type { ComponentType } from 'react';
/** JSON object used by a workbench instance configuration. */
export type WorkbenchConfig = Record<string, unknown>;
export interface WorkbenchConfigDefinition {
    version: number;
    defaults(): WorkbenchConfig;
    validate(config: WorkbenchConfig): void;
    migrate?(config: WorkbenchConfig, fromVersion: number, context: {
        signal: AbortSignal;
    }): WorkbenchConfig | Promise<WorkbenchConfig>;
}
/** Publisher metadata; not an authenticated installation identity. */
export interface WorkbenchSource {
    packageName: string;
    version: string;
    repository?: string;
}
export type WorkbenchCreationResult = {
    instanceId: string;
} | {
    sessionId: string;
};
/** Presentation semantics understood by the workbench host. */
export type WorkbenchPresentation = {
    kind: 'page';
    conversation: 'exclusive';
} | {
    kind: 'panel';
    placement: 'right' | 'bottom';
    behavior: 'overlay' | 'push';
    conversation: 'resident';
} | {
    kind: 'capsule';
    placement: 'floating';
    conversation: 'resident';
};
export type WorkbenchPresentationKind = WorkbenchPresentation['kind'];
/** A persisted workbench instance with runtime availability information. */
export interface WorkbenchInstance {
    instanceId: string;
    appId: string;
    title: string;
    config: WorkbenchConfig;
    order: number;
    available: boolean;
    updatedAt: number;
    createdAt: number;
    lastOpenedAt: number;
    revision: number;
    configVersion: number;
    status: 'ready' | 'unavailable' | 'preparing' | 'incompatible' | 'migration-error';
    error?: string;
}
/** Explicit center navigation owned by the workbench host. */
export type WorkbenchRoute = {
    kind: 'conversation';
} | {
    kind: 'workbench-home';
    creating?: boolean;
} | {
    kind: 'workbench-instance';
    instanceId: string;
    presentation: WorkbenchPresentationKind;
};
/** A JSON-only template contribution. Runtime callbacks stay in the creator registry. */
export type WorkbenchTemplateDefinition = {
    templateId: string;
    title: string;
    description?: string;
    icon?: string;
    kind: 'instance';
    appId: string;
    defaultTitle?: string;
    defaultConfig?: WorkbenchConfig;
} | {
    templateId: string;
    title: string;
    description?: string;
    icon?: string;
    kind: 'agent';
    creatorId: string;
    brief?: string;
};
/** Serializable template metadata exposed to the home page. */
export type WorkbenchTemplateSummary = WorkbenchTemplateDefinition & {
    available: boolean;
};
/** Runtime creator capability, normally supplied by a separate Host/Client plugin. */
export interface WorkbenchCreatorDefinition {
    creatorId: string;
    start(template: Extract<WorkbenchTemplateDefinition, {
        kind: 'agent';
    }>, context: {
        signal: AbortSignal;
        requestId: string;
    }): Promise<WorkbenchCreationResult>;
}
/** Props passed to an application main view or secondary sidebar. */
export interface WorkbenchRenderProps {
    instance: WorkbenchInstance;
    presentation: WorkbenchPresentation;
    /** Pass the revision on which a draft is based; returns the committed revision. */
    updateConfig: (patch: WorkbenchConfig, expectedRevision?: number) => Promise<number>;
    setDirty: (dirty: boolean) => void;
    reportError: (error: string | null) => void;
    setPresentation: (kind: WorkbenchPresentationKind) => void;
    close: () => void;
    openHome: () => void;
    openConversation: () => void;
}
/** Runtime application definition contributed by an application plugin. */
export interface WorkbenchAppDefinition {
    protocolVersion: 1;
    config: WorkbenchConfigDefinition;
    source?: WorkbenchSource;
    appId: string;
    title: string;
    icon?: string;
    description?: string;
    allowMultiple?: boolean;
    presentations: readonly WorkbenchPresentation[];
    defaultPresentation: WorkbenchPresentationKind;
    renderMain?: ComponentType<WorkbenchRenderProps>;
    renderSecondary?: ComponentType<WorkbenchRenderProps>;
    renderPanel?: ComponentType<WorkbenchRenderProps>;
    renderCapsule?: ComponentType<WorkbenchRenderProps>;
    defaultInstance?: {
        instanceId?: string;
        title?: string;
        config?: WorkbenchConfig;
    };
}
/** Serializable application metadata exposed to the launcher and home page. */
export interface WorkbenchAppSummary {
    generation: number;
    source?: WorkbenchSource;
    appId: string;
    title: string;
    icon?: string;
    description?: string;
    allowMultiple: boolean;
    presentations: readonly WorkbenchPresentation[];
    defaultPresentation: WorkbenchPresentationKind;
}
/** Observable state consumed by the workbench React surfaces. */
export interface WorkbenchSnapshot {
    apps: readonly WorkbenchAppSummary[];
    instances: readonly WorkbenchInstance[];
    templates: readonly WorkbenchTemplateSummary[];
    route: WorkbenchRoute;
    /** Derived from the tab-local route. */
    currentInstanceId: string | null;
    loading: boolean;
    error: string | null;
    dirtyInstanceIds: readonly string[];
    recovery?: {
        sources: Array<{
            key: string;
            raw: string;
        }>;
        errors: string[];
    };
    creation: {
        status: 'idle' | 'creating' | 'failed' | 'complete' | 'cancelled';
        templateId?: string;
        error?: string;
        result?: WorkbenchCreationResult;
    };
}
export interface WorkbenchInstanceExport {
    instance: Omit<WorkbenchInstance, 'available' | 'status' | 'error'>;
    backups: Array<{
        instanceId: string;
        config: WorkbenchConfig;
        configVersion: number;
        revision: number;
        createdAt: number;
    }>;
}
/** Client service published by the base workbench plugin. */
export interface WorkbenchService {
    readonly ready: Promise<void>;
    dispose(): void;
    retry(): Promise<void>;
    prepareInstance(instanceId: string): Promise<void>;
    setDirty(instanceId: string, dirty: boolean): void;
    cancelCreation(): void;
    exportInstance(instanceId: string): Promise<WorkbenchInstanceExport>;
    restoreBackup(instanceId: string, backupRevision: number, expectedRevision: number): Promise<void>;
    getSnapshot(): WorkbenchSnapshot;
    subscribe(listener: () => void): () => void;
    registerApp(definition: WorkbenchAppDefinition): () => Promise<void>;
    getApp(appId: string): WorkbenchAppDefinition | undefined;
    registerTemplate(definition: WorkbenchTemplateDefinition): () => void;
    getTemplate(templateId: string): WorkbenchTemplateDefinition | undefined;
    registerCreator(definition: WorkbenchCreatorDefinition): () => Promise<void>;
    createInstance(appId: string, title?: string, config?: WorkbenchConfig): Promise<WorkbenchInstance>;
    startCreation(templateId: string): Promise<WorkbenchCreationResult>;
    renameInstance(instanceId: string, title: string): Promise<void>;
    deleteInstance(instanceId: string): Promise<void>;
    updateInstanceConfig(instanceId: string, patch: WorkbenchConfig, expectedRevision?: number, generation?: number): Promise<number>;
    reorderInstances(instanceIds: readonly string[]): Promise<void>;
    open(instanceId: string, presentation?: WorkbenchPresentationKind): void;
    openHome(creating?: boolean): void;
    openConversation(): void;
    close(): void;
}
/** Cordis Client Context after the required workbench service is injected. */
export type WorkbenchClientContext = CordisContext & {
    workbench: WorkbenchService;
};
