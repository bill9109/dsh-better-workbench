import type { WorkbenchService } from './types.ts';
export interface WorkbenchSidebarProps {
    service: WorkbenchService;
}
/** Launcher inserted above DSH's workspace/session browser. */
export declare function WorkbenchSidebar({ service }: WorkbenchSidebarProps): JSX.Element;
