import type { WorkbenchService } from './types.ts';
export interface WorkbenchSurfaceProps {
    service: WorkbenchService;
}
/** Compatibility surface; a future DSH center-page Slot can host this component unchanged. */
export declare function WorkbenchSurface({ service }: WorkbenchSurfaceProps): JSX.Element;
