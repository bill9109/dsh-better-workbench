import type { WorkbenchService } from './types.ts';
export interface WorkbenchDomOptions {
    document?: Document;
    style: string;
    renderSidebar(host: HTMLElement, ready: (ready: boolean) => void): () => void;
    renderCenter(host: HTMLElement, ready: (ready: boolean) => void): () => void;
    /** Optional sessions service, read through the verified sessions.list contract only. */
    getSessions?: () => unknown;
    onError?: (error: unknown) => void;
}
/** Narrow fallback for reselecting a leaf Session. No localized labels or CSS-module names. */
export declare function isSessionNavigationClick(event: MouseEvent): boolean;
/** Own the compatibility DOM without replacing DSH slots, methods, or React roots. */
export declare function mountWorkbenchDom(service: WorkbenchService, options: WorkbenchDomOptions): () => void;
