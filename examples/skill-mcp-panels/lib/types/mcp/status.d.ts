export type McpFiberPhase = "pending" | "loading" | "active" | "failed" | "unloading" | null;
export declare function fiberPhaseOf(state: number | undefined | null): McpFiberPhase;
export declare function getLoaderEntry(ctx: any, id: string): any | undefined;
export declare function loaderEntries(ctx: any): any[];
export declare function mcpToolCount(ctx: any, serverName: string): number;
/**
 * 写入 patch 后轮询 loader，直到 entry 满足 predicate 或超时。
 * 默认 3s；每 200ms 查一次。
 */
export declare function waitForLoaderState(ctx: any, id: string, predicate: (entry: any) => boolean, timeoutMs?: number): Promise<boolean>;
