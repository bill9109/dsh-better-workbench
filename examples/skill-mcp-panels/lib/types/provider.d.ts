/**
 * 运行时嵌套技能提供方（高内聚：与管理界面共用 collectSkillEntries 扫描）。
 *
 * 官方 @deepseek-ai/dsh-skill-filesystem 只做扁平发现（`根/<名>/SKILL.md` 一层）。
 * 本提供方把深度 >= 2 的嵌套技能（如 `~/.agents/skills/lark-cli/lark-approval/SKILL.md`，
 * pi/Codex 布局）注册进 ctx.skills 注册表，让 agent 真正能调用：
 *
 * - list() 复用 collectSkillEntries（与管理 UI 同一份遍历），只收 rel 含 "/" 的条目；
 * - 第一层（`根/<名>/SKILL.md`）归官方扁平加载器所有，不重复注册；
 * - chokidar 递归 watcher 保持热更新（同官方加载器），变更 → control.invalidate()。
 */
/** 嵌套技能的 rank（custom 带；低于用户根 400/500，高于项目根 100/200）。 */
export declare const NESTED_SKILL_RANK = 300;
export declare class NestedSkillProvider {
    private readonly rank;
    readonly name = "nested";
    constructor(rank: number, signal: AbortSignal, invalidate: () => void);
    list(options?: any): Promise<any[]>;
    get(candidate: any, options?: any): Promise<{
        invocation: {
            modelInvocable: boolean;
            userInvocable: boolean;
        };
        provider: string;
        source: any;
        resourceBase: {
            kind: string;
            path: any;
        };
        path: any;
        content: string;
        whenToUse?: string | undefined;
        name: string;
        description: string;
    } | undefined>;
    /** 被递归 watcher 监视的根（用户级根；项目根随 list() 的 cwd 动态扫描）。 */
    private roots;
    private homes;
}
