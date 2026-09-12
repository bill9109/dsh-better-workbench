import { z } from "zod";
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { access, cp, mkdir, open, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { homedir } from "node:os";
import { unzipSync } from "fflate";
import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import { parse, parseDocument, stringify } from "yaml";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { scrubbedParentEnv } from "@deepseek-ai/dsh-subprocess";
import chokidar from "chokidar";
//#region src/skill-files.ts
/**
* dsh-skill-mcp-panel —— 技能文件约定的统一来源（宿主与 CLI 共用）。
*
* 技能在磁盘上如何存放，以本模块为准，被以下两处共用：
*   - src/index.ts  （宿主半区：目录合并、热启用/停用、删除、添加）
*   - src/cli.ts    （管理命令行）
*
* 约定（必须与 @deepseek-ai/dsh-skill-filesystem 的发现行为一致）：
*   - 目录束：  <root>/<name>/SKILL.md   （技能名取自 frontmatter）
*   - 单文件：  <root>/<name>.md          （技能名取自 frontmatter）
*   - 停用 = 改名为 "*.disabled"，此后提供方不再列出该技能。
*   - frontmatter：位于 "---" 行之间的 YAML 块，含 name + description。
*
* 本模块只依赖 node:fs / node:path / node:os 以及 `yaml` 包
* （与 dsh-skill-filesystem 解析 frontmatter 用的是同一个解析器）。
*/
/** 热停用技能文件的后缀标记。 */
const DISABLED_SUFFIX = ".disabled";
/** 公开的技能命名规则（kebab-case，小写字母与数字）。 */
const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/**
* 把 CRLF / CR 归一为 LF。Windows 上很常见 CRLF 的 SKILL.md：截取 frontmatter
* 时尾部会残留孤立 \r，yaml 解析器会报「Unexpected scalar at node end」。
*/
function normalizeNewlines(raw) {
	return String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
/** 判断文件系统路径是否存在。 */
async function pathExists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}
/** 项目锚点：向上找最近的含 .git 的祖先目录；找不到就退回 cwd 本身。 */
async function findProjectRoot(cwd) {
	let current = resolve(cwd);
	while (true) {
		if (await pathExists(join(current, ".git"))) return current;
		const parent = dirname(current);
		if (parent === current) return resolve(cwd);
		current = parent;
	}
}
/**
* 面向列表/扫描的宽松 frontmatter 读取（name + description + body）。
* 文件看起来不像技能时返回 undefined。
*/
function parseFrontmatter(raw) {
	const text = normalizeNewlines(raw).trimStart();
	if (!text.startsWith("---")) return void 0;
	const firstEnd = text.indexOf("\n");
	if (firstEnd === -1) return void 0;
	const closing = text.indexOf("\n---", firstEnd + 1);
	const fmEnd = closing === -1 ? text.length : closing;
	const fm = text.slice(3, fmEnd);
	let body = "";
	if (closing !== -1) {
		const at = text.indexOf("\n", closing + 3);
		if (at !== -1) body = text.slice(at + 1);
	}
	const pick = (key) => {
		const m = new RegExp("^" + key + ":\\s*(.+)$", "m").exec(fm);
		if (m === null) return void 0;
		return m[1].trim().replace(/^["']|["']$/g, "");
	};
	const name = pick("name");
	if (name === void 0 || !SKILL_NAME_RE.test(name)) return void 0;
	const boolPick = (key) => {
		const value = pick(key);
		if (value === void 0) return void 0;
		switch (value.toLowerCase()) {
			case "true":
			case "yes":
			case "on":
			case "1": return true;
			case "false":
			case "no":
			case "off":
			case "0": return false;
		}
	};
	return {
		name,
		description: pick("description") ?? "",
		whenToUse: pick("whenToUse"),
		body: body.trim(),
		modelInvocable: boolPick("disable-model-invocation") !== true,
		userInvocable: boolPick("user-invocable") !== false
	};
}
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
function validateFrontmatter(raw) {
	const text = normalizeNewlines(raw).trimStart();
	if (!text.startsWith("---")) return {
		ok: false,
		error: "缺少 YAML frontmatter（文件必须以 --- 开头）"
	};
	const firstEnd = text.indexOf("\n");
	if (firstEnd === -1) return {
		ok: false,
		error: "frontmatter 未闭合"
	};
	const closing = text.indexOf("\n---", firstEnd + 1);
	if (closing === -1) return {
		ok: false,
		error: "frontmatter 未闭合（缺少结尾的 ---）"
	};
	const fm = text.slice(firstEnd + 1, closing);
	let data;
	try {
		data = parse(fm);
	} catch (error) {
		return {
			ok: false,
			error: "frontmatter 不是合法的 YAML：" + (error instanceof Error ? error.message : String(error))
		};
	}
	if (data === null || typeof data !== "object" || Array.isArray(data)) return {
		ok: false,
		error: "frontmatter 必须是键值对（YAML 映射）"
	};
	for (const key of [
		"disableModelInvocation",
		"modelInvocable",
		"userInvocable"
	]) if (key in data) return {
		ok: false,
		error: "不支持旧字段 \"" + key + "\"，请改用 disable-model-invocation / user-invocable"
	};
	const name = data.name;
	if (typeof name !== "string" || name.length === 0) return {
		ok: false,
		error: "frontmatter 缺少 name（必须是非空字符串）"
	};
	if (!SKILL_NAME_RE.test(name)) return {
		ok: false,
		error: "技能名 \"" + name + "\" 不符合命名规则（仅小写字母、数字与连字符，如 my-skill）"
	};
	const description = data.description;
	if (typeof description !== "string" || description.trim().length === 0) return {
		ok: false,
		error: "frontmatter 缺少 description（必须是非空字符串）"
	};
	const whenToUse = data.whenToUse;
	if (whenToUse !== void 0 && typeof whenToUse !== "string") return {
		ok: false,
		error: "whenToUse 必须是字符串"
	};
	for (const key of ["disable-model-invocation", "user-invocable"]) {
		const value = data[key];
		if (value !== void 0) {
			const lower = String(value).toLowerCase();
			if (![
				"true",
				"false",
				"yes",
				"no",
				"on",
				"off",
				"1",
				"0"
			].includes(lower)) return {
				ok: false,
				error: key + " 必须是布尔值"
			};
		}
	}
	if (data.metadata !== void 0 && (typeof data.metadata !== "object" || data.metadata === null || Array.isArray(data.metadata))) return {
		ok: false,
		error: "metadata 必须是对象"
	};
	return {
		ok: true,
		skill: {
			name,
			description,
			whenToUse: typeof whenToUse === "string" ? whenToUse : void 0,
			body: ""
		}
	};
}
/**
* 管理根目录：项目根（锚定到 cwd 的 git 根）+ 用户根。
* 顺序即发现优先级（越靠前越先命中），与提供方的分级一致：
* 项目 .dsh > 项目 .agents > 用户 .dsh > 用户 .agents。
*
* 解析后指向同一目录的根（例如在主目录下运行、项目锚点回退到 cwd 本身）
* 会被去重，保留第一个（优先级更高的）标签。
*/
async function buildRoots(cwd, options = {}) {
	const roots = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (path, source, projectRoot) => {
		const normalized = resolve(path);
		const key = process.platform === "win32" ? normalized.toLowerCase() : normalized;
		if (seen.has(key)) return;
		seen.add(key);
		roots.push({
			path,
			source,
			projectRoot
		});
	};
	if (cwd !== void 0) {
		const project = await findProjectRoot(cwd);
		push(join(project, ".dsh", "skills"), "project-dsh", project);
		push(join(project, ".agents", "skills"), "project-agents", project);
	}
	if (options.dshHome !== void 0) push(join(options.dshHome, "skills"), "user-dsh", void 0);
	if (options.agentsHome !== void 0) push(join(options.agentsHome, "skills"), "user-agents", void 0);
	return roots;
}
/**
* 收集给定根目录下的全部技能条目（启用 + 停用、目录束 + 单文件）。
* 未知/不合规的条目退回按目录名/文件名取名，仍会列出（停用条目必须保持
* 可管理）。符号链接目录（指向工作区的联接点）会被跟随，与提供方的发现
* 行为一致。
*/
/** 递归扫描跳过的目录名（隐藏目录 + 依赖目录，与提供方发现行为一致）。 */
const SKIP_DIR_NAMES = /* @__PURE__ */ new Set([
	"node_modules",
	".git",
	".hg",
	".svn"
]);
/** 递归深度上限：防御符号链接环导致的无界遍历。 */
const MAX_RECURSE_DEPTH = 8;
async function collectSkillEntries(roots) {
	const entries = [];
	for (const root of roots) await scanDir(root, root.path, "", 0, entries);
	return entries;
}
/**
* 递归扫描一层技能目录（pi/Codex 布局兼容）：
* - 目录含 SKILL.md（或 *.disabled）＝技能包：收集后**不下钻**（包内
*   references/ scripts/ modules/ 属于包本身，不是嵌套技能）；
* - 其他目录＝分类/分组目录：继续递归；
* - 单文件（*.md）只在根层收集（与扁平提供方一致）；
* - 条目新增 rel 字段（相对根的目录路径，如 "lark-cli/lark-approval"），
*   供管理 UI 展示来源路径。
*/
async function scanDir(root, dir, rel, depth, entries) {
	if (depth >= MAX_RECURSE_DEPTH) return;
	let items;
	try {
		items = await readdir(dir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const item of items) {
		if (item.name.startsWith(".") || SKIP_DIR_NAMES.has(item.name)) continue;
		const full = join(dir, item.name);
		if (item.isDirectory() || item.isSymbolicLink() && (await stat(full).catch(() => void 0))?.isDirectory() === true) {
			const md = join(full, "SKILL.md");
			const disabled = md + DISABLED_SUFFIX;
			const mdExists = await pathExists(md);
			const disabledExists = await pathExists(disabled);
			if (mdExists || disabledExists) {
				const file = mdExists ? md : disabled;
				const parsed = parseFrontmatter(await readFile(file, "utf8").catch(() => ""));
				entries.push({
					name: parsed?.name ?? item.name,
					description: parsed?.description ?? "",
					whenToUse: parsed?.whenToUse,
					enabled: mdExists,
					kind: "bundle",
					file,
					dirBundle: true,
					source: root.source,
					projectRoot: root.projectRoot,
					rel: rel ? rel + "/" + item.name : item.name,
					modelInvocable: parsed?.modelInvocable ?? true,
					userInvocable: parsed?.userInvocable ?? true
				});
			} else await scanDir(root, full, rel ? rel + "/" + item.name : item.name, depth + 1, entries);
		} else if (item.isFile() && rel === "") {
			if (item.name.endsWith(".md.disabled")) {
				const parsed = parseFrontmatter(await readFile(full, "utf8").catch(() => ""));
				entries.push({
					name: parsed?.name ?? item.name.slice(0, -12),
					description: parsed?.description ?? "",
					whenToUse: parsed?.whenToUse,
					enabled: false,
					kind: "flat",
					file: full,
					dirBundle: false,
					source: root.source,
					projectRoot: root.projectRoot,
					rel: ""
				});
			} else if (item.name.endsWith(".md")) {
				const parsed = parseFrontmatter(await readFile(full, "utf8"));
				entries.push({
					name: parsed?.name ?? item.name.slice(0, -3),
					description: parsed?.description ?? "",
					whenToUse: parsed?.whenToUse,
					enabled: true,
					kind: "flat",
					file: full,
					dirBundle: false,
					source: root.source,
					projectRoot: root.projectRoot,
					rel: ""
				});
			}
		}
	}
}
/**
* 某技能名的胜出条目：按根目录顺序取第一个（与网关注册表的优先级一致）。
*/
function winnerEntry(entries, name) {
	const matches = entries.filter((entry) => entry.name === name);
	if (matches.length === 0) return void 0;
	matches.sort((a, b) => sourceRank(a.source) - sourceRank(b.source));
	return matches[0];
}
/** 根来源的稳定数字分级（越小优先级越高）。 */
function sourceRank(source) {
	switch (source) {
		case "project-dsh": return 1;
		case "project-agents": return 2;
		case "user-dsh": return 3;
		case "user-agents": return 4;
		default: return 9;
	}
}
//#endregion
//#region src/scope.ts
/**
* dsh-skill-mcp-panel —— 作用域布局 + 迁移引擎（实体模型）。
*
* 自 0.3.0 起插件不再有中心仓库和联接点：技能实体直接存放在其作用域的
* 技能文件夹里——
*
*   - 全局：    <dshHome>/skills/<name>/SKILL.md   （或 <file>.md）
*   - 工作区：  <workspaceProjectRoot>/.dsh/skills/<name>/SKILL.md
*
* 会话看到什么，完全等于提供方在各根目录里发现了什么——没有需要解释的
* 隐藏层。改变技能作用域就是一次真实的迁移：把实体复制或移动到目标作用域
* 文件夹，先校验，中途失败则回滚。
*
* 本模块零依赖（仅 node:fs / node:path / node:os）。
*/
/** 某工作区项目根对应的技能文件夹。 */
function workspaceSkillRoot(projectRoot) {
	return join(projectRoot, ".dsh", "skills");
}
/**
* 作用域目标对应的目标技能文件夹：
*   null    → 全局用户根（<dshHome>/skills）
*   路径    → <projectRoot>/.dsh/skills
*/
function scopeRootOf(target, dshHome) {
	return target === null || target === void 0 ? join(dshHome, "skills") : workspaceSkillRoot(target);
}
/**
* 把一组原始工作区路径归一化为互不相同的项目根路径。
* 每个路径必须存在，并解析到最近的 `.git` 祖先（没有则退回路径本身），
* 因为提供方只在那里找 `<projectRoot>/.dsh/skills`。Windows 上大小写
* 不敏感去重。
*/
async function normalizeWorkspaces(paths) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const raw of paths) {
		if (typeof raw !== "string" || raw.trim() === "") continue;
		const absolute = resolve(raw.trim());
		const info = await stat(absolute).catch(() => void 0);
		if (info === void 0 || !info.isDirectory()) throw new Error("工作区不存在或不是目录：\"" + raw + "\"");
		const project = await findProjectRoot(absolute);
		const key = process.platform === "win32" ? project.toLowerCase() : project;
		if (seen.has(key)) continue;
		seen.add(key);
		result.push(project);
	}
	return result;
}
/** 归一化单个工作区路径（一个都解析不出来时抛错）。 */
async function normalizeWorkspace(raw) {
	const list = await normalizeWorkspaces([raw]);
	if (list.length === 0) throw new Error("至少需要指定一个存在的工作区");
	return list[0];
}
/** Windows 共享冲突 / 权限错误码：稍等片刻可能自行恢复。 */
function isBusyError(error) {
	return error !== null && typeof error === "object" && [
		"EPERM",
		"EBUSY",
		"EACCES",
		"ENOTEMPTY"
	].includes(error.code);
}
/** 删除文件或目录；遇到瞬态共享冲突自动重试。 */
async function removeRetry(path) {
	for (let attempt = 0; attempt < 5; attempt++) try {
		await rm(path, {
			recursive: true,
			force: true
		});
		return true;
	} catch (error) {
		if (!isBusyError(error)) throw error;
		await new Promise((resolvePromise) => setTimeout(resolvePromise, 300 * (attempt + 1)));
	}
	return false;
}
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
async function migrateEntry(entry, targetRoot, mode) {
	const sourceDir = entry.dirBundle ? dirname(entry.file) : entry.file;
	const target = entry.dirBundle ? join(targetRoot, entry.name) : join(targetRoot, basename(entry.file));
	if (resolve(sourceDir) === resolve(target)) throw new Error("技能 \"" + entry.name + "\" 已在此作用域中");
	if (await pathExists(target)) throw new Error("目标位置已存在同名技能：\"" + target + "\"");
	if (!await pathExists(sourceDir)) throw new Error("技能 \"" + entry.name + "\" 的源文件不存在：" + sourceDir);
	await mkdir(targetRoot, { recursive: true });
	if (mode === "move") try {
		await rename(sourceDir, target);
		return { target };
	} catch (error) {
		if (![
			"EXDEV",
			"EBUSY",
			"EPERM",
			"EACCES"
		].includes(error.code)) throw new Error("移动技能文件失败：" + (error instanceof Error ? error.message : String(error)));
	}
	const staging = join(targetRoot, ".dsh-skill-staging-" + process.pid + "-" + Math.random().toString(36).slice(2, 8));
	try {
		if (entry.dirBundle) {
			await cp(sourceDir, staging, { recursive: true });
			await rename(staging, target);
		} else {
			await mkdir(staging, { recursive: true });
			const stagedFile = join(staging, basename(entry.file));
			await cp(entry.file, stagedFile);
			await rename(stagedFile, target);
			await rm(staging, {
				recursive: true,
				force: true
			}).catch(() => {});
		}
	} catch (error) {
		await rm(staging, {
			recursive: true,
			force: true
		}).catch(() => {});
		throw new Error("复制技能文件失败（已回滚）：" + (error instanceof Error ? error.message : String(error)));
	}
	if (mode === "move") try {
		if (!await removeRetry(sourceDir)) throw new Error("源文件删除超时");
	} catch (error) {
		await rm(target, {
			recursive: true,
			force: true
		}).catch(() => {});
		throw new Error("技能 \"" + entry.name + "\" 已复制到目标，但无法删除源文件（可能被占用），已回滚新副本：" + (error instanceof Error ? error.message : String(error)));
	}
	return { target };
}
/**
* 依次迁移多个实体。每个条目完全独立：一个失败绝不中止其余，每个条目
* 要么完整落地、要么回滚到迁移前状态。
*
* @param items - 待迁移的技能条目。
* @param targetRoot - 目标技能文件夹。
* @param mode - "copy" | "move"。
* @returns 按输入顺序的逐条结果 [{ name, ok, error? }]。
*/
async function batchMigrateEntries(items, targetRoot, mode) {
	const results = [];
	for (const item of items) try {
		await migrateEntry(item, targetRoot, mode);
		results.push({
			name: item.name,
			ok: true
		});
	} catch (error) {
		results.push({
			name: item.name,
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		});
	}
	return results;
}
/** 分组配置所在的隐藏目录。 */
function groupsRoot(dshHome) {
	return join(dshHome, "skills", ".system", "skill-viewer");
}
/** 分组配置文件的完整路径。 */
function groupsFile(dshHome) {
	return join(groupsRoot(dshHome), "groups.json");
}
/**
* 读取分组配置；文件缺失或损坏时返回空配置。
* @returns { [groupId]: { name: string; scopes: { [scope]: string[] } } }
*/
async function loadGroups(dshHome) {
	try {
		const parsed = JSON.parse(await readFile(groupsFile(dshHome), "utf8"));
		if (parsed !== null && typeof parsed === "object" && parsed.groups !== null && typeof parsed.groups === "object") {
			const cleaned = {};
			for (const [id, group] of Object.entries(parsed.groups)) {
				if (group === null || typeof group !== "object" || typeof group.name !== "string") continue;
				const scopes = {};
				if (group.scopes !== null && typeof group.scopes === "object") {
					for (const [scope, names] of Object.entries(group.scopes)) if (Array.isArray(names)) scopes[scope] = names.filter((name) => typeof name === "string");
				}
				cleaned[id] = {
					name: group.name,
					scopes
				};
			}
			return cleaned;
		}
	} catch {}
	return {};
}
/** 原子写入分组配置（临时文件 + 改名）。 */
async function saveGroups(dshHome, groups) {
	await mkdir(groupsRoot(dshHome), { recursive: true });
	const target = groupsFile(dshHome);
	const tmp = target + ".tmp-" + process.pid;
	await writeFile(tmp, JSON.stringify({
		version: 1,
		groups
	}, void 0, 2) + "\n", "utf8");
	await rename(tmp, target);
}
/**
* 查询某技能（作用域 + 名称）所属的分组名列表。
* @param groups - loadGroups 的结果。
* @param scope - "global" 或工作区项目根路径。
* @param name - 技能名。
*/
function groupsForSkill(groups, scope, name) {
	const result = [];
	for (const [id, group] of Object.entries(groups)) {
		const names = group.scopes?.[scope];
		if (Array.isArray(names) && names.includes(name)) result.push(group.name);
	}
	return result;
}
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
async function upsertGroup(dshHome, id, name, scope, names) {
	const trimmed = (name ?? "").trim();
	if (trimmed === "") throw new Error("分组名称不能为空");
	const groups = await loadGroups(dshHome);
	for (const [gid, group] of Object.entries(groups)) if (gid !== id && group.name.toLowerCase() === trimmed.toLowerCase()) throw new Error("分组名 \"" + trimmed + "\" 已存在");
	const targetId = id !== void 0 && id !== null && id !== "" ? id : "g-" + Math.random().toString(36).slice(2, 10);
	const existing = groups[targetId] ?? {
		name: trimmed,
		scopes: {}
	};
	existing.name = trimmed;
	existing.scopes = { ...existing.scopes ?? {} };
	if (names.length === 0) delete existing.scopes[scope];
	else existing.scopes[scope] = [...names];
	groups[targetId] = existing;
	await saveGroups(dshHome, groups);
	return targetId;
}
/**
* 删除一个分组；不存在的 id 视为无操作。
* @returns 是否真的删除了东西。
*/
async function deleteGroup(dshHome, id) {
	const groups = await loadGroups(dshHome);
	if (groups[id] === void 0) return false;
	delete groups[id];
	await saveGroups(dshHome, groups);
	return true;
}
//#endregion
//#region src/version.ts
/**
* dsh-skill-mcp-panel —— 版本检查工具（CLI 与宿主共用）。
*
* 当前版本取自本插件自己的 package.json；最新版本取自 GitHub 官方 REST API
* 的 releases/latest。版本比较使用简易 semver（数字段逐位比较，忽略 v 前缀）。
*/
/** 本包 / 仓库 / 安装 spec（CLI update 与 UI 共用同一事实源）。 */
const PACKAGE_NAME = "dsh-better-workbench-skill-mcp-panels";
const RELEASES_LATEST_URL = `https://api.github.com/repos/Fishquito7/dsh-skill-mcp-panel/releases/latest`;
/** 当前安装的插件版本；读取失败回退 0.0.0。 */
function currentVersion() {
	try {
		const pkg = JSON.parse(readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8"));
		return typeof pkg.version === "string" ? pkg.version : "0.0.0";
	} catch {
		return "0.0.0";
	}
}
/**
* 从 GitHub 官方 API 拉取最新版本信息。
*
* 未认证 REST API 每个出口 IP 每小时 60 次额度；可设置 GITHUB_TOKEN 或
* GH_TOKEN 提升额度并读取私有仓库。403/429 明确标记 rateLimited，由 UI/CLI
* 提示“限流”，而不是误报“已是最新版本”。
*/
async function fetchUpdateCheck() {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 15e3);
	try {
		const token = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim();
		const response = await fetch(RELEASES_LATEST_URL, {
			headers: {
				"User-Agent": PACKAGE_NAME,
				"Accept": "application/vnd.github+json",
				...token ? { Authorization: `Bearer ${token}` } : {}
			},
			redirect: "follow",
			signal: controller.signal
		});
		if (response.status === 403 || response.status === 429) {
			await response.body?.cancel().catch(() => {});
			return {
				latest: null,
				updateAvailable: false,
				rateLimited: true
			};
		}
		if (!response.ok) {
			await response.body?.cancel().catch(() => {});
			return {
				latest: null,
				updateAvailable: false,
				rateLimited: false,
				error: `GitHub API ${response.status}`
			};
		}
		const data = await response.json().catch(() => void 0);
		const latest = (typeof data?.tag_name === "string" ? data.tag_name : "").replace(/^v/, "");
		if (latest === "") return {
			latest: null,
			updateAvailable: false,
			rateLimited: false,
			error: "missing tag_name"
		};
		return {
			latest,
			updateAvailable: compareVersions(latest, currentVersion()) > 0,
			rateLimited: false
		};
	} catch (error) {
		return {
			latest: null,
			updateAvailable: false,
			rateLimited: false,
			error: error instanceof Error ? error.message : String(error)
		};
	} finally {
		clearTimeout(timer);
	}
}
/**
* 兼容旧调用点：只返回最新版本字符串；失败/限流都返回 undefined。
* 新代码请优先使用 fetchUpdateCheck()。
*/
async function fetchLatestVersion() {
	return (await fetchUpdateCheck()).latest ?? void 0;
}
/** 简易 semver 比较：a > b 返回正数、a < b 返回负数、相等返回 0。 */
function compareVersions(a, b) {
	const pa = String(a).replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
	const pb = String(b).replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
		if (diff !== 0) return diff;
	}
	return 0;
}
//#endregion
//#region src/patch-editor.ts
/**
* dsh-skill-mcp-panel —— profile cordis.patch.yml 受管块编辑器。
*
* 面板只读写 begin/end 标记之间的 MCP 行，标记之外的内容逐字节保留。
* 写入使用同目录临时文件 + rename，并通过锁文件避免 Web 宿主与 CLI 并发写。
*/
const PANEL_MCP_BLOCK_BEGIN = "# >>> dsh-skill-mcp-panel:mcp:begin";
const PANEL_MCP_BLOCK_END = "# <<< dsh-skill-mcp-panel:mcp:end";
const MCP_PLUGIN_NAME = "@deepseek-ai/dsh-mcp-client";
const MANAGED_ROW_ID_PREFIX = "panel-mcp-";
const delay$1 = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
/** 读取 patch 文件；缺失/读失败统一带路径报错。 */
async function readPatchFile(path) {
	try {
		return await readFile(path, "utf8");
	} catch (error) {
		throw new Error("无法读取 cordis.patch.yml（" + path + "）：" + (error instanceof Error ? error.message : String(error)));
	}
}
/** 校验整份 patch 文本：可解析且顶层是数组。不解出/写回任何值。 */
async function validatePatchText(raw) {
	const doc = parseDocument(raw, { logLevel: "silent" });
	if (doc.errors.length > 0) throw new Error("cordis.patch.yml 解析失败：" + String(doc.errors[0]?.message ?? doc.errors[0]));
	const parsed = doc.toJS();
	if (!Array.isArray(parsed)) throw new Error("cordis.patch.yml 顶层必须是 YAML 数组");
}
/** 把 YAML 解析出的顶层条目拍平成 patch 行。 */
function flattenPatchRows(entries) {
	const rows = [];
	if (!Array.isArray(entries)) return rows;
	const pushRow = (value) => {
		if (value === null || typeof value !== "object" || Array.isArray(value)) return;
		const row = value;
		if (typeof row.id === "string" || typeof row.name === "string") {
			const normalized = { ...row };
			if (typeof row.id !== "string") delete normalized.id;
			if (typeof row.name !== "string") delete normalized.name;
			if (typeof row.disabled !== "boolean") delete normalized.disabled;
			if (row.config === null || typeof row.config !== "object" || Array.isArray(row.config)) delete normalized.config;
			rows.push(normalized);
		}
	};
	for (const entry of entries) {
		if (entry === null || typeof entry !== "object" || Array.isArray(entry)) continue;
		const record = entry;
		if (Array.isArray(record.insert)) for (const row of record.insert) pushRow(row);
		else pushRow(record);
	}
	return rows;
}
/** 提取 begin/end 标记之间的受管行；无标记返回空数组。 */
function extractManagedRows(raw) {
	const begin = raw.indexOf(PANEL_MCP_BLOCK_BEGIN);
	const end = raw.indexOf(PANEL_MCP_BLOCK_END);
	if (begin < 0 && end < 0) return [];
	if (begin < 0 || end < 0 || end < begin) throw new Error("cordis.patch.yml 中 dsh-skill-mcp-panel 受管块标记不完整（begin/end 必须成对）");
	const blockStart = raw.indexOf("\n", begin);
	if (blockStart < 0) throw new Error("cordis.patch.yml 受管块格式损坏");
	const blockText = raw.slice(blockStart + 1, end);
	const doc = parseDocument(blockText, { logLevel: "silent" });
	if (doc.errors.length > 0) throw new Error("受管块解析失败：" + String(doc.errors[0]?.message ?? doc.errors[0]));
	const parsed = doc.toJS();
	if (!Array.isArray(parsed)) throw new Error("受管块内容必须是 YAML 数组");
	return flattenPatchRows(parsed);
}
/** 解析整份 patch 并返回其中所有 MCP 客户端行（不区分是否受管）。 */
function listMcpPatchRows(raw) {
	const doc = parseDocument(raw, { logLevel: "silent" });
	if (doc.errors.length > 0) return [];
	const parsed = doc.toJS();
	if (!Array.isArray(parsed)) return [];
	return flattenPatchRows(parsed).filter((row) => row.name === MCP_PLUGIN_NAME);
}
/** 生成受管块文本（无行时为空字符串）。 */
function generateManagedBlock(rows) {
	if (rows.length === 0) return "";
	const body = stringify([{ insert: rows }], {
		indent: 2,
		lineWidth: 0
	});
	return PANEL_MCP_BLOCK_BEGIN + "\n" + body + "# <<< dsh-skill-mcp-panel:mcp:end\n";
}
/**
* 替换受管块；无标记且要写入行时追加到文件末尾。标记之外的所有字节原样保留。
*/
function replaceManagedBlock(raw, rows) {
	const begin = raw.indexOf(PANEL_MCP_BLOCK_BEGIN);
	const end = raw.indexOf(PANEL_MCP_BLOCK_END);
	const block = generateManagedBlock(rows);
	if (begin >= 0 || end >= 0) {
		if (begin < 0 || end < 0 || end < begin) throw new Error("cordis.patch.yml 中 dsh-skill-mcp-panel 受管块标记不完整（begin/end 必须成对）");
		const lineStart = raw.lastIndexOf("\n", begin - 1) + 1;
		const afterEnd = raw.indexOf("\n", end);
		const lineEnd = afterEnd < 0 ? raw.length : afterEnd + 1;
		const next = raw.slice(0, lineStart) + block + raw.slice(lineEnd);
		if (block !== "") return next;
		if (next.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "" && !line.startsWith("#")).length === 0) return next.replace(/\s*$/, "") + "\n[]\n";
		return next;
	}
	if (block === "") return raw;
	const meaningful = raw.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "" && !line.startsWith("#"));
	if (meaningful.length === 1 && meaningful[0] === "[]") {
		const index = raw.lastIndexOf("[]");
		return raw.slice(0, index) + block + raw.slice(index + 2);
	}
	return raw + (raw.length === 0 ? "" : raw.endsWith("\n") ? "\n" : "\n\n") + block;
}
/** 同目录临时文件 + rename 原子写；Windows 上 rename 覆盖失败时退化为 rm+rename。 */
async function writeFileAtomic(path, content) {
	const temp = join(dirname(path), ".dsh-panel-tmp-" + process.pid + "-" + Math.random().toString(36).slice(2, 8));
	try {
		await writeFile(temp, content, "utf8");
		try {
			await rename(temp, path);
		} catch (error) {
			if (error === null || typeof error !== "object" || ![
				"EPERM",
				"EEXIST",
				"EACCES"
			].includes(error.code ?? "")) throw error;
			await rm(path, { force: true });
			await rename(temp, path);
		}
	} finally {
		await rm(temp, { force: true }).catch(() => {});
	}
}
/**
* 以 `<path>.panel.lock` 为锁执行 fn。锁文件记录 pid + 时间；超过 30 秒视为
* 陈旧锁自动清理。获取超时 5 秒。
*/
async function withPatchLock(path, fn) {
	const lockPath = path + ".panel.lock";
	const started = Date.now();
	let handle;
	while (handle === void 0) try {
		handle = await open(lockPath, "wx");
	} catch (error) {
		if (error === null || typeof error !== "object" || error.code !== "EEXIST") throw error;
		try {
			const info = await stat(lockPath);
			if (Date.now() - info.mtimeMs > 3e4) await rm(lockPath, { force: true }).catch(() => {});
		} catch {}
		if (Date.now() - started > 5e3) throw new Error("等待 cordis.patch.yml 写锁超时（可能有其他 dsh-panel 进程正在写入）");
		await delay$1(50);
	}
	try {
		await handle.writeFile(process.pid + "\n" + Date.now() + "\n", "utf8");
		return await fn();
	} finally {
		await handle.close().catch(() => {});
		await rm(lockPath, { force: true }).catch(() => {});
	}
}
/**
* 读取 patch 文件、替换受管块、校验、加锁原子写回。
* 返回写回后的完整文本。
*/
async function writeManagedRows(path, rows) {
	return withPatchLock(path, async () => {
		const next = replaceManagedBlock(await readPatchFile(path), rows);
		await validatePatchText(next);
		await writeFileAtomic(path, next);
		return next;
	});
}
//#endregion
//#region src/mcp/model.ts
/**
* dsh-skill-mcp-panel —— MCP 服务器配置模型。
*
* v1 仅全局生效：模型不包含 scope。env/headers 的 null 是编辑语义：
* string = 覆盖该 key，null = 删除该 key，不出现 = 保留旧值。
*/
const SERVER_NAME_RE = /^[A-Za-z0-9_-]{1,32}$/;
const DEFAULT_TOOL_CALL_TIMEOUT_MS = 6e4;
const DEFAULT_RECONNECT = {
	enabled: true,
	initialDelayMs: 500,
	maxDelayMs: 3e4,
	maxAttempts: 10
};
const serverNameSchema = z.string().regex(SERVER_NAME_RE, "serverName 只能包含 1-32 位字母、数字、下划线或连字符");
const secretMapSchema = z.record(z.string(), z.string().nullable()).optional();
const reconnectSchema = z.object({
	enabled: z.boolean().default(DEFAULT_RECONNECT.enabled),
	initialDelayMs: z.number().int().min(1).default(DEFAULT_RECONNECT.initialDelayMs),
	maxDelayMs: z.number().int().min(1).default(DEFAULT_RECONNECT.maxDelayMs),
	maxAttempts: z.number().int().min(1).default(DEFAULT_RECONNECT.maxAttempts)
}).default({ ...DEFAULT_RECONNECT });
const stdioServerSchema = z.object({
	serverName: serverNameSchema,
	transport: z.literal("stdio"),
	command: z.string().min(1),
	args: z.array(z.string()).default([]),
	env: secretMapSchema,
	cwd: z.string().default(""),
	toolCallTimeoutMs: z.number().int().min(1).default(DEFAULT_TOOL_CALL_TIMEOUT_MS),
	failOnStartupError: z.boolean().default(false),
	reconnect: reconnectSchema
});
const httpServerSchema = z.object({
	serverName: serverNameSchema,
	transport: z.literal("streamable-http"),
	url: z.string().url(),
	headers: secretMapSchema,
	toolCallTimeoutMs: z.number().int().min(1).default(DEFAULT_TOOL_CALL_TIMEOUT_MS),
	failOnStartupError: z.boolean().default(false),
	reconnect: reconnectSchema
});
const mcpServerInputSchema = z.discriminatedUnion("transport", [stdioServerSchema, httpServerSchema]);
/** 面板行 id ↔ serverName。 */
function rowIdForServerName(serverName) {
	return MANAGED_ROW_ID_PREFIX + serverName;
}
function serverNameFromRowId(id) {
	if (typeof id !== "string" || !id.startsWith("panel-mcp-")) return void 0;
	const name = id.slice(10);
	return SERVER_NAME_RE.test(name) ? name : void 0;
}
/** null = 删除，string = 覆盖；缺省 key 保留旧值。 */
function mergeSecretPatch(previous, patch) {
	const merged = { ...previous ?? {} };
	for (const [key, value] of Object.entries(patch ?? {})) if (value === null) delete merged[key];
	else merged[key] = value;
	return merged;
}
function normalizeReconnect(input) {
	return {
		enabled: input.reconnect.enabled,
		initialDelayMs: input.reconnect.initialDelayMs,
		maxDelayMs: input.reconnect.maxDelayMs,
		maxAttempts: input.reconnect.maxAttempts
	};
}
/** 面板输入 → 官方 @deepseek-ai/dsh-mcp-client 配置。 */
function toOfficialConfig(input) {
	const common = {
		serverName: input.serverName,
		toolCallTimeoutMs: input.toolCallTimeoutMs,
		failOnStartupError: input.failOnStartupError,
		reconnect: normalizeReconnect(input)
	};
	if (input.transport === "stdio") return {
		...common,
		transport: "stdio",
		command: input.command,
		args: input.args,
		env: mergeSecretPatch({}, input.env),
		cwd: input.cwd
	};
	return {
		...common,
		transport: "streamable-http",
		url: input.url,
		headers: mergeSecretPatch({}, input.headers)
	};
}
/** 面板输入 → cordis.patch.yml 行。 */
function toPatchRow(input, enabled = true) {
	return {
		id: rowIdForServerName(input.serverName),
		name: MCP_PLUGIN_NAME,
		...enabled ? {} : { disabled: true },
		config: toOfficialConfig(input)
	};
}
/** 读取 patch 行中的 config（宽松，坏行返回 undefined）。 */
function configFromPatchRow(row) {
	if (row === void 0 || row.name !== "@deepseek-ai/dsh-mcp-client") return void 0;
	if (row.config === null || typeof row.config !== "object" || Array.isArray(row.config)) return void 0;
	return row.config;
}
function asString(value, fallback = "") {
	return typeof value === "string" ? value : fallback;
}
function asStringArray(value) {
	return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function asNumber(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function secretKeys(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return [];
	return Object.keys(value).filter((key) => typeof value[key] === "string");
}
/** patch 行 → 脱敏 view。密钥值不返回。 */
function patchRowToView(row) {
	const config = configFromPatchRow(row);
	if (config === void 0) return void 0;
	const serverName = asString(config.serverName);
	if (!SERVER_NAME_RE.test(serverName)) return void 0;
	const transport = config.transport === "streamable-http" ? "streamable-http" : config.transport === "stdio" ? "stdio" : "unknown";
	const reconnectRaw = config.reconnect !== null && typeof config.reconnect === "object" && !Array.isArray(config.reconnect) ? config.reconnect : {};
	return {
		serverName,
		transport,
		enabled: row.disabled !== true,
		entryId: row.id,
		command: transport === "stdio" ? asString(config.command) : void 0,
		args: transport === "stdio" ? asStringArray(config.args) : void 0,
		envKeys: transport === "stdio" ? secretKeys(config.env) : [],
		cwd: transport === "stdio" ? asString(config.cwd) : void 0,
		url: transport === "streamable-http" ? asString(config.url) : void 0,
		headerKeys: transport === "streamable-http" ? secretKeys(config.headers) : [],
		toolCallTimeoutMs: asNumber(config.toolCallTimeoutMs, DEFAULT_TOOL_CALL_TIMEOUT_MS),
		failOnStartupError: asBoolean(config.failOnStartupError, false),
		reconnect: {
			enabled: asBoolean(reconnectRaw.enabled, DEFAULT_RECONNECT.enabled),
			initialDelayMs: asNumber(reconnectRaw.initialDelayMs, DEFAULT_RECONNECT.initialDelayMs),
			maxDelayMs: asNumber(reconnectRaw.maxDelayMs, DEFAULT_RECONNECT.maxDelayMs),
			maxAttempts: asNumber(reconnectRaw.maxAttempts, DEFAULT_RECONNECT.maxAttempts)
		}
	};
}
/** 从 patch 行读取完整输入（含 secret 值，仅供本机 test/编辑使用，不跨 RPC）。 */
function inputFromPatchRow(row) {
	const config = configFromPatchRow(row) ?? {};
	const common = {
		serverName: asString(config.serverName, serverNameFromRowId(row.id) ?? ""),
		toolCallTimeoutMs: asNumber(config.toolCallTimeoutMs, DEFAULT_TOOL_CALL_TIMEOUT_MS),
		failOnStartupError: asBoolean(config.failOnStartupError, false),
		reconnect: {
			enabled: asBoolean(config.reconnect?.enabled, DEFAULT_RECONNECT.enabled),
			initialDelayMs: asNumber(config.reconnect?.initialDelayMs, DEFAULT_RECONNECT.initialDelayMs),
			maxDelayMs: asNumber(config.reconnect?.maxDelayMs, DEFAULT_RECONNECT.maxDelayMs),
			maxAttempts: asNumber(config.reconnect?.maxAttempts, DEFAULT_RECONNECT.maxAttempts)
		}
	};
	if (config.transport === "streamable-http") return mcpServerInputSchema.parse({
		...common,
		transport: "streamable-http",
		url: asString(config.url),
		headers: config.headers
	});
	return mcpServerInputSchema.parse({
		...common,
		transport: "stdio",
		command: asString(config.command),
		args: asStringArray(config.args),
		env: config.env,
		cwd: asString(config.cwd)
	});
}
/** 把编辑输入合并到旧 patch 行上（保留输入中未出现的 secret key）。 */
function applyServerEdit(previous, input, enabled = true) {
	if (previous === void 0) return toPatchRow(input, enabled);
	const oldConfig = configFromPatchRow(previous) ?? {};
	const oldEnv = oldConfig.env !== null && typeof oldConfig.env === "object" && !Array.isArray(oldConfig.env) ? oldConfig.env : void 0;
	const oldHeaders = oldConfig.headers !== null && typeof oldConfig.headers === "object" && !Array.isArray(oldConfig.headers) ? oldConfig.headers : void 0;
	const next = { ...input };
	if (next.transport === "stdio") next.env = mergeSecretPatch(oldEnv, next.env);
	if (next.transport === "streamable-http") next.headers = mergeSecretPatch(oldHeaders, next.headers);
	return toPatchRow(mcpServerInputSchema.parse(next), enabled);
}
//#endregion
//#region src/mcp/wire.ts
/**
* dsh-skill-mcp-panel —— mcpManager Typert wire manifest。
*/
const fiberPhaseSchema = z.enum([
	"pending",
	"loading",
	"active",
	"failed",
	"unloading"
]).nullable();
const reconnectViewSchema = z.object({
	enabled: z.boolean(),
	initialDelayMs: z.number(),
	maxDelayMs: z.number(),
	maxAttempts: z.number()
});
const mcpServerViewSchema = z.object({
	serverName: z.string(),
	transport: z.enum([
		"stdio",
		"streamable-http",
		"unknown"
	]),
	enabled: z.boolean(),
	entryId: z.string().optional(),
	command: z.string().optional(),
	args: z.array(z.string()).optional(),
	envKeys: z.array(z.string()),
	cwd: z.string().optional(),
	url: z.string().optional(),
	headerKeys: z.array(z.string()),
	toolCallTimeoutMs: z.number(),
	failOnStartupError: z.boolean(),
	reconnect: reconnectViewSchema,
	managed: z.boolean().default(true),
	fiberPhase: fiberPhaseSchema,
	toolCount: z.number().int().nonnegative()
});
const mcpListResultSchema = z.object({
	servers: z.array(mcpServerViewSchema),
	externalServers: z.array(mcpServerViewSchema),
	patch: z.object({
		path: z.string(),
		ok: z.boolean(),
		error: z.string().nullable()
	})
});
const mcpSavePayloadSchema = z.object({
	input: mcpServerInputSchema,
	previousServerName: z.string().optional(),
	enabled: z.boolean().default(true)
});
const mcpSaveResultSchema = z.object({
	server: mcpServerViewSchema,
	reconciled: z.boolean()
});
const mcpRemovePayloadSchema = z.object({ serverName: z.string() });
const mcpRemoveResultSchema = z.object({ ok: z.boolean() });
const mcpSetEnabledPayloadSchema = z.object({
	serverName: z.string(),
	enabled: z.boolean()
});
const mcpTestPayloadSchema = z.union([mcpServerInputSchema, z.object({ serverName: z.string() })]);
const mcpToolSchema = z.object({
	name: z.string(),
	description: z.string().optional()
});
const mcpTestResultSchema = z.object({
	ok: z.boolean(),
	tools: z.array(mcpToolSchema),
	error: z.string().optional()
});
const MCP_MANIFEST = {
	package: "dsh-skill-mcp-panel",
	face: "host",
	schemas: [],
	invocations: [
		{
			id: "dsh-skill-mcp-panel#mcpManager/list",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "list",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#McpListResult",
				schema: mcpListResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/save",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "save",
			invocation: { kind: "direct" },
			parameters: [{
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#McpSavePayload",
					schema: mcpSavePayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#McpSaveResult",
				schema: mcpSaveResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/removeServer",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "removeServer",
			invocation: { kind: "direct" },
			parameters: [{
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#McpRemovePayload",
					schema: mcpRemovePayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#McpRemoveResult",
				schema: mcpRemoveResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/setEnabled",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "setEnabled",
			invocation: { kind: "direct" },
			parameters: [{
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#McpSetEnabledPayload",
					schema: mcpSetEnabledPayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#McpSaveResult",
				schema: mcpSaveResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/test",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "test",
			invocation: { kind: "direct" },
			parameters: [{
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#McpTestPayload",
					schema: mcpTestPayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#McpTestResult",
				schema: mcpTestResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/reload",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "reload",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#McpListResult",
				schema: mcpListResultSchema
			}
		}
	],
	model: {
		services: [],
		events: [],
		objects: []
	}
};
//#endregion
//#region src/mcp/status.ts
/**
* dsh-skill-mcp-panel —— MCP 行运行时状态读取（loader entry + 工具计数）。
*/
const FIBER_PHASE = {
	0: "pending",
	1: "loading",
	2: "active",
	3: "failed",
	4: null,
	5: "unloading"
};
function fiberPhaseOf(state) {
	if (typeof state !== "number") return null;
	const phase = FIBER_PHASE[state];
	return phase === void 0 ? null : phase;
}
function getLoaderEntry(ctx, id) {
	const loader = ctx.loader;
	if (loader === void 0 || typeof loader.entries !== "function") return void 0;
	for (const entry of loader.entries()) if (entry.id === id) return entry;
}
function mcpToolCount(ctx, serverName) {
	const tools = ctx.tools;
	if (tools === void 0 || typeof tools.schemas !== "function") return 0;
	const prefix = `mcp__${serverName}__`;
	const schemas = tools.schemas();
	return Array.isArray(schemas) ? schemas.filter((schema) => typeof schema?.name === "string" && schema.name.startsWith(prefix)).length : 0;
}
const delay = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
/**
* 写入 patch 后轮询 loader，直到 entry 满足 predicate 或超时。
* 默认 3s；每 200ms 查一次。
*/
async function waitForLoaderState(ctx, id, predicate, timeoutMs = 3e3) {
	const started = Date.now();
	while (Date.now() - started < timeoutMs) {
		const entry = getLoaderEntry(ctx, id);
		if (entry !== void 0 && predicate(entry)) return true;
		if (entry === void 0 && predicate(void 0)) return true;
		await delay(200);
	}
	return false;
}
//#endregion
//#region src/mcp/probe.ts
/**
* dsh-skill-mcp-panel —— MCP 临时连接探针。
*
* 不写 patch、不注册 DSH 工具；Web“测试连接”与 `dsh-panel mcp test` 共用。
*/
const PROBE_TIMEOUT_MS = 15e3;
function stringMap(value) {
	const out = {};
	for (const [key, item] of Object.entries(value ?? {})) if (typeof item === "string") out[key] = item;
	return out;
}
function createTransport(input) {
	if (input.transport === "stdio") return new StdioClientTransport({
		command: input.command,
		args: input.args,
		env: {
			...scrubbedParentEnv(),
			...stringMap(input.env)
		},
		cwd: input.cwd === "" ? void 0 : input.cwd
	});
	return new StreamableHTTPClientTransport(new URL(input.url), { requestInit: { headers: stringMap(input.headers) } });
}
async function probeMcpServer(raw, timeoutMs = PROBE_TIMEOUT_MS) {
	let input;
	try {
		input = mcpServerInputSchema.parse(raw);
	} catch (error) {
		return {
			ok: false,
			tools: [],
			error: "配置无效：" + (error instanceof Error ? error.message : String(error))
		};
	}
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	const client = new Client({
		name: "dsh-skill-mcp-panel",
		version: "2.0.0"
	});
	let transport;
	try {
		transport = createTransport(input);
		await raceWithAbort(client.connect(transport), controller.signal);
		const tools = [];
		let cursor;
		do {
			const page = await client.listTools(cursor === void 0 ? void 0 : { cursor }, { signal: controller.signal });
			for (const tool of page.tools) tools.push({
				name: typeof tool.name === "string" ? tool.name : String(tool.name),
				...typeof tool.description === "string" ? { description: tool.description } : {}
			});
			cursor = page.nextCursor;
		} while (cursor !== void 0 && cursor !== "");
		return {
			ok: true,
			tools
		};
	} catch (error) {
		return {
			ok: false,
			tools: [],
			error: controller.signal.aborted ? "连接测试超时（" + timeoutMs + "ms）" : error instanceof Error ? error.message : String(error)
		};
	} finally {
		clearTimeout(timer);
		await Promise.allSettled([client.close().catch(() => {}), transport?.close().catch(() => {})]);
	}
}
async function raceWithAbort(promise, signal) {
	if (signal.aborted) return Promise.reject(/* @__PURE__ */ new Error("aborted"));
	return new Promise((resolvePromise, rejectPromise) => {
		const onAbort = () => rejectPromise(/* @__PURE__ */ new Error("aborted"));
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolvePromise(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			rejectPromise(error);
		});
	});
}
//#endregion
//#region src/mcp/gateway.ts
/**
* dsh-skill-mcp-panel —— MCP 宿主服务（mcpManager）。
*/
function stripUndefined(value) {
	if (Array.isArray(value)) return value.map((item) => stripUndefined(item));
	if (value !== null && typeof value === "object") {
		const out = {};
		for (const [key, item] of Object.entries(value)) {
			if (item === void 0) continue;
			out[key] = stripUndefined(item);
		}
		return out;
	}
	return value;
}
function isManagedRow(row) {
	return typeof row.id === "string" && row.id.startsWith("panel-mcp-");
}
var McpManagerGateway = class extends TypertRemoteService {
	constructor(ctx) {
		super(ctx, "mcpManager");
	}
	get C() {
		return this.ctx;
	}
	patchPath() {
		const base = this.C.baseUrl;
		if (typeof base === "string" && base.length > 0) try {
			const url = new URL(base);
			if (url.protocol === "file:") return join(fileURLToPath(url), "cordis.patch.yml");
		} catch {}
		const packageDir = fileURLToPath(new URL("../../", import.meta.url));
		return join(resolve(packageDir, "../.."), "cordis.patch.yml");
	}
	async readRows() {
		const path = this.patchPath();
		const raw = await readPatchFile(path);
		const managed = extractManagedRows(raw);
		const allMcp = listMcpPatchRows(raw);
		const managedIds = new Set(managed.map((row) => row.id).filter((id) => typeof id === "string"));
		return {
			path,
			raw,
			managed,
			external: allMcp.filter((row) => typeof row.id === "string" && !managedIds.has(row.id))
		};
	}
	decorate(row, managed, entry, enabled) {
		const view = patchRowToView(row);
		if (view === void 0) return void 0;
		const fiberPhase = fiberPhaseOf(entry?.fiber?.state);
		return stripUndefined({
			...view,
			enabled,
			managed,
			fiberPhase,
			toolCount: enabled ? mcpToolCount(this.C, view.serverName) : 0
		});
	}
	async list() {
		let patch = {
			path: this.patchPath(),
			ok: false,
			error: null
		};
		try {
			const { path, managed, external } = await this.readRows();
			patch = {
				path,
				ok: true,
				error: null
			};
			const servers = [];
			for (const row of managed) {
				const entry = typeof row.id === "string" ? getLoaderEntry(this.C, row.id) : void 0;
				const view = this.decorate(row, true, entry, row.disabled !== true);
				if (view !== void 0) servers.push(view);
			}
			const externalServers = [];
			for (const row of external) {
				const entry = typeof row.id === "string" ? getLoaderEntry(this.C, row.id) : void 0;
				const view = this.decorate(row, false, entry, row.disabled !== true);
				if (view !== void 0) externalServers.push(view);
			}
			return {
				servers,
				externalServers,
				patch
			};
		} catch (error) {
			return {
				servers: [],
				externalServers: [],
				patch: {
					...patch,
					error: error instanceof Error ? error.message : String(error)
				}
			};
		}
	}
	findRowByServerName(rows, serverName) {
		return rows.find((row) => serverNameFromRowId(row.id) === serverName || row.config?.serverName === serverName && isManagedRow(row));
	}
	configInputFromRow(row) {
		return inputFromPatchRow(row);
	}
	async save(rawPayload) {
		const payload = mcpSavePayloadSchema.parse(rawPayload);
		const input = payload.input;
		const previousName = payload.previousServerName ?? input.serverName;
		const { managed, external } = await this.readRows();
		for (const row of external) if (row.config?.serverName === input.serverName) throw new Error("serverName \"" + input.serverName + "\" 已被 cordis.patch.yml 中的外部 MCP 行占用，请在文件中手动处理");
		for (const row of managed) if (row.config?.serverName === input.serverName && serverNameFromRowId(row.id) !== previousName) throw new Error("serverName \"" + input.serverName + "\" 已存在（受管行 " + String(row.id) + "）");
		const previous = managed.find((row) => serverNameFromRowId(row.id) === previousName || row.config?.serverName === previousName);
		if (payload.previousServerName !== void 0 && previous === void 0) throw new Error("要编辑的 MCP 行不存在：\"" + previousName + "\"");
		const enabled = previous !== void 0 ? previous.disabled !== true : payload.enabled;
		const nextRow = applyServerEdit(previous, input, enabled);
		const nextRows = managed.filter((row) => serverNameFromRowId(row.id) !== previousName && row.config?.serverName !== previousName);
		nextRows.push(nextRow);
		nextRows.sort((a, b) => String(a.config?.serverName ?? "").localeCompare(String(b.config?.serverName ?? "")));
		await writeManagedRows(this.patchPath(), nextRows);
		const reconciled = enabled ? await waitForLoaderState(this.C, nextRow.id, (entry) => entry !== void 0 && entry.disabled !== true) : await waitForLoaderState(this.C, nextRow.id, (entry) => entry !== void 0 && entry.disabled === true);
		const entry = getLoaderEntry(this.C, nextRow.id);
		const server = this.decorate(nextRow, true, entry, enabled);
		if (server === void 0) throw new Error("写入成功但生成的 MCP 行无效");
		return {
			server,
			reconciled
		};
	}
	async removeServer(rawPayload) {
		const payload = mcpRemovePayloadSchema.parse(rawPayload);
		const { managed } = await this.readRows();
		const row = managed.find((candidate) => serverNameFromRowId(candidate.id) === payload.serverName || candidate.config?.serverName === payload.serverName);
		if (row === void 0) throw new Error("MCP 行 \"" + payload.serverName + "\" 不存在或不是面板受管行（外部行请在 cordis.patch.yml 中手动删除）");
		const nextRows = managed.filter((candidate) => candidate !== row);
		await writeManagedRows(this.patchPath(), nextRows);
		return {
			ok: true,
			reconciled: await waitForLoaderState(this.C, row.id, (entry) => entry === void 0)
		};
	}
	async setEnabled(rawPayload) {
		const payload = mcpSetEnabledPayloadSchema.parse(rawPayload);
		const { managed } = await this.readRows();
		const row = managed.find((candidate) => serverNameFromRowId(candidate.id) === payload.serverName || candidate.config?.serverName === payload.serverName);
		if (row === void 0) throw new Error("MCP 行 \"" + payload.serverName + "\" 不存在或不是面板受管行");
		row.disabled = !payload.enabled;
		await writeManagedRows(this.patchPath(), managed);
		const reconciled = payload.enabled ? await waitForLoaderState(this.C, row.id, (entry) => entry !== void 0 && entry.disabled !== true) : await waitForLoaderState(this.C, row.id, (entry) => entry !== void 0 && entry.disabled === true);
		const entry = getLoaderEntry(this.C, row.id);
		const server = this.decorate(row, true, entry, payload.enabled);
		if (server === void 0) throw new Error("写入成功但生成的 MCP 行无效");
		return {
			server,
			reconciled
		};
	}
	async test(rawPayload) {
		const payload = mcpTestPayloadSchema.parse(rawPayload);
		if (payload !== null && typeof payload === "object" && !("transport" in payload) && "serverName" in payload) {
			const { managed, external } = await this.readRows();
			const row = [...managed, ...external].find((candidate) => candidate.config?.serverName === payload.serverName || serverNameFromRowId(candidate.id) === payload.serverName);
			if (row === void 0) throw new Error("MCP 行 \"" + String(payload.serverName) + "\" 不存在");
			return probeMcpServer(this.configInputFromRow(row));
		}
		return probeMcpServer(payload);
	}
	reload() {
		return this.list();
	}
};
//#endregion
//#region src/provider.ts
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
var NestedSkillProvider = class {
	rank;
	name = "nested";
	constructor(rank, signal, invalidate) {
		this.rank = rank;
		const watcher = chokidar.watch(this.roots(), {
			ignoreInitial: true,
			ignored: (candidate) => {
				return candidate.split(/[/\\]/).some((part) => part === "node_modules" || part.startsWith("."));
			}
		});
		let timer;
		const kick = () => {
			if (timer !== void 0) return;
			timer = setTimeout(() => {
				timer = void 0;
				invalidate();
			}, 120);
		};
		watcher.on("add", kick);
		watcher.on("unlink", kick);
		watcher.on("addDir", kick);
		watcher.on("unlinkDir", kick);
		watcher.on("change", kick);
		watcher.on("error", () => {});
		signal.addEventListener("abort", () => {
			watcher.close();
		}, { once: true });
	}
	async list(options = {}) {
		const entries = await collectSkillEntries(await buildRoots(options.cwd, this.homes()));
		const candidates = [];
		for (const entry of entries) {
			if (!entry.enabled) continue;
			if (!entry.rel || !entry.rel.includes("/")) continue;
			candidates.push({
				name: entry.name,
				description: entry.description,
				...entry.whenToUse === void 0 ? {} : { whenToUse: entry.whenToUse },
				invocation: {
					modelInvocable: entry.modelInvocable ?? true,
					userInvocable: entry.userInvocable ?? true
				},
				provider: this.name,
				source: entry.source,
				rank: this.rank,
				locator: {
					path: entry.file,
					directory: dirname(entry.file)
				},
				resourceBase: {
					kind: "directory",
					path: dirname(entry.file)
				},
				path: entry.file
			});
		}
		return candidates;
	}
	async get(candidate, options = {}) {
		options.signal?.throwIfAborted();
		const parsed = parseFrontmatter(await readFile(candidate.locator.path, {
			encoding: "utf8",
			signal: options.signal
		}));
		if (parsed === void 0) return;
		return {
			name: parsed.name,
			description: parsed.description,
			...parsed.whenToUse === void 0 ? {} : { whenToUse: parsed.whenToUse },
			invocation: {
				modelInvocable: parsed.modelInvocable ?? true,
				userInvocable: parsed.userInvocable ?? true
			},
			provider: this.name,
			source: candidate.source,
			resourceBase: {
				kind: "directory",
				path: candidate.locator.directory
			},
			path: candidate.locator.path,
			content: parsed.body
		};
	}
	/** 被递归 watcher 监视的根（用户级根；项目根随 list() 的 cwd 动态扫描）。 */
	roots() {
		const { dshHome, agentsHome } = this.homes();
		return [join(agentsHome, "skills"), join(dshHome, "skills")];
	}
	homes() {
		return {
			dshHome: resolveDshHome(void 0, process.env),
			agentsHome: process.env.DSH_AGENTS_HOME ?? join(homedir(), ".agents")
		};
	}
};
//#endregion
//#region src/index.ts
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
const name = "dsh-better-workbench-skill-mcp-panels";
const inject = [
	"typert",
	"tools",
	"loader",
	"skills",
	"sessions",
	"agents"
];
const sessionIdSchema = z.string().optional();
const scopeSchema = z.object({
	kind: z.enum(["global", "workspace"]),
	path: z.string().optional(),
	label: z.string().optional()
});
const skillSummarySchema = z.object({
	name: z.string(),
	description: z.string(),
	whenToUse: z.string().optional(),
	provider: z.string(),
	source: z.string(),
	enabled: z.boolean(),
	modelInvocable: z.boolean(),
	userInvocable: z.boolean(),
	scope: scopeSchema.optional(),
	groups: z.array(z.string()).optional(),
	rel: z.string().optional()
});
const groupRowSchema = z.object({
	id: z.string(),
	name: z.string(),
	scopes: z.record(z.string(), z.array(z.string()))
});
const groupsResultSchema = z.object({ groups: z.array(groupRowSchema) });
const saveGroupPayloadSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	scope: z.string().nullable(),
	names: z.array(z.string())
});
const deleteGroupPayloadSchema = z.object({ id: z.string() });
const checkUpdateResultSchema = z.object({
	current: z.string(),
	latest: z.string().nullable(),
	updateAvailable: z.boolean()
});
const listResultSchema = z.object({ skills: z.array(skillSummarySchema) });
const workspacesResultSchema = z.object({ workspaces: z.array(z.object({
	path: z.string(),
	label: z.string(),
	sessions: z.number()
})) });
const resourceBaseSchema = z.object({
	kind: z.string(),
	path: z.string().optional(),
	url: z.string().optional(),
	description: z.string().optional()
}).optional();
const skillContentSchema = z.object({
	name: z.string(),
	description: z.string(),
	content: z.string(),
	provider: z.string(),
	whenToUse: z.string().optional(),
	path: z.string().optional(),
	resourceBase: resourceBaseSchema
}).nullable();
const setEnabledResultSchema = z.object({
	name: z.string(),
	enabled: z.boolean()
});
const deleteSkillResultSchema = z.object({ name: z.string() });
const migratePayloadSchema = z.object({
	target: z.string().nullable(),
	mode: z.enum(["copy", "move"]),
	from: z.string().nullable().optional()
});
const migrateResultSchema = z.object({
	name: z.string(),
	scope: scopeSchema
});
const batchMigratePayloadSchema = z.object({
	from: z.string().nullable(),
	targets: z.array(z.string().nullable()).min(1),
	mode: z.enum(["copy", "move"]),
	names: z.array(z.string())
});
const batchMigrateResultSchema = z.object({ results: z.array(z.object({
	name: z.string(),
	target: z.string().nullable().optional(),
	ok: z.boolean(),
	error: z.string().optional()
})) });
const addFileSchema = z.object({
	path: z.string(),
	base64: z.string()
});
const addPayloadSchema = z.object({
	kind: z.enum([
		"bundle",
		"flat",
		"zip"
	]),
	files: z.array(addFileSchema).min(1),
	workspace: z.string().nullable().optional()
});
const addResultSchema = z.object({
	name: z.string(),
	kind: z.enum(["bundle", "flat"]),
	scope: scopeSchema
});
/** 注册到 API 网关的类型化 wire 描述符。 */
const MANIFEST = {
	package: "dsh-skill-mcp-panel",
	face: "host",
	schemas: [],
	invocations: [
		{
			id: "dsh-skill-mcp-panel#skillsViewer/list",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "list",
			invocation: { kind: "direct" },
			parameters: [{
				name: "sessionId",
				wire: "sessionId",
				source: "json",
				acceptsUndefined: true,
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#sessionId",
					schema: sessionIdSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#SkillListResult",
				schema: listResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/workspaces",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "workspaces",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#WorkspacesResult",
				schema: workspacesResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/groups",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "groups",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#GroupsResult",
				schema: groupsResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/checkUpdate",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "checkUpdate",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#CheckUpdateResult",
				schema: checkUpdateResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/saveGroup",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "saveGroup",
			invocation: { kind: "direct" },
			parameters: [{
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#SaveGroupPayload",
					schema: saveGroupPayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#GroupsResult",
				schema: groupsResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/deleteGroup",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "deleteGroup",
			invocation: { kind: "direct" },
			parameters: [{
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#DeleteGroupPayload",
					schema: deleteGroupPayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#GroupsResult",
				schema: groupsResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/content",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "content",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "name",
					wire: "name",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#SkillName",
						schema: z.string()
					}
				},
				{
					name: "sessionId",
					wire: "sessionId",
					source: "json",
					acceptsUndefined: true,
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#sessionId",
						schema: sessionIdSchema
					}
				},
				{
					name: "scope",
					wire: "scope",
					source: "json",
					acceptsUndefined: true,
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#SkillScope",
						schema: z.union([z.string(), z.null()])
					}
				}
			],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#SkillContent",
				schema: skillContentSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/setEnabled",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "setEnabled",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "name",
					wire: "name",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#SkillName",
						schema: z.string()
					}
				},
				{
					name: "sessionId",
					wire: "sessionId",
					source: "json",
					acceptsUndefined: true,
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#sessionId",
						schema: sessionIdSchema
					}
				},
				{
					name: "enabled",
					wire: "enabled",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#EnabledFlag",
						schema: z.boolean()
					}
				},
				{
					name: "scope",
					wire: "scope",
					source: "json",
					acceptsUndefined: true,
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#SkillScope",
						schema: z.union([z.string(), z.null()])
					}
				}
			],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#SetEnabledResult",
				schema: setEnabledResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/migrate",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "migrate",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "name",
					wire: "name",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#SkillName",
						schema: z.string()
					}
				},
				{
					name: "sessionId",
					wire: "sessionId",
					source: "json",
					acceptsUndefined: true,
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#sessionId",
						schema: sessionIdSchema
					}
				},
				{
					name: "payload",
					wire: "payload",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#MigratePayload",
						schema: migratePayloadSchema
					}
				}
			],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#MigrateResult",
				schema: migrateResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/batchMigrate",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "batchMigrate",
			invocation: { kind: "direct" },
			parameters: [{
				name: "sessionId",
				wire: "sessionId",
				source: "json",
				acceptsUndefined: true,
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#sessionId",
					schema: sessionIdSchema
				}
			}, {
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#BatchMigratePayload",
					schema: batchMigratePayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#BatchMigrateResult",
				schema: batchMigrateResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/deleteSkill",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "deleteSkill",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "name",
					wire: "name",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#SkillName",
						schema: z.string()
					}
				},
				{
					name: "sessionId",
					wire: "sessionId",
					source: "json",
					acceptsUndefined: true,
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#sessionId",
						schema: sessionIdSchema
					}
				},
				{
					name: "scope",
					wire: "scope",
					source: "json",
					acceptsUndefined: true,
					codec: {
						mode: "strict",
						typeSymbol: "dsh-skill-mcp-panel#SkillScope",
						schema: z.union([z.string(), z.null()])
					}
				}
			],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#DeleteSkillResult",
				schema: deleteSkillResultSchema
			}
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/addSkill",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "addSkill",
			invocation: { kind: "direct" },
			parameters: [{
				name: "sessionId",
				wire: "sessionId",
				source: "json",
				acceptsUndefined: true,
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#sessionId",
					schema: sessionIdSchema
				}
			}, {
				name: "payload",
				wire: "payload",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "dsh-skill-mcp-panel#AddPayload",
					schema: addPayloadSchema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "dsh-skill-mcp-panel#AddResult",
				schema: addResultSchema
			}
		}
	],
	model: {
		services: [],
		events: [],
		objects: []
	}
};
/**
* 技能与 MCP 共用同一个 Typert package face：两个 manifest 必须合并注册，
* 否则 typert 会因 "package face ... is already registered" 拒绝启动。
*/
const PANEL_MANIFEST = {
	...MANIFEST,
	schemas: [...MANIFEST.schemas, ...MCP_MANIFEST.schemas],
	invocations: [...MANIFEST.invocations, ...MCP_MANIFEST.invocations]
};
/** 归一技能 md 文本：去 BOM、CRLF 归一为 LF（yaml 解析对孤立 \r 敏感）。 */
function normalizeSkillText(data) {
	return Buffer.from(data.toString("utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"), "utf8");
}
/** 浏览器上传目录束的护栏。 */
const MAX_ADD_FILES = 200;
const MAX_ADD_TOTAL_BYTES = 8388608;
/**
* 远程服务实例。构造它即注册 "skillsViewer" cordis 服务；上面的 manifest
* 让 API 网关可以分发端点。
*/
var SkillsViewerGateway = class extends TypertRemoteService {
	constructor(ctx) {
		super(ctx, "skillsViewer");
	}
	/** 对动态 harness 上下文（sessions/agents/typert）的无类型访问桥。 */
	get C() {
		return this.ctx;
	}
	registryFor(sessionId) {
		const live = sessionId === void 0 ? void 0 : this.C.agents.get(sessionId);
		if (live !== void 0) {
			const scoped = this.C.get("agentPresets")?.serviceFor(live, "skills");
			if (scoped !== void 0) return scoped;
		}
		return this.C.skills;
	}
	viewFor(sessionId) {
		const registry = this.registryFor(sessionId);
		const session = sessionId === void 0 ? void 0 : this.C.sessions.get(sessionId);
		const scope = sessionId === void 0 ? void 0 : this.C.agents.get(sessionId);
		return {
			registry,
			cwd: session?.header?.cwd,
			scope
		};
	}
	homes() {
		return {
			dshHome: resolveDshHome(),
			agentsHome: resolve(process.env.DSH_AGENTS_HOME?.trim() ? process.env.DSH_AGENTS_HOME : join(homedir(), ".agents"))
		};
	}
	/** 判断候选路径是否位于某基准目录内。 */
	isWithin(baseDir, candidate) {
		if (typeof candidate !== "string" || candidate === "") return false;
		const base = resolve(baseDir);
		const value = resolve(candidate);
		if (value === base) return true;
		const b = process.platform === "win32" ? base.toLowerCase() : base;
		const v = process.platform === "win32" ? value.toLowerCase() : value;
		const sep = process.platform === "win32" ? "\\" : "/";
		return v.startsWith(b.endsWith(sep) ? b : b + sep);
	}
	/**
	* 全部管理根：用户根 + 每个已知工作区的一对项目根。
	* 与 skill-files.ts 的 buildRoots 相似但并非重复：buildRoots 面向 CLI 的
	* 单一 cwd 锚点；这里枚举网关已知的全部工作区。
	*/
	async allRoots() {
		const { dshHome, agentsHome } = this.homes();
		const roots = [];
		const seen = /* @__PURE__ */ new Set();
		const push = (path, source, projectRoot) => {
			const normalized = resolve(path);
			const key = process.platform === "win32" ? normalized.toLowerCase() : normalized;
			if (seen.has(key)) return;
			seen.add(key);
			roots.push({
				path,
				source,
				projectRoot
			});
		};
		push(join(dshHome, "skills"), "user-dsh", void 0);
		push(join(agentsHome, "skills"), "user-agents", void 0);
		for (const workspace of (await this.workspaces()).workspaces) {
			push(join(workspace.path, ".dsh", "skills"), "project-dsh", workspace.path);
			push(join(workspace.path, ".agents", "skills"), "project-agents", workspace.path);
		}
		return roots;
	}
	/** 用户根与所有已知工作区里的全部文件级条目。 */
	async fileEntriesAll() {
		return collectSkillEntries(await this.allRoots());
	}
	/** 注册表技能路径属于某工作区文件时，其所属的项目根。 */
	workspaceOfPath(path, roots) {
		if (typeof path !== "string" || path === "") return void 0;
		for (const root of roots) {
			if (root.projectRoot === void 0) continue;
			if (this.isWithin(root.path, path)) return root.projectRoot;
		}
	}
	/**
	* 已知工作区标题表：项目根 → 名称（注册表 title，缺省回退文件夹名）。
	* 与 scope.ts 的 workspaceTitleMap 分工不同：那个给 CLI 离线读注册表文件用；
	* 这里走网关在线的 workspaces()，口径与页面工作区横栏一致。
	*/
	async workspaceTitles() {
		const map = /* @__PURE__ */ new Map();
		const keyOf = (path) => process.platform === "win32" ? path.toLowerCase() : path;
		for (const workspace of (await this.workspaces()).workspaces) {
			const project = resolve(workspace.path);
			const label = workspace.label && workspace.label !== "" ? workspace.label : basename(project) || project;
			map.set(keyOf(project), label);
		}
		return {
			map,
			keyOf
		};
	}
	/** 条目所属位置标签：优先用 DSH 的工作区名称，取不到回退文件夹名。 */
	async scopeForEntry(entry, titles) {
		if (entry.projectRoot !== void 0) {
			const cache = titles ?? await this.workspaceTitles();
			const project = resolve(entry.projectRoot);
			const label = cache.map.get(cache.keyOf(project));
			return {
				kind: "workspace",
				path: entry.projectRoot,
				label: label ?? (basename(entry.projectRoot) || entry.projectRoot)
			};
		}
		return { kind: "global" };
	}
	/** 目标位置标签：优先用 DSH 的工作区名称，取不到回退文件夹名。 */
	async scopeForTarget(targetRoot, targetProject, titles) {
		const { dshHome } = this.homes();
		if (resolve(targetRoot) === resolve(join(dshHome, "skills"))) return { kind: "global" };
		const cache = titles ?? await this.workspaceTitles();
		const project = resolve(targetProject);
		return {
			kind: "workspace",
			path: targetProject,
			label: cache.map.get(cache.keyOf(project)) ?? (basename(targetProject) || targetProject)
		};
	}
	/** 目录：注册表技能（全局）+ 按所属位置打标的每条文件条目。 */
	async list(sessionId) {
		const { registry, cwd, scope } = this.viewFor(sessionId);
		const roots = await this.allRoots();
		const listed = await registry.list({
			cwd,
			scope
		});
		const groupMap = await loadGroups(this.homes().dshHome);
		const fileEntries = await collectSkillEntries(roots);
		const relByKey = /* @__PURE__ */ new Map();
		for (const entry of fileEntries) relByKey.set(entry.name + "\0" + (entry.projectRoot ?? "global"), entry.rel ?? "");
		const skills = [];
		const seen = /* @__PURE__ */ new Set();
		const seenKey = (name, scopePath) => name + "\0" + (scopePath ?? "global");
		for (const skill of listed) {
			if (this.workspaceOfPath(skill.path, roots) !== void 0) continue;
			const source = skill.source ?? (skill.provider === "runtime" ? "runtime" : "");
			skills.push({
				name: skill.name,
				description: skill.description,
				...skill.whenToUse === void 0 ? {} : { whenToUse: skill.whenToUse },
				provider: skill.provider,
				source,
				enabled: true,
				modelInvocable: skill.invocation.modelInvocable,
				userInvocable: skill.invocation.userInvocable,
				scope: { kind: "global" },
				groups: groupsForSkill(groupMap, "global", skill.name),
				...relByKey.get(skill.name + "\0global") ? { rel: relByKey.get(skill.name + "\0global") } : {}
			});
			seen.add(seenKey(skill.name, "global"));
		}
		const titles = await this.workspaceTitles();
		for (const entry of fileEntries) {
			const scopePath = entry.projectRoot ?? "global";
			if (seen.has(seenKey(entry.name, scopePath))) continue;
			seen.add(seenKey(entry.name, scopePath));
			skills.push({
				name: entry.name,
				description: entry.description,
				...entry.whenToUse === void 0 ? {} : { whenToUse: entry.whenToUse },
				provider: "filesystem",
				source: entry.source,
				enabled: entry.enabled,
				modelInvocable: false,
				userInvocable: false,
				scope: await this.scopeForEntry(entry, titles),
				groups: groupsForSkill(groupMap, scopePath, entry.name),
				...entry.rel ? { rel: entry.rel } : {}
			});
		}
		return { skills };
	}
	/** 分组列表（按名称排序）。 */
	async groups() {
		return { groups: this.groupRows(await loadGroups(this.homes().dshHome)) };
	}
	/** 检查插件是否有新版本（对比 GitHub Release 最新版）。 */
	async checkUpdate() {
		const current = currentVersion();
		const latest = await fetchLatestVersion();
		if (latest === void 0) return {
			current,
			latest: null,
			updateAvailable: false
		};
		return {
			current,
			latest,
			updateAvailable: compareVersions(latest, current) > 0
		};
	}
	/** 新建或更新分组（设置某工作区下的成员列表）。 */
	async saveGroup(payload) {
		const { id, name, scope: rawScope, names } = payload;
		const { dshHome } = this.homes();
		await upsertGroup(dshHome, id, name, rawScope === null || rawScope === void 0 ? "global" : await normalizeWorkspace(rawScope), names);
		return { groups: this.groupRows(await loadGroups(dshHome)) };
	}
	/** 删除分组。 */
	async deleteGroup(payload) {
		const { id } = payload;
		const { dshHome } = this.homes();
		await deleteGroup(dshHome, id);
		return { groups: this.groupRows(await loadGroups(dshHome)) };
	}
	/** 把分组配置转成 wire 行（含每个工作区的成员名）。 */
	groupRows(groups) {
		return Object.entries(groups).map(([id, group]) => ({
			id,
			name: group.name,
			scopes: group.scopes ?? {}
		})).sort((a, b) => a.name.localeCompare(b.name));
	}
	/** 所有已知工作区的互不相同的项目根（供工作区横栏使用）。 */
	async workspaces() {
		const map = /* @__PURE__ */ new Map();
		const keyOf = (path) => process.platform === "win32" ? path.toLowerCase() : path;
		const add = async (path, label, sessions) => {
			if (typeof path !== "string" || path === "") return;
			const info = await stat(resolve(path)).catch(() => void 0);
			if (info === void 0 || !info.isDirectory()) return;
			let project;
			try {
				project = await findProjectRoot(resolve(path));
			} catch {
				return;
			}
			const key = keyOf(project);
			if (map.has(key)) return;
			map.set(key, {
				path: project,
				label: label || basename(project) || project,
				sessions: sessions ?? 0
			});
		};
		try {
			const registry = this.C.get("workspaceRegistry");
			if (registry !== void 0 && typeof registry.list === "function") for (const workspace of registry.list()) {
				try {
					if (await workspace.status() !== "ok") continue;
				} catch {}
				await add(workspace.path, workspace.title, Array.isArray(workspace.sessionIds) ? workspace.sessionIds.length : 0);
			}
		} catch {}
		try {
			for (const session of this.C.sessions.list()) {
				const cwd = session.header?.cwd;
				if (cwd === void 0 || cwd === "") continue;
				await add(resolve(cwd), void 0, 1);
			}
		} catch {}
		return { workspaces: [...map.values()].sort((a, b) => a.label.localeCompare(b.label) || a.path.localeCompare(b.path)) };
	}
	/** 定位技能：注册表在线行、普通文件条目，或不存在。 */
	async locate(name, sessionId) {
		const { registry, cwd, scope } = this.viewFor(sessionId);
		const skill = await registry.get(name, {
			cwd,
			scope
		});
		if (skill !== void 0 && this.workspaceOfPath(skill.path, await this.allRoots()) === void 0) return {
			kind: "live",
			skill
		};
		const entry = winnerEntry(await this.fileEntriesAll(), name);
		if (entry !== void 0) return {
			kind: "file",
			entry
		};
		return { kind: "missing" };
	}
	/**
	* 指定作用域里的那一份文件条目（"global" 或工作区项目根路径）。
	* 同名技能可能存在于多个作用域，行级操作一律走这里精确取条目。
	*/
	async entryInScope(name, scope, entries) {
		const wantGlobal = scope === "global";
		return (entries ?? await this.fileEntriesAll()).find((candidate) => candidate.name === name && (wantGlobal ? candidate.projectRoot === void 0 : candidate.projectRoot !== void 0 && resolve(candidate.projectRoot) === resolve(scope)));
	}
	/** 完整正文：注册表定义，或磁盘上的技能原文件；指定作用域时读该作用域的那一份。 */
	async content(name, sessionId, scope) {
		if (typeof scope === "string" && scope !== "") {
			const entry = await this.entryInScope(name, scope);
			if (entry !== void 0) {
				const scopedRaw = await readFile(entry.file, "utf8");
				return {
					name: entry.name,
					description: entry.description,
					content: scopedRaw,
					provider: "filesystem",
					path: entry.file
				};
			}
			if (scope !== "global") return null;
		}
		const located = await this.locate(name, sessionId);
		if (located.kind === "missing") return null;
		if (located.kind === "file") {
			const raw = await readFile(located.entry.file, "utf8");
			return {
				name: located.entry.name,
				description: located.entry.description,
				content: raw,
				provider: "filesystem",
				path: located.entry.file
			};
		}
		const skill = located.skill;
		return {
			name: skill.name,
			description: skill.description,
			content: skill.content,
			provider: skill.provider,
			...skill.whenToUse === void 0 ? {} : { whenToUse: skill.whenToUse },
			...skill.path === void 0 ? {} : { path: skill.path },
			...skill.resourceBase === void 0 ? {} : { resourceBase: skill.resourceBase }
		};
	}
	assertEditable(skill) {
		if (skill.source === "bundled") throw new Error("技能 \"" + skill.name + "\" 随部署附带，不可修改");
		if (typeof skill.path !== "string" || skill.path.length === 0) throw new Error("技能 \"" + skill.name + "\" 没有可修改的文件");
	}
	/** 文件条目的原地启停改名。 */
	async setEntryEnabled(name, entry, enabled) {
		if (enabled === entry.enabled) return {
			name,
			enabled
		};
		const target = enabled ? entry.file.slice(0, -9) : entry.file + DISABLED_SUFFIX;
		if (await pathExists(target)) throw new Error("目标文件已存在：" + target);
		await rename(entry.file, target);
		return {
			name,
			enabled
		};
	}
	/**
	* 热启用/停用：把技能文件原地改名 *.disabled（或改回）。
	* 指定作用域时只操作该作用域里的那一份（同名技能可能存在于多个作用域），
	* 找不到即报错——绝不回退去操作别的作用域的副本。
	*/
	async setEnabled(name, sessionId, enabled, scope) {
		const scoped = typeof scope === "string" && scope !== "";
		if (scoped) {
			const entry = await this.entryInScope(name, scope);
			if (entry !== void 0) return this.setEntryEnabled(name, entry, enabled);
			if (scope !== "global") throw new Error("技能 \"" + name + "\" 在指定作用域中不存在");
		}
		const located = await this.locate(name, sessionId);
		if (located.kind === "missing") throw new Error("技能 \"" + name + "\" 不存在");
		if (located.kind === "live") {
			const skill = located.skill;
			this.assertEditable(skill);
			if (enabled) return {
				name,
				enabled: true
			};
			const target = skill.path + DISABLED_SUFFIX;
			if (await pathExists(target)) throw new Error("目标文件已存在：" + target);
			await rename(skill.path, target);
			return {
				name,
				enabled: false
			};
		}
		if (scoped) throw new Error("技能 \"" + name + "\" 在指定作用域中不存在");
		return this.setEntryEnabled(name, located.entry, enabled);
	}
	/** 删除一个文件条目（目录束连目录一起删）。 */
	async removeEntry(entry) {
		if (entry.dirBundle) await rm(dirname(entry.file), {
			recursive: true,
			force: true
		});
		else await rm(entry.file, { force: true });
	}
	/**
	* 永久删除技能。指定作用域时只删除该作用域里的那一份（同名技能可能存在于
	* 多个作用域），找不到即报错——绝不回退去删除别的作用域的副本。
	*/
	async deleteSkill(name, sessionId, scope) {
		const scoped = typeof scope === "string" && scope !== "";
		if (scoped) {
			const entry = await this.entryInScope(name, scope);
			if (entry !== void 0) {
				await this.removeEntry(entry);
				return { name };
			}
			if (scope !== "global") throw new Error("技能 \"" + name + "\" 在指定作用域中不存在");
		}
		const located = await this.locate(name, sessionId);
		if (located.kind === "missing") throw new Error("技能 \"" + name + "\" 不存在");
		if (located.kind === "live") {
			const skill = located.skill;
			this.assertEditable(skill);
			if (basename(skill.path) === "SKILL.md") await rm(dirname(skill.path), {
				recursive: true,
				force: true
			});
			else await rm(skill.path, { force: true });
			return { name };
		}
		if (scoped) throw new Error("技能 \"" + name + "\" 在指定作用域中不存在");
		await this.removeEntry(located.entry);
		return { name };
	}
	/** 迁移可以挪动的条目（或用户根里的在线技能）。 */
	async migratableEntry(name, sessionId) {
		const entry = winnerEntry(await this.fileEntriesAll(), name);
		if (entry !== void 0) return entry;
		const located = await this.locate(name, sessionId);
		if (located.kind !== "live") return void 0;
		const skill = located.skill;
		if (typeof skill.path !== "string" || skill.path === "") return void 0;
		const { dshHome, agentsHome } = this.homes();
		if (![join(dshHome, "skills"), join(agentsHome, "skills")].some((root) => this.isWithin(root, skill.path))) return void 0;
		this.assertEditable(skill);
		return {
			name: skill.name,
			file: skill.path,
			dirBundle: basename(skill.path) === "SKILL.md",
			enabled: true,
			source: skill.source ?? "user-dsh"
		};
	}
	/** 把单个技能移动或复制到另一个工作区文件夹。 */
	async migrate(name, sessionId, payload) {
		const { target: rawTarget, mode, from: rawFrom } = payload;
		const { dshHome } = this.homes();
		const targetProject = rawTarget === null || rawTarget === void 0 ? null : await normalizeWorkspace(rawTarget);
		const targetRoot = scopeRootOf(targetProject, dshHome);
		const entry = typeof rawFrom === "string" && rawFrom !== "" ? await this.entryInScope(name, rawFrom) : await this.migratableEntry(name, sessionId);
		if (entry === void 0 || entry === null) throw new Error("技能 \"" + name + "\" 没有可迁移的文件（随部署附带、运行时内置或不在指定源作用域的技能不可迁移）");
		await migrateEntry(entry, targetRoot, mode);
		return {
			name,
			scope: await this.scopeForTarget(targetRoot, targetProject)
		};
	}
	/** 把一批技能迁移到一个或多个目标工作区；逐条返回结果。 */
	async batchMigrate(sessionId, payload) {
		const { from: rawFrom, targets: rawTargets, mode, names } = payload;
		if (mode === "move" && rawTargets.length > 1) throw new Error("移动模式只能选择一个目标工作区（多个目标请改用复制）");
		const { dshHome, agentsHome } = this.homes();
		const fromProject = rawFrom === null || rawFrom === void 0 ? null : await normalizeWorkspace(rawFrom);
		const fromRoots = fromProject === null ? [{
			path: join(dshHome, "skills"),
			source: "user-dsh"
		}, {
			path: join(agentsHome, "skills"),
			source: "user-agents"
		}] : [{
			path: workspaceSkillRoot(fromProject),
			source: "project-dsh",
			projectRoot: fromProject
		}];
		const byName = /* @__PURE__ */ new Map();
		for (const entry of await collectSkillEntries(fromRoots)) if (!byName.has(entry.name)) byName.set(entry.name, entry);
		const chosen = [];
		const results = [];
		for (const name of names) {
			const entry = byName.get(name);
			if (entry === void 0) results.push({
				name,
				ok: false,
				error: "技能 \"" + name + "\" 不在源工作区中"
			});
			else chosen.push(entry);
		}
		for (const rawTarget of rawTargets) {
			const targetRoot = scopeRootOf(rawTarget === null || rawTarget === void 0 ? null : await normalizeWorkspace(rawTarget), dshHome);
			if (fromRoots.some((root) => resolve(root.path) === resolve(targetRoot))) {
				for (const entry of chosen) results.push({
					name: entry.name,
					target: rawTarget ?? null,
					ok: false,
					error: "目标工作区与源工作区相同"
				});
				continue;
			}
			for (const item of await batchMigrateEntries(chosen, targetRoot, mode)) results.push({
				name: item.name,
				target: rawTarget ?? null,
				ok: item.ok,
				...item.error === void 0 ? {} : { error: item.error }
			});
		}
		return { results };
	}
	/**
	* 把新技能直接导入某个位置（全局或工作区）的文件夹：
	*   workspace 缺省/为 null → 全局用户根
	*   workspace 给了路径   → <workspaceProjectRoot>/.dsh/skills
	* 写入前先校验 frontmatter；随后轮询注册表确认 DSH 已接收该技能——
	* 否则回滚文件并报告拒绝原因。
	*/
	async addSkill(sessionId, payload) {
		const { kind: rawKind, files, workspace: rawWorkspace } = payload;
		if (files.length > MAX_ADD_FILES) throw new Error("文件数量过多（最多 200 个）");
		let kind = rawKind;
		let decoded = files.map((file) => {
			const data = Buffer.from(file.base64, "base64");
			if (data.length === 0 && file.base64.length > 0) throw new Error("文件内容解码失败：" + file.path);
			return {
				path: file.path.replaceAll("\\", "/"),
				data
			};
		});
		if (rawKind === "zip") {
			const unzipped = [];
			for (const file of decoded) {
				if (!file.path.toLowerCase().endsWith(".zip")) {
					unzipped.push(file);
					continue;
				}
				let zipEntries;
				try {
					zipEntries = unzipSync(new Uint8Array(file.data));
				} catch (error) {
					throw new Error("无法解析压缩包 " + file.path + "：" + (error instanceof Error ? error.message : String(error)));
				}
				for (const name of Object.keys(zipEntries)) {
					if (name === "" || name.endsWith("/")) continue;
					if (name.startsWith("__MACOSX/") || name.split("/").includes("__MACOSX")) continue;
					unzipped.push({
						path: name.replaceAll("\\", "/"),
						data: Buffer.from(zipEntries[name])
					});
				}
			}
			decoded = unzipped;
			if (decoded.length === 0) throw new Error("压缩包中没有可用的文件");
			if (decoded.length > MAX_ADD_FILES) throw new Error("压缩包内文件数量过多（最多 200 个）");
			const tops = new Set(decoded.map((file) => file.path.split("/")[0]));
			const hasNested = decoded.some((file) => file.path.includes("/"));
			if (tops.size === 1 && hasNested) {
				const top = [...tops][0];
				if (!decoded.some((file) => file.path === top + "/SKILL.md")) throw new Error("压缩包结构无法识别：唯一的顶层文件夹缺少 SKILL.md 文件");
				kind = "bundle";
			} else if (!hasNested) kind = "flat";
			else throw new Error("压缩包结构无法识别：应为「一个技能文件夹（内含 SKILL.md）」或「若干 .md 文件」");
		}
		if (decoded.reduce((sum, file) => sum + file.data.length, 0) > MAX_ADD_TOTAL_BYTES) throw new Error("技能总大小超过 8MB 上限（含解压后内容）");
		for (const file of decoded) if (file.path.startsWith("/") || file.path.split("/").some((segment) => segment === ".." || segment === ".")) throw new Error("非法文件路径：" + file.path);
		const { dshHome } = this.homes();
		let targetProject;
		let targetRoot;
		if (rawWorkspace === void 0 || rawWorkspace === null || rawWorkspace === "") targetRoot = join(dshHome, "skills");
		else {
			targetProject = await normalizeWorkspace(rawWorkspace);
			targetRoot = workspaceSkillRoot(targetProject);
		}
		const skills = [];
		if (kind === "bundle") {
			const tops = new Set(decoded.map((file) => file.path.split("/")[0]));
			if (tops.size !== 1 || decoded.some((file) => file.path.split("/").length < 2)) throw new Error("技能文件夹结构不正确：所有文件应位于同一个文件夹内");
			const top = [...tops][0];
			const skillFile = decoded.find((file) => file.path === top + "/SKILL.md");
			if (skillFile === void 0) throw new Error("技能文件夹缺少顶层的 SKILL.md 文件");
			const validation = validateFrontmatter(skillFile.data.toString("utf8"));
			if (!validation.ok) throw new Error("技能格式不符合要求：" + validation.error);
			skills.push({
				name: validation.skill.name,
				writes: decoded.map((file) => ({
					relative: file.path.slice(top.length + 1),
					data: file.path.toLowerCase().endsWith(".md") ? normalizeSkillText(file.data) : file.data
				}))
			});
		} else for (const file of decoded) {
			const flatName = file.path.split("/").filter(Boolean).pop() ?? "";
			if (!flatName.toLowerCase().endsWith(".md")) throw new Error("技能文件必须是 .md 文件");
			const validation = validateFrontmatter(file.data.toString("utf8"));
			if (!validation.ok) throw new Error("技能格式不符合要求（" + flatName + "）：" + validation.error);
			skills.push({
				name: validation.skill.name,
				writes: [{
					relative: flatName,
					data: normalizeSkillText(file.data)
				}]
			});
		}
		if (skills.length === 0) throw new Error("没有可添加的技能");
		const batchNames = /* @__PURE__ */ new Set();
		for (const skill of skills) {
			if (batchNames.has(skill.name)) throw new Error("本次选择的技能中有重名：\"" + skill.name + "\"");
			batchNames.add(skill.name);
		}
		const allExisting = await this.fileEntriesAll();
		const { registry, cwd, scope } = this.viewFor(sessionId);
		const liveSkills = await registry.list({
			cwd,
			scope
		});
		for (const skill of skills) {
			const existing = winnerEntry(allExisting, skill.name);
			if (existing !== void 0) throw new Error("同名技能 \"" + skill.name + "\" 已存在（" + (existing.enabled ? "已启用" : "已停用") + "，位于 " + (existing.projectRoot !== void 0 ? existing.projectRoot : "全局用户根") + "）");
			if (liveSkills.some((live) => live.name === skill.name)) throw new Error("同名技能 \"" + skill.name + "\" 已存在");
		}
		const plannedTargets = /* @__PURE__ */ new Set();
		for (const skill of skills) {
			const target = kind === "bundle" ? join(targetRoot, skill.name) : join(targetRoot, skill.writes[0].relative);
			const targetKey = process.platform === "win32" ? target.toLowerCase() : target;
			if (plannedTargets.has(targetKey)) throw new Error("本次选择的技能落盘路径相同：\"" + target + "\"");
			plannedTargets.add(targetKey);
			if (await pathExists(target)) throw new Error("目标路径已存在：" + target);
			skill.target = target;
		}
		const stagingBase = join(targetRoot, ".dsh-skill-staging-" + process.pid + "-" + Math.random().toString(36).slice(2, 8));
		const written = [];
		try {
			for (let index = 0; index < skills.length; index++) {
				const skill = skills[index];
				const target = skill.target;
				const staging = join(stagingBase, String(index));
				for (const write of skill.writes) {
					const filePath = join(staging, write.relative);
					await mkdir(dirname(filePath), { recursive: true });
					await writeFile(filePath, write.data);
				}
				if (kind === "bundle") await rename(staging, target);
				else {
					const stagedFile = join(staging, skill.writes[0].relative);
					await rename(stagedFile, target);
					await rm(staging, {
						recursive: true,
						force: true
					}).catch(() => {});
				}
				written.push(target);
			}
		} catch (error) {
			await rm(stagingBase, {
				recursive: true,
				force: true
			}).catch(() => {});
			for (const target of written.reverse()) await rm(target, {
				recursive: true,
				force: true
			}).catch(() => {});
			throw new Error("写入技能文件失败（已回滚）：" + (error instanceof Error ? error.message : String(error)));
		}
		if (!await this.waitForDiscovery(skills.map((skill) => skill.name), sessionId, targetProject ?? cwd)) {
			for (const target of written.reverse()) await rm(target, {
				recursive: true,
				force: true
			}).catch(() => {});
			throw new Error("DSH 未接受部分技能（格式校验未通过），已回滚。请检查 frontmatter 后重试");
		}
		return {
			name: skills.map((skill) => skill.name).join(", "),
			kind,
			scope: targetProject === void 0 ? { kind: "global" } : await this.scopeForTarget(targetRoot, targetProject)
		};
	}
	async waitForDiscovery(names, sessionId, probeCwd) {
		const { registry, scope } = this.viewFor(sessionId);
		const pending = new Set(names);
		for (let attempt = 0; attempt < 12; attempt++) {
			await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
			try {
				for (const name of [...pending]) if (await registry.get(name, {
					cwd: probeCwd,
					scope
				}) !== void 0) pending.delete(name);
				if (pending.size === 0) return true;
			} catch {
				return true;
			}
		}
		return false;
	}
};
function apply(ctx) {
	new SkillsViewerGateway(ctx);
	new McpManagerGateway(ctx);
	ctx.effect(() => ctx.typert.register(PANEL_MANIFEST), "dsh-better-workbench-skill-mcp-panels: typert manifest");
	ctx.skills.registerProvider((control) => new NestedSkillProvider(300, control.signal, control.invalidate));
}
//#endregion
export { apply, inject, name };
