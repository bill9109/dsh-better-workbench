/** 热停用技能文件的后缀标记。 */
export declare const DISABLED_SUFFIX = ".disabled";
/** 公开的技能命名规则（kebab-case，小写字母与数字）。 */
export declare const SKILL_NAME_RE: RegExp;
/**
 * 把 CRLF / CR 归一为 LF。Windows 上很常见 CRLF 的 SKILL.md：截取 frontmatter
 * 时尾部会残留孤立 \r，yaml 解析器会报「Unexpected scalar at node end」。
 */
export declare function normalizeNewlines(raw: any): string;
/** 判断文件系统路径是否存在。 */
export declare function pathExists(path: any): Promise<boolean>;
/** 项目锚点：向上找最近的含 .git 的祖先目录；找不到就退回 cwd 本身。 */
export declare function findProjectRoot(cwd: any): Promise<string>;
/**
 * 面向列表/扫描的宽松 frontmatter 读取（name + description + body）。
 * 文件看起来不像技能时返回 undefined。
 */
export declare function parseFrontmatter(raw: any): {
    name: string;
    description: string;
    whenToUse: string | undefined;
    body: string;
    modelInvocable: boolean;
    userInvocable: boolean;
} | undefined;
/**
 * 面向新技能的严格 frontmatter 校验，与 dsh-skill-filesystem 的接收规则
 * 完全一致（同一个 YAML 解析器、同一套字段策略），保证会被 DSH 拒绝的
 * 内容永远不会被写入：
 *   - name：必填，kebab-case 命名规则
 *   - description：必填，非空字符串
 *   - whenToUse：出现时必须是字符串
 *   - disable-model-invocation / user-invocable：布尔式取值
 *   - 旧版 invocation 字段会被拒绝
 *   - metadata：出现时必须是对象
 * @returns { ok: true, skill } 或 { ok: false, error }（带可读原因）。
 */
export declare function validateFrontmatter(raw: string): {
    ok: true;
    skill: {
        name: string;
        description: string;
        whenToUse?: string;
        body: string;
    };
} | {
    ok: false;
    error: string;
};
/**
 * 管理根目录：项目根（锚定到 cwd 的 git 根）+ 用户根。
 * 顺序即发现优先级（越靠前越先命中），与提供方的分级一致：
 * 项目 .dsh > 项目 .agents > 用户 .dsh > 用户 .agents。
 *
 * 解析后指向同一目录的根（例如在主目录下运行、项目锚点回退到 cwd 本身）
 * 会被去重，保留第一个（优先级更高的）标签。
 */
export declare function buildRoots(cwd: any, options?: any): Promise<any[]>;
export declare function collectSkillEntries(roots: any): Promise<any[]>;
/**
 * 某技能名的胜出条目：按根目录顺序取第一个（与网关注册表的优先级一致）。
 */
export declare function winnerEntry(entries: any, name: any): any;
/** 根来源的稳定数字分级（越小优先级越高）。 */
export declare function sourceRank(source: any): 1 | 2 | 3 | 4 | 9;
