import type { Context as CordisContext } from '@deepseek-ai/cordis';
import type { ComponentType } from 'react';
/** JSON object used by a workbench instance configuration. */
export type WorkbenchConfig = Record<string, unknown>;
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
    placement: 'conversation' | 'floating';
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
}
/** Explicit center navigation owned by the workbench host. */
export type WorkbenchRoute = {
    kind: 'conversation';
} | {
    kind: 'workbench-home';
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
    }>): void;
}
/** Props passed to an application main view or secondary sidebar. */
export interface WorkbenchRenderProps {
    instance: WorkbenchInstance;
    presentation: WorkbenchPresentation;
    updateConfig: (patch: WorkbenchConfig) => void;
    close: () => void;
    openHome: () => void;
    openConversation: () => void;
}
/** Runtime application definition contributed by an application plugin. */
export interface WorkbenchAppDefinition {
    protocolVersion: 1;
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
    /** Compatibility projection for older consumers. */
    currentInstanceId: string | null;
}
/** Client service published by the base workbench plugin. */
export interface WorkbenchService {
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
}
/** Cordis Client Context after the required workbench service is injected. */
export type WorkbenchClientContext = CordisContext & {
    workbench: WorkbenchService;
};
