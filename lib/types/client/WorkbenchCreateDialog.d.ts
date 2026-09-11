import type { WorkbenchService, WorkbenchSnapshot } from './types.ts';
export declare function uniqueWorkbenchTitle(base: string, snapshot: WorkbenchSnapshot): string;
export declare function WorkbenchCreateDialog({ service, snapshot }: {
    service: WorkbenchService;
    snapshot: WorkbenchSnapshot;
}): JSX.Element;
