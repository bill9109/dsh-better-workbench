/**
 * dsh-skill-mcp-panel —— MCP 服务器配置模型。
 *
 * v1 仅全局生效：模型不包含 scope。env/headers 的 null 是编辑语义：
 * string = 覆盖该 key，null = 删除该 key，不出现 = 保留旧值。
 */
import { z } from "zod";
import type { PatchRow } from "../patch-editor.js";
export declare const SERVER_NAME_RE: RegExp;
export declare const DEFAULT_TOOL_CALL_TIMEOUT_MS = 60000;
export declare const DEFAULT_RECONNECT: {
    readonly enabled: true;
    readonly initialDelayMs: 500;
    readonly maxDelayMs: 30000;
    readonly maxAttempts: 10;
};
export declare const stdioServerSchema: z.ZodObject<{
    serverName: z.ZodString;
    transport: z.ZodLiteral<"stdio">;
    command: z.ZodString;
    args: z.ZodDefault<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    cwd: z.ZodDefault<z.ZodString>;
    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
    reconnect: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const httpServerSchema: z.ZodObject<{
    serverName: z.ZodString;
    transport: z.ZodLiteral<"streamable-http">;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
    reconnect: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const mcpServerInputSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    serverName: z.ZodString;
    transport: z.ZodLiteral<"stdio">;
    command: z.ZodString;
    args: z.ZodDefault<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    cwd: z.ZodDefault<z.ZodString>;
    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
    reconnect: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    serverName: z.ZodString;
    transport: z.ZodLiteral<"streamable-http">;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodString>>>;
    toolCallTimeoutMs: z.ZodDefault<z.ZodNumber>;
    failOnStartupError: z.ZodDefault<z.ZodBoolean>;
    reconnect: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        initialDelayMs: z.ZodDefault<z.ZodNumber>;
        maxDelayMs: z.ZodDefault<z.ZodNumber>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>], "transport">;
export type McpServerInput = z.infer<typeof mcpServerInputSchema>;
export type McpTransport = McpServerInput["transport"];
export interface ReconnectConfig {
    enabled: boolean;
    initialDelayMs: number;
    maxDelayMs: number;
    maxAttempts: number;
}
export type SecretPatch = Record<string, string | null> | undefined;
/** 面板行 id ↔ serverName。 */
export declare function rowIdForServerName(serverName: string): string;
export declare function serverNameFromRowId(id: string | undefined): string | undefined;
/** null = 删除，string = 覆盖；缺省 key 保留旧值。 */
export declare function mergeSecretPatch(previous: Record<string, string> | undefined, patch: SecretPatch): Record<string, string>;
/** 面板输入 → 官方 @deepseek-ai/dsh-mcp-client 配置。 */
export declare function toOfficialConfig(input: McpServerInput): Record<string, unknown>;
/** 面板输入 → cordis.patch.yml 行。 */
export declare function toPatchRow(input: McpServerInput, enabled?: boolean): PatchRow;
/** 读取 patch 行中的 config（宽松，坏行返回 undefined）。 */
export declare function configFromPatchRow(row: PatchRow | undefined): Record<string, unknown> | undefined;
export interface McpServerView {
    serverName: string;
    transport: McpTransport | "unknown";
    enabled: boolean;
    entryId: string | undefined;
    command?: string;
    args?: string[];
    envKeys: string[];
    cwd?: string;
    url?: string;
    headerKeys: string[];
    toolCallTimeoutMs: number;
    failOnStartupError: boolean;
    reconnect: ReconnectConfig;
}
/** patch 行 → 脱敏 view。密钥值不返回。 */
export declare function patchRowToView(row: PatchRow): McpServerView | undefined;
/** 在受管 + 外部行之间检测重复 serverName。返回重复名单。 */
export declare function duplicateServerNames(managedRows: PatchRow[], externalRows: PatchRow[]): string[];
/** 从 patch 行读取完整输入（含 secret 值，仅供本机 test/编辑使用，不跨 RPC）。 */
export declare function inputFromPatchRow(row: PatchRow): McpServerInput;
/** 把编辑输入合并到旧 patch 行上（保留输入中未出现的 secret key）。 */
export declare function applyServerEdit(previous: PatchRow | undefined, input: McpServerInput, enabled?: boolean): PatchRow;
