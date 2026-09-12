/**
 * Host half of the Skills / MCP Workbench example.
 *
 * Ported from Fishquito7/dsh-skill-mcp-panel (MIT); see ../README.md for the
 * attribution and the changes made for this example (the dsh-panel CLI and its
 * global shim are intentionally not part of the example).
 */
/**
 * dsh-skill-mcp-panel —— 宿主半区。
 *
 * 一个 Typert 远程服务（"skillsViewer"），对外暴露技能目录与热管理操作：
 * 启用/停用（*.disabled 改名）、删除、添加（导入目录束或单文件技能）、
 * 以及工作区之间的迁移。
 *
 * 实体模型（0.3.0）：技能文件直接存放在其所属位置的技能文件夹——
 * 全局用户根（~/.dsh/skills）或某工作区的项目根（<workspace>/.dsh/skills）。
 * 没有中心仓库、没有联接点、没有插件私有状态：会话看到什么，完全等于
 * 技能文件系统提供方在各根目录里发现的东西。监听器约 200ms 内热感知
 * 变化，因此以上所有操作都无需重启。
 */
export declare const name = "dsh-better-workbench-skill-mcp-panels";
export declare const inject: string[];
export declare function apply(ctx: any): void;
