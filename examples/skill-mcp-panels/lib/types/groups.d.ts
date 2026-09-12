/** 分组配置的版本号。 */
export declare const GROUPS_VERSION = 1;
/** 分组配置所在的隐藏目录。 */
export declare function groupsRoot(dshHome: any): string;
/** 分组配置文件的完整路径。 */
export declare function groupsFile(dshHome: any): string;
/**
 * 读取分组配置；文件缺失或损坏时返回空配置。
 * @returns { [groupId]: { name: string; scopes: { [scope]: string[] } } }
 */
export declare function loadGroups(dshHome: any): Promise<Record<string, any>>;
/** 原子写入分组配置（临时文件 + 改名）。 */
export declare function saveGroups(dshHome: any, groups: any): Promise<void>;
/**
 * 查询某技能（作用域 + 名称）所属的分组名列表。
 * @param groups - loadGroups 的结果。
 * @param scope - "global" 或工作区项目根路径。
 * @param name - 技能名。
 */
export declare function groupsForSkill(groups: any, scope: string, name: string): string[];
/**
 * 新建或更新一个分组：按（作用域）设置成员列表。
 * 分组名不可为空，且（忽略大小写）不可与其它分组重复。
 * @param dshHome - harness 主目录。
 * @param id - 已有分组 id（新建时为 undefined，自动生成）。
 * @param name - 分组名。
 * @param scope - "global" 或工作区项目根路径。
 * @param names - 该作用域下的成员技能名列表。
 * @returns 更新后的分组 id。
 */
export declare function upsertGroup(dshHome: any, id: any, name: string, scope: string, names: string[]): Promise<string>;
/**
 * 删除一个分组；不存在的 id 视为无操作。
 * @returns 是否真的删除了东西。
 */
export declare function deleteGroup(dshHome: any, id: string): Promise<boolean>;
