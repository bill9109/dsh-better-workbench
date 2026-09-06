import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { WorkbenchService } from './types.ts';
export type * from './types.ts';
export { resolveActivePresentation, resolvePresentationLayout } from './presentation.ts';
export type { WorkbenchPresentationLayout } from './presentation.ts';
/** Client service supplied to all workbench application plugins. */
declare module '@deepseek-ai/cordis' {
    interface Context {
        workbench: WorkbenchService;
    }
}
/** Mount the service and reversible compatibility surfaces in this Cordis lifetime. */
export declare function apply(ctx: ClientContext): void;
