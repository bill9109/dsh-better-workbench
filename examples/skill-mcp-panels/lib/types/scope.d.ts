/** 某工作区项目根对应的技能文件夹。 */
export declare function workspaceSkillRoot(projectRoot: any): string;
/**
 * 作用域目标对应的目标技能文件夹：
 *   null    → 全局用户根（<dshHome>/skills）
 *   路径    → <projectRoot>/.dsh/skills
 */
export declare function scopeRootOf(target: any, dshHome: any): string;
/**
 * 把一组原始工作区路径归一化为互不相同的项目根路径。
 * 每个路径必须存在，并解析到最近的 `.git` 祖先（没有则退回路径本身），
 * 因为提供方只在那里找 `<projectRoot>/.dsh/skills`。Windows 上大小写
 * 不敏感去重。
 */
export declare function normalizeWorkspaces(paths: any): Promise<any[]>;
/** 归一化单个工作区路径（一个都解析不出来时抛错）。 */
export declare function normalizeWorkspace(raw: any): Promise<any>;
/**
 * 读取 DSH 自己的工作区注册表（<dshHome>/storages/workspace.json），
 * 返回「项目根路径 → 工作区名称（title）」的映射。
 *
 * DSH 的工作区名称与文件夹名是分开的：在工作区设置里改名只改 title，
 * 不会重命名文件夹，所以显示名称必须取 title 而不是文件夹名。
 * 注册表缺失/损坏时返回空 Map，调用方回退文件夹名。
 */
export declare function workspaceTitleMap(dshHome: any): Promise<Map<any, any>>;
/**
 * 把单个技能实体（目录束或单文件）从当前位置迁移到 `targetRoot`，
 * 按需复制或移动。
 *
 * 操作顺序：
 *   1. 校验（目标冲突、同位置空操作）——此时尚未写入任何东西
 *   2. 在目标处落地实体（先在 targetRoot 内暂存，再改名就位）——
 *      任何失败都会清掉暂存残留
 *   3. 移动模式下：删除源；若源无法删除，则回滚刚写好的目标副本，
 *      保证不会留下两份
 *
 * @param entry - 技能条目（{ name, file, dirBundle, enabled }）。
 * @param targetRoot - 目标技能文件夹的绝对路径。
 * @param mode - "copy"（保留源）或 "move"（删除源）。
 * @returns 实体的新位置（目录束为目录，单文件为文件）。
 */
export declare function migrateEntry(entry: any, targetRoot: any, mode: any): Promise<{
    target: string;
}>;
/**
 * 依次迁移多个实体。每个条目完全独立：一个失败绝不中止其余，每个条目
 * 要么完整落地、要么回滚到迁移前状态。
 *
 * @param items - 待迁移的技能条目。
 * @param targetRoot - 目标技能文件夹。
 * @param mode - "copy" | "move"。
 * @returns 按输入顺序的逐条结果 [{ name, ok, error? }]。
 */
export declare function batchMigrateEntries(items: any, targetRoot: any, mode: any): Promise<any[]>;
