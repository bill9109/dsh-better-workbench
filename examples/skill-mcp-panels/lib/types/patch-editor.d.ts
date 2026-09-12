export declare const PANEL_MCP_BLOCK_BEGIN = "# >>> dsh-skill-mcp-panel:mcp:begin";
export declare const PANEL_MCP_BLOCK_END = "# <<< dsh-skill-mcp-panel:mcp:end";
export declare const MCP_PLUGIN_NAME = "@deepseek-ai/dsh-mcp-client";
export declare const MANAGED_ROW_ID_PREFIX = "panel-mcp-";
/** Loader patch 行（宽松形状；受管块只包含 insert 列表）。 */
export interface PatchRow {
    id?: string;
    name?: string;
    disabled?: boolean;
    config?: Record<string, unknown>;
    [key: string]: unknown;
}
/** 读取 patch 文件；缺失/读失败统一带路径报错。 */
export declare function readPatchFile(path: string): Promise<string>;
/** 校验整份 patch 文本：可解析且顶层是数组。不解出/写回任何值。 */
export declare function validatePatchText(raw: string): Promise<void>;
/** 提取 begin/end 标记之间的受管行；无标记返回空数组。 */
export declare function extractManagedRows(raw: string): PatchRow[];
/** 解析整份 patch 并返回其中所有 MCP 客户端行（不区分是否受管）。 */
export declare function listMcpPatchRows(raw: string): PatchRow[];
/** 生成受管块文本（无行时为空字符串）。 */
export declare function generateManagedBlock(rows: PatchRow[]): string;
/**
 * 替换受管块；无标记且要写入行时追加到文件末尾。标记之外的所有字节原样保留。
 */
export declare function replaceManagedBlock(raw: string, rows: PatchRow[]): string;
/** 同目录临时文件 + rename 原子写；Windows 上 rename 覆盖失败时退化为 rm+rename。 */
export declare function writeFileAtomic(path: string, content: string): Promise<void>;
/**
 * 以 `<path>.panel.lock` 为锁执行 fn。锁文件记录 pid + 时间；超过 30 秒视为
 * 陈旧锁自动清理。获取超时 5 秒。
 */
export declare function withPatchLock<T>(path: string, fn: () => Promise<T> | T): Promise<T>;
/**
 * 读取 patch 文件、替换受管块、校验、加锁原子写回。
 * 返回写回后的完整文本。
 */
export declare function writeManagedRows(path: string, rows: PatchRow[]): Promise<string>;
