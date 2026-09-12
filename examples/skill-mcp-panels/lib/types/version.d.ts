/** 本包 / 仓库 / 安装 spec（CLI update 与 UI 共用同一事实源）。 */
export declare const PACKAGE_NAME = "dsh-better-workbench-skill-mcp-panels";
export declare const REPO_SLUG = "Fishquito7/dsh-skill-mcp-panel";
export declare const INSTALL_SPEC = "github:Fishquito7/dsh-skill-mcp-panel";
export declare const RELEASES_LATEST_URL = "https://api.github.com/repos/Fishquito7/dsh-skill-mcp-panel/releases/latest";
export interface UpdateCheckInfo {
    latest: string | null;
    updateAvailable: boolean;
    rateLimited: boolean;
    error?: string;
}
/** 当前安装的插件版本；读取失败回退 0.0.0。 */
export declare function currentVersion(): string;
/**
 * 从 GitHub 官方 API 拉取最新版本信息。
 *
 * 未认证 REST API 每个出口 IP 每小时 60 次额度；可设置 GITHUB_TOKEN 或
 * GH_TOKEN 提升额度并读取私有仓库。403/429 明确标记 rateLimited，由 UI/CLI
 * 提示“限流”，而不是误报“已是最新版本”。
 */
export declare function fetchUpdateCheck(): Promise<UpdateCheckInfo>;
/**
 * 兼容旧调用点：只返回最新版本字符串；失败/限流都返回 undefined。
 * 新代码请优先使用 fetchUpdateCheck()。
 */
export declare function fetchLatestVersion(): Promise<string | undefined>;
/** 简易 semver 比较：a > b 返回正数、a < b 返回负数、相等返回 0。 */
export declare function compareVersions(a: string, b: string): number;
