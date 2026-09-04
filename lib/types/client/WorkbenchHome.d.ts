import type { WorkbenchService, WorkbenchSnapshot } from './types.ts';
export interface WorkbenchHomeProps {
    service: WorkbenchService;
    snapshot: WorkbenchSnapshot;
}
/** Built-in hub page that remains available without third-party applications. */
export declare function WorkbenchHome({ service, snapshot }: WorkbenchHomeProps): JSX.Element;
