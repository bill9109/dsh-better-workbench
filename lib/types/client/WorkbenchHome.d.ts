import type { WorkbenchService, WorkbenchSnapshot } from './types.ts';
export interface WorkbenchHomeProps {
    service: WorkbenchService;
    snapshot: WorkbenchSnapshot;
}
/** Existing instances stay in place while creation owns a separate transient dialog. */
export declare function WorkbenchHome({ service, snapshot }: WorkbenchHomeProps): JSX.Element;
