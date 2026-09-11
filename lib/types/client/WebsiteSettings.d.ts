import type { WorkbenchInstance, WorkbenchConfig } from './types.ts';
export declare function WebsiteSettings({ open, instance, updateConfig, onClose }: {
    open: boolean;
    instance: WorkbenchInstance;
    updateConfig: (patch: WorkbenchConfig, revision: number) => Promise<unknown>;
    onClose: () => void;
}): JSX.Element;
