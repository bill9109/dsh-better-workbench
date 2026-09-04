import type { WorkbenchPresentation, WorkbenchService, WorkbenchSnapshot } from './types.ts';
/** Resolve a durable route against the currently available runtime definition. */
export declare function resolveActivePresentation(snapshot: WorkbenchSnapshot, service: WorkbenchService): WorkbenchPresentation | undefined;
