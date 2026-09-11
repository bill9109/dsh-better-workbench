import type { WorkbenchConfig } from './types.ts';
export declare const WEBSITE_APP_ID = "workbench.website";
export declare const WEBSITE_TEMPLATE_ID = "workbench.website:from-url";
export declare function normalizeWebsiteUrl(value: string): string;
export declare function websiteName(url: string): string;
export declare function validateWebsiteConfig(config: WorkbenchConfig): void;
export declare function validateWebsiteCreation(config: WorkbenchConfig): void;
