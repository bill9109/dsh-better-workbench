import type { WorkbenchPresentation, WorkbenchService, WorkbenchSnapshot } from './types.ts';
export interface WorkbenchPresentationLayout {
    presentation: WorkbenchPresentation | undefined;
    panelSize: number;
    rightInset: number;
    bottomInset: number;
}
/** Resolve geometry once for both the conversation inset and the app surface. */
export declare function resolvePresentationLayout(presentation: WorkbenchPresentation | undefined, width: number, height: number): WorkbenchPresentationLayout;
/** Resolve a durable route against the currently available runtime definition. */
export declare function resolveActivePresentation(snapshot: WorkbenchSnapshot, service: WorkbenchService): WorkbenchPresentation | undefined;
