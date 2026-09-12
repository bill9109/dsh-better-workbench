/**
 * dsh-skill-mcp-panel —— MCP 宿主服务（mcpManager）。
 */
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { MCP_PLUGIN_NAME, type PatchRow } from "../patch-editor.js";
import { type McpServerInput } from "./model.js";
declare const MANAGED_ROW_IDS: Set<string>;
declare function isManagedRow(row: PatchRow): boolean;
export declare class McpManagerGateway extends TypertRemoteService {
    constructor(ctx: any);
    get C(): any;
    patchPath(): string;
    readRows(): Promise<{
        path: string;
        raw: string;
        managed: PatchRow[];
        external: PatchRow[];
    }>;
    decorate(row: PatchRow, managed: boolean, entry: any, enabled: boolean): any;
    list(): Promise<{
        servers: any[];
        externalServers: any[];
        patch: {
            path: string;
            ok: boolean;
            error: string | null;
        };
    }>;
    findRowByServerName(rows: PatchRow[], serverName: string): PatchRow | undefined;
    configInputFromRow(row: PatchRow): McpServerInput;
    save(rawPayload: unknown): Promise<{
        server: any;
        reconciled: boolean;
    }>;
    removeServer(rawPayload: unknown): Promise<{
        ok: boolean;
        reconciled: boolean;
    }>;
    setEnabled(rawPayload: unknown): Promise<{
        server: any;
        reconciled: boolean;
    }>;
    test(rawPayload: unknown): Promise<import("./probe.js").McpProbeResult>;
    reload(): Promise<{
        servers: any[];
        externalServers: any[];
        patch: {
            path: string;
            ok: boolean;
            error: string | null;
        };
    }>;
}
export { MANAGED_ROW_IDS, isManagedRow, MCP_PLUGIN_NAME };
