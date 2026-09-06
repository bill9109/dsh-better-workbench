import type { WorkbenchService } from './types.ts';
export interface WorkbenchSurfaceProps {
    service: WorkbenchService;
}
/** Keep host controls outside application failure and instance state boundaries. */
export declare function WorkbenchSurface({ service }: WorkbenchSurfaceProps): JSX.Element;
