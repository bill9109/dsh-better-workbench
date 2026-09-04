import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { WorkbenchService } from './types.ts';
export type { WorkbenchAppDefinition, WorkbenchAppSummary, WorkbenchClientContext, WorkbenchConfig, WorkbenchCreatorDefinition, WorkbenchInstance, WorkbenchPresentation, WorkbenchPresentationKind, WorkbenchRenderProps, WorkbenchRoute, WorkbenchService, WorkbenchSnapshot, WorkbenchTemplateDefinition, WorkbenchTemplateSummary, } from './types.ts';
/** Client service supplied to all workbench application plugins. */
declare module '@deepseek-ai/cordis' {
    interface Context {
        workbench: WorkbenchService;
    }
}
/** Mounts the base workbench service, launcher, and center surface. */
export declare function apply(ctx: ClientContext): void;
