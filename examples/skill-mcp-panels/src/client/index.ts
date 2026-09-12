/**
 * Skills and MCP Workbench pages.
 *
 * Ported from Fishquito7/dsh-skill-mcp-panel (MIT) into a Workbench example.
 * See ../README.md for the full attribution and the porting changes.
 */

import * as reactJsxRuntimeModule from "react/jsx-runtime";
import * as reactModule from "react";
import * as primitivesModule from "@deepseek-ai/dsh-client-ui-primitives";

// The upstream client shipped its own classic-script loader wrapper; the
// Workbench build helper emits that wrapper, so this port is a plain module.
//
// The three host modules stay loosely typed on purpose. The upstream UI is
// JavaScript-style TypeScript whose state, props and handlers were never
// checked against @types/react (it shipped no react types at all), and the
// primitives icon exports vary across revisions. Re-typing ~2300 lines of
// ported UI is out of scope for a reference example, so this port keeps the
// upstream compilation shape instead of rewriting it.
const react_jsx_runtime: any = reactJsxRuntimeModule;
const react: any = reactModule;
const primitives: any = primitivesModule;

// ── 技能树构建：从技能条目（含 rel）构建与文件树一致的分层结构 ──────
// 正确性：叶子只能是扫描器验证过的技能条目（含 SKILL.md 的目录）；
// rel 中间段是分类文件夹（永远不是技能）；rel 为空 = 根层叶子。
// 因此"非技能的嵌套文件夹"不可能成为树节点。
function buildSkillTree(skills) {
	const root: any = { path: "", name: "", skills: [], folders: new Map(), count: 0 };
	const byPath: Map<string, any> = new Map();
	byPath.set("", root);
	for (const skill of skills) {
		const rel = skill?.rel ?? "";
		if (rel === "") {
			root.skills.push(skill);
			continue;
		}
		const segments = rel.split("/");
		const dirSegments = segments.slice(0, -1);
		let current = "";
		let node = root;
		for (const segment of dirSegments) {
			current = current === "" ? segment : current + "/" + segment;
			let child = byPath.get(current);
			if (child === undefined) {
				child = { path: current, name: segment, skills: [], folders: new Map(), count: 0 };
				byPath.set(current, child);
				node.folders.set(segment, child);
			}
			node = child;
		}
		node.skills.push(skill);
	}
	computeCounts(root);
	return root;
}
function computeCounts(node) {
	let total = node.skills.length;
	for (const child of node.folders.values()) total += computeCounts(child);
	node.count = total;
	return total;
}

// ── 样式（按用途分组）─────────────────────────────────────────────────
// 页面骨架：section / 状态文案 / 搜索框 / 标题行
const cssChrome = ".SKV_section{position:relative;width:100%;max-width:760px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;display:flex}.SKV_status{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;margin:0}.SKV_failure{color:var(--dsw-alias-state-error-primary);align-items:center;gap:10px;display:flex}.SKV_failure p{margin:0}.SKV_failure button{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:0 0;border-radius:6px;padding:4px 10px}.SKV_catalog{flex-direction:column;gap:12px;display:flex}.SKV_catalogHeading{align-items:baseline;gap:7px;padding:0 2px;display:flex}.SKV_catalogHeading h3{font-size:13px;font-weight:600;line-height:20px;margin:0}.SKV_catalogHeading span{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:12px;line-height:18px}.SKV_searchBox{position:relative;width:100%}.SKV_searchIcon{color:var(--dsw-alias-label-tertiary);position:absolute;left:12px;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;pointer-events:none}.SKV_searchField::placeholder{color:var(--dsw-alias-label-tertiary)}.SKV_searchField:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}.SKV_searchField{box-sizing:border-box;width:100%;height:36px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:34px;outline:0;padding:0 12px 0 38px}.SKV_iconButton{box-sizing:border-box;width:28px;height:28px;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:0 0;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;padding:0;display:inline-flex;align-items:center;justify-content:center}.SKV_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}.SKV_iconButton:disabled{cursor:default;opacity:.6}.SKV_notice{border-radius:8px;align-items:center;gap:10px;padding:8px 12px;display:flex;border:1px solid transparent}.SKV_notice[data-kind=error]{border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent)}.SKV_notice[data-kind=error] .SKV_noticeText{color:var(--dsw-alias-state-error-primary)}.SKV_notice[data-kind=info]{border-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 35%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent)}.SKV_notice[data-kind=info] .SKV_noticeText{color:var(--dsw-alias-state-business-primary)}.SKV_noticeText{font-size:12px;line-height:18px;flex:1;min-width:0}.SKV_noticeButton{font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:2px 10px;font-size:12px;line-height:18px;flex:none}.SKV_noticeButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}.SKV_deleteButton[data-confirm=true]{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 50%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent)}";
// 卡片列表：卡片、状态标签、内容框、开关与删除操作
const cssCards = ".SKV_cards{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:10px;margin:0;padding:0;list-style:none;display:grid}.SKV_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;min-width:0;overflow:hidden}.SKV_card[data-open=true]{border-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-shadow-lv1)}.SKV_cardContent{width:100%;align-items:center;gap:8px;font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;padding:10px 12px;display:flex;text-align:left}.SKV_cardLeading{width:16px;height:16px;color:var(--dsw-alias-label-tertiary);flex:none;justify-content:center;align-items:center;display:inline-flex}.SKV_cardTitle{min-width:0;flex:1;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;font-size:13px;font-weight:500;line-height:20px;transition:color .2s ease}.SKV_cardTitle[data-disabled=true]{color:var(--dsw-alias-label-tertiary)}.SKV_cardTrailing{color:var(--dsw-alias-label-tertiary);flex:none;align-items:center;gap:7px;display:inline-flex}.SKV_statusDot{background:var(--dsw-alias-label-tertiary);border-radius:999px;flex:none;width:7px;height:7px;display:inline-block;transition:background-color .2s ease}.SKV_statusDot[data-enabled=true]{background:var(--dsw-alias-state-success-primary)}.SKV_configTag{background:var(--dsw-alias-bg-layer-1);min-height:20px;color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:5px;align-items:center;padding:1px 6px;font-size:11px;line-height:16px;display:inline-flex;transition:background-color .2s ease,color .2s ease}.SKV_configTag[data-enabled=true]{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent);color:var(--dsw-alias-state-success-primary)}.SKV_configTag[data-enabled=false]{color:var(--dsw-alias-label-tertiary)}.SKV_chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .15s}.SKV_card[data-open=true] .SKV_chevron{transform:rotate(180deg)}.SKV_cardDetails{border-top:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:8px;padding:10px 12px;display:flex}.SKV_meta{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;margin:0}.SKV_metaProvider{color:var(--dsw-alias-label-tertiary);margin-left:6px}.SKV_contentBox{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-markdown-code-block);border-radius:8px;max-height:213px;overflow:auto}.SKV_content{margin:0;padding:10px 12px;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Consolas,Menlo,monospace;font-size:12px;line-height:18px}.SKV_failureText{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px;margin:0}.SKV_cardActions{border-top:1px solid var(--dsw-alias-border-l2);align-items:center;gap:8px;padding-top:10px;display:flex}.SKV_switchRow{align-items:center;gap:8px;display:inline-flex}.SKV_switch{box-sizing:border-box;width:36px;height:20px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:999px;cursor:pointer;padding:0;position:relative;flex:none;transition:background-color .2s ease,border-color .2s ease}.SKV_switch:disabled{cursor:default;opacity:.6}.SKV_switch[data-on=true]{border-color:transparent;background:var(--dsw-alias-state-business-primary)}.SKV_switchThumb{box-sizing:border-box;width:14px;height:14px;border-radius:50%;background:var(--dsw-alias-label-secondary);position:absolute;top:2px;left:2px;transition:transform .22s cubic-bezier(.34,1.56,.64,1),background-color .18s ease,width .15s ease}.SKV_switch[data-on=true] .SKV_switchThumb{transform:translateX(18px);background:var(--dsw-alias-label-primary-foreground)}.SKV_switch:active:not(:disabled) .SKV_switchThumb{width:18px}.SKV_switch[data-on=true]:active:not(:disabled) .SKV_switchThumb{transform:translateX(14px)}.SKV_switchText{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.SKV_opError{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px}.SKV_deleteButton{box-sizing:border-box;height:28px;color:var(--dsw-alias-state-error-primary);font:inherit;cursor:pointer;background:0 0;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;padding:0 12px;font-size:12px;line-height:26px;margin-left:auto}.SKV_deleteButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}.SKV_deleteButton:disabled{cursor:default;opacity:.6}";
// 添加技能：按钮组与状态行
const cssAdd = ".SKV_addActions{margin-left:auto;align-items:center;gap:6px;display:inline-flex;position:relative}.SKV_addStatus{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;margin:0}.SKV_fileInput{display:none}.SKV_addTarget{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;flex:none}.SKV_dropHint{position:absolute;inset:0;z-index:5;pointer-events:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--dsw-alias-bg-layer-3) 90%, transparent);border:1px dashed var(--dsw-alias-state-business-primary);border-radius:12px;color:var(--dsw-alias-state-business-primary);font-size:13px;line-height:20px}.SKV_addMenuWrap{position:relative;display:inline-flex}.SKV_addMenu{position:absolute;right:0;top:calc(100% + 6px);z-index:30;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;box-shadow:var(--dsw-shadow-lv2);padding:10px;display:flex;flex-direction:column;gap:8px;min-width:220px}.SKV_addMenuTitle{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);margin:0}.SKV_addMenuButton{font:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary);cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:7px 10px;text-align:left;display:flex;align-items:center;gap:8px}.SKV_addMenuButton:hover{background:var(--dsw-alias-interactive-bg-hover)}";
// 作用域：横栏、迁移按钮与迁移对话框样式
const cssScope = ".SKV_scopeOverlay{position:fixed;inset:0;background:color-mix(in srgb, rgba(0,0,0,.45) 55%, transparent);align-items:center;justify-content:center;display:flex;z-index:1000}.SKV_scopeBox{background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;box-shadow:var(--dsw-shadow-lv2);width:440px;max-width:calc(100vw - 48px);max-height:80vh;flex-direction:column;padding:16px;gap:12px;display:flex}.SKV_scopeBox h4{font-size:14px;font-weight:600;line-height:20px;margin:0}.SKV_scopeOptions{flex-direction:column;gap:8px;display:flex}.SKV_scopeOption{font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 12px;font-size:13px;line-height:20px;text-align:left;display:flex;align-items:center;gap:8px}.SKV_scopeOption[data-active=true]{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 30%, transparent)}.SKV_scopeOption input{margin:0;accent-color:var(--dsw-alias-state-business-primary)}.SKV_wsPath{color:var(--dsw-alias-label-tertiary);min-width:0;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.SKV_scopeActions{align-items:center;justify-content:flex-end;gap:8px;display:flex}.SKV_scopeAction{font:inherit;cursor:pointer;border-radius:6px;padding:5px 14px;font-size:13px;line-height:20px}.SKV_scopeCancel{background:0 0;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}.SKV_scopeConfirm{background:var(--dsw-alias-state-business-primary);border:1px solid transparent;color:var(--dsw-alias-state-business-on-primary, #fff)}.SKV_scopeConfirm:disabled{opacity:.6;cursor:default}";
const cssMigrate = ".SKV_scopeBar{gap:6px;padding:2px;max-width:100%;overflow-x:auto;scrollbar-width:thin;display:flex;align-items:center}.SKV_scopeChip{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:3px 12px;font-size:12px;line-height:18px;white-space:nowrap;flex:none;display:inline-flex;align-items:center;gap:6px}.SKV_scopeChip:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_scopeChip[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary)}.SKV_scopeChipCount{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:11px;line-height:16px}.SKV_scopeChip[data-active=true] .SKV_scopeChipCount{color:var(--dsw-alias-state-business-primary)}.SKV_migrateSection{flex-direction:column;gap:6px;display:flex}.SKV_migrateLabel{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;margin:0}.SKV_migrateFromValue{color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;margin:0;word-break:break-all}.SKV_migrateList{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;max-height:220px;overflow-y:auto;margin:0;padding:4px;list-style:none;display:flex;flex-direction:column;gap:2px}.SKV_migrateItem{font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:6px;padding:6px 10px;font-size:13px;line-height:20px;text-align:left;display:flex;align-items:center;gap:8px}.SKV_migrateItem:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_migrateItem input{margin:0;accent-color:var(--dsw-alias-state-business-primary)}.SKV_migrateItemName{flex:1;min-width:0;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.SKV_migrateItemState{color:var(--dsw-alias-label-tertiary);font-size:11px;flex:none}.SKV_migrateSelectAll{font:inherit;color:var(--dsw-alias-state-business-primary);cursor:pointer;background:0 0;border:none;padding:0;font-size:12px;line-height:18px}.SKV_migrateHint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;margin:0}.SKV_migrateResult{border-radius:8px;padding:8px 12px;font-size:12px;line-height:18px;margin:0}.SKV_migrateResult[data-ok=true]{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent);color:var(--dsw-alias-state-success-primary)}.SKV_migrateResult[data-ok=false]{background:color-mix(in srgb, var(--dsw-alias-state-warning-primary) 10%, transparent);color:var(--dsw-alias-state-warning-primary)}.SKV_migrateResultList{margin:4px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px;max-height:120px;overflow-y:auto}.SKV_scopeChip{max-width:320px}.SKV_scopeChipLabel{max-width:220px;min-width:0;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:inline-block}.SKV_wsPath{min-width:0;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block}.SKV_migrateOptionLabel{min-width:0;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.SKV_scopeOptions{max-height:132px;overflow-y:auto;scrollbar-width:thin}.SKV_migrateList{max-height:148px}.SKV_scopeBox{overflow-y:auto;scrollbar-width:thin}.SKV_select{width:100%;box-sizing:border-box;height:32px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:0 8px}.SKV_select:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent);outline:none}.SKV_groupBody{display:flex;gap:16px;min-height:0}.SKV_groupSide{width:150px;flex:none;display:flex;flex-direction:column;gap:2px;min-width:0}.SKV_groupNewBtn{display:flex;align-items:center;gap:6px;justify-content:flex-start;font:inherit;font-size:13px;color:var(--dsw-alias-state-business-primary);cursor:pointer;background:0 0;border:1px dashed var(--dsw-alias-border-l1);border-radius:8px;padding:7px 10px;margin-bottom:6px;text-align:left}.SKV_groupNewBtn:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_groupSideLabel{font-size:12px;color:var(--dsw-alias-label-tertiary);padding:0 10px;margin-bottom:2px}.SKV_groupSideItem{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;font:inherit;font-size:13px;cursor:pointer;color:var(--dsw-alias-label-secondary);background:0 0;border:none;text-align:left;min-width:0}.SKV_groupSideItem:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_groupSideItem[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);color:var(--dsw-alias-state-business-primary);font-weight:500}.SKV_groupMain{flex:1;min-width:0;display:flex;flex-direction:column;gap:12px}.SKV_field{display:flex;flex-direction:column;gap:6px}.SKV_fieldLabel{font-size:12px;color:var(--dsw-alias-label-secondary);margin:0}.SKV_skillListBox{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:0 10px;max-height:220px;overflow-y:auto}.SKV_skillRow{display:flex;align-items:center;gap:10px;padding:8px 4px;border-bottom:0.5px solid var(--dsw-alias-border-l2);font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;min-width:0}.SKV_skillRow:last-child{border-bottom:none}.SKV_skillRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_skillRow input{margin:0;accent-color:var(--dsw-alias-state-business-primary);flex:none}.SKV_skillName{flex:1;min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.SKV_skillBadge{font-size:12px;padding:2px 8px;border-radius:5px;white-space:nowrap;flex:none}.SKV_skillBadge[data-on=true]{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent);color:var(--dsw-alias-state-success-primary)}.SKV_skillBadge[data-on=false]{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-tertiary)}.SKV_countRow{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}.SKV_countText{font-size:12px;color:var(--dsw-alias-label-secondary);margin:0}.SKV_dialogFooter{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:0.5px solid var(--dsw-alias-border-l2)}.SKV_dangerBtn{font:inherit;font-size:13px;color:var(--dsw-alias-state-error-primary);cursor:pointer;background:0 0;border:1px solid transparent;border-radius:6px;padding:5px 10px}.SKV_dangerBtn:hover:not(:disabled){background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent)}.SKV_dangerBtn:disabled{cursor:default;opacity:.6}.SKV_textInput{width:100%;box-sizing:border-box;height:32px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;padding:0 10px}.SKV_textInput::placeholder{color:var(--dsw-alias-label-tertiary)}.SKV_textInput:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}.SKV_scopeBox{width:640px}.SKV_groupSide{width:170px}.SKV_groupSideItem{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.SKV_select{appearance:none;-webkit-appearance:none;width:100%;box-sizing:border-box;height:32px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background-color:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:0 30px 0 10px;background-image:url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 16 16%27 fill=%27none%27%3E%3Cpath d=%27M4 6l4 4 4-4%27 stroke=%27%23888%27 stroke-width=%271.6%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 10px center}.SKV_select:hover{border-color:var(--dsw-alias-border-l1)}.SKV_targetBox{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:4px;max-height:152px;overflow-y:auto;scrollbar-width:thin}.SKV_targetItem{display:flex;align-items:center;gap:8px;padding:7px 6px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-bottom:0.5px solid var(--dsw-alias-border-l2);width:100%;text-align:left;min-width:0}.SKV_targetItem:last-child{border-bottom:none}.SKV_targetItem:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_targetItem[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent)}.SKV_targetItem input{margin:0;accent-color:var(--dsw-alias-state-business-primary);flex:none}.SKV_skillListBox{max-height:180px};.SKV_groupBar{gap:6px;padding:2px;max-width:100%;overflow-x:auto;scrollbar-width:thin;display:flex;align-items:center}.SKV_groupItem{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:3px 11px;font-size:12px;line-height:18px;white-space:nowrap;flex:none}.SKV_groupItem:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l1)}.SKV_groupItem[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary);font-weight:500}.SKV_groupSep{display:none}";
const cssCategory = ".SKV_categoryBar{display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap}.SKV_categoryLabel{font-size:12px;color:var(--dsw-alias-label-tertiary);flex:none;margin-right:2px}.SKV_categoryChip{font:inherit;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:2px 10px;white-space:nowrap;flex:none}.SKV_categoryChip:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_categoryChip[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);border-color:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-state-business-primary)}";
const cssTree = ".SKV_treeFolder{grid-column:1/-1;display:flex;flex-direction:column;gap:10px}.SKV_treeFolderHeader{display:flex;align-items:center;gap:6px;width:100%;font:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:7px 10px;text-align:left}.SKV_treeFolderHeader:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_treeFolderName{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.SKV_treeFolderCount{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:12px;line-height:18px;flex:none}.SKV_treeChevron{transition:transform .15s;transform:rotate(-90deg)}.SKV_treeChevronOpen{transition:transform .15s;transform:rotate(0deg)}";
const cssEffects = "@keyframes skvFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}@keyframes skvFadeOnly{from{opacity:0}to{opacity:1}}@keyframes skvPopIn{from{opacity:0;transform:translateY(-4px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes skvPulse{0%,100%{opacity:.55}50%{opacity:1}}.SKV_status{animation:skvPulse 1.6s ease-in-out infinite}.SKV_card{transition:border-color .18s cubic-bezier(.22,.61,.36,1),box-shadow .18s cubic-bezier(.22,.61,.36,1)}.SKV_card:hover{border-color:var(--dsw-alias-border-l1)}.SKV_cardContent{transition:background-color .15s ease}.SKV_cardContent:hover{background:var(--dsw-alias-interactive-bg-hover)}.SKV_cardContent:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}.SKV_cardDetails{animation:skvFadeIn .18s cubic-bezier(.22,.61,.36,1)}.SKV_cards{animation:skvFadeOnly .2s ease}.SKV_addMenu{animation:skvPopIn .15s cubic-bezier(.22,.61,.36,1)}.SKV_dropHint{animation:skvFadeOnly .15s ease}.SKV_scopeOverlay{animation:skvFadeOnly .15s ease}.SKV_scopeBox{animation:skvPopIn .18s cubic-bezier(.22,.61,.36,1)}.SKV_searchField,.SKV_textInput,.SKV_select{transition:border-color .15s ease,box-shadow .15s ease}.SKV_scopeChip,.SKV_categoryChip,.SKV_migrateItem,.SKV_targetItem,.SKV_scopeOption{transition:background-color .15s ease,border-color .15s ease,color .15s ease}.SKV_iconButton,.SKV_addMenuButton,.SKV_deleteButton,.SKV_noticeButton,.SKV_scopeAction,.SKV_dangerBtn,.SKV_groupNewBtn,.SKV_migrateSelectAll{transition:background-color .15s ease,border-color .15s ease,transform .1s ease}.SKV_iconButton:active:not(:disabled),.SKV_deleteButton:active:not(:disabled),.SKV_scopeAction:active,.SKV_addMenuButton:active,.SKV_dangerBtn:active:not(:disabled),.SKV_groupNewBtn:active{transform:scale(.96)}.SKV_iconButton:focus-visible,.SKV_deleteButton:focus-visible,.SKV_scopeAction:focus-visible,.SKV_switch:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}.SKV_fieldLabel,.SKV_groupSideLabel,.SKV_migrateLabel,.SKV_categoryLabel{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary)}.SKV_scopeBox{padding:20px;gap:14px}.SKV_groupSide{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:8px;box-sizing:border-box}.SKV_groupNewBtn{align-items:center;gap:6px}.SKV_groupNewBtn svg{flex:none}.SKV_groupDelete{align-items:center;justify-content:center}.SKV_migrateResult{display:flex;align-items:center;gap:7px}.SKV_migrateResult svg{flex:none}.SKV_dialogFooter{gap:12px}@media (prefers-reduced-motion: reduce){.SKV_section *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}";
const cssChipRefresh = ".SKV_scopeBar{gap:4px;padding:2px 2px 6px}.SKV_scopeChip{background:transparent;border:1px solid transparent;border-radius:8px;padding:7px 14px;font-size:13px;line-height:20px;gap:7px}.SKV_scopeChip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.SKV_scopeChip[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);border-color:transparent;font-weight:500}.SKV_scopeChipCount{font-size:11px;opacity:.7}.SKV_groupBar{gap:4px;padding:2px}.SKV_groupItem{background:transparent;border:1px solid transparent;border-radius:8px;padding:7px 14px;font-size:13px;line-height:20px}.SKV_groupItem:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:transparent;color:var(--dsw-alias-label-primary)}.SKV_groupItem[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);border-color:transparent;font-weight:500}.SKV_categoryBar{gap:6px 8px}.SKV_categoryChip{background:transparent;border:1px solid transparent;border-radius:7px;padding:5px 12px;font-size:12px}.SKV_categoryChip:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:transparent}.SKV_categoryChip[data-active=true]{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);border-color:transparent;font-weight:500}";
// Workbench 页面外壳：整页滚动 + 居中限宽（子元素各自保留自己的 max-width 语义）。
const cssWorkbench = ".SKV_wbPage{box-sizing:border-box;width:100%;min-height:100%;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;padding:24px 20px 56px}.SKV_wbPage>*{width:100%;max-width:860px;min-width:0}";
const css = cssChrome + cssCards + cssAdd + cssScope + cssMigrate + cssCategory + cssTree + cssEffects + cssChipRefresh + cssWorkbench;
const tagId = "dsh-better-workbench-skill-mcp-panels/SkillsSection.module.css";
if (typeof document !== "undefined") {
	let tag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") as HTMLElement | null;
	if (tag === null) {
		tag = document.createElement("style");
		tag.dataset.plugin = "dsh-better-workbench-skill-mcp-panels";
		tag.dataset.pluginCss = tagId;
		document.head.appendChild(tag);
	}
	// 始终用当前版本的样式覆盖，避免残留旧样式标签
	tag.textContent = css;
}

// 类名映射（CSS 是内联手写字符串，无法走 CSS Modules）
const c = {
	section: "SKV_section",
	status: "SKV_status",
	failure: "SKV_failure",
	catalog: "SKV_catalog",
	searchBox: "SKV_searchBox",
	searchIcon: "SKV_searchIcon",
	searchField: "SKV_searchField",
	catalogHeading: "SKV_catalogHeading",
	cards: "SKV_cards",
	card: "SKV_card",
	cardContent: "SKV_cardContent",
	cardLeading: "SKV_cardLeading",
	cardTitle: "SKV_cardTitle",
	cardTrailing: "SKV_cardTrailing",
	statusDot: "SKV_statusDot",
	configTag: "SKV_configTag",
	chevron: "SKV_chevron",
	cardDetails: "SKV_cardDetails",
	meta: "SKV_meta",
	metaProvider: "SKV_metaProvider",
	contentBox: "SKV_contentBox",
	content: "SKV_content",
	failureText: "SKV_failureText",
	cardActions: "SKV_cardActions",
	switchRow: "SKV_switchRow",
	switch: "SKV_switch",
	switchThumb: "SKV_switchThumb",
	switchText: "SKV_switchText",
	opError: "SKV_opError",
	deleteButton: "SKV_deleteButton",
	addActions: "SKV_addActions",
	iconButton: "SKV_iconButton",
	addStatus: "SKV_addStatus",
	addTarget: "SKV_addTarget",
	dropHint: "SKV_dropHint",
	notice: "SKV_notice",
	noticeText: "SKV_noticeText",
	noticeButton: "SKV_noticeButton",
	fileInput: "SKV_fileInput",
                     addMenuWrap: "SKV_addMenuWrap",
                     addMenu: "SKV_addMenu",
                     addMenuTitle: "SKV_addMenuTitle",
                     addMenuButton: "SKV_addMenuButton",
	
	scopeOverlay: "SKV_scopeOverlay",
	scopeBox: "SKV_scopeBox",
	scopeOptions: "SKV_scopeOptions",
	scopeOption: "SKV_scopeOption",
	wsPath: "SKV_wsPath",
	scopeActions: "SKV_scopeActions",
	scopeAction: "SKV_scopeAction",
	scopeCancel: "SKV_scopeCancel",
	scopeConfirm: "SKV_scopeConfirm",
	scopeBar: "SKV_scopeBar",
	scopeChip: "SKV_scopeChip",
	scopeChipCount: "SKV_scopeChipCount",
	treeFolder: "SKV_treeFolder",
	treeFolderHeader: "SKV_treeFolderHeader",
	treeFolderName: "SKV_treeFolderName",
	treeFolderCount: "SKV_treeFolderCount",
	treeChevron: "SKV_treeChevron",
	treeChevronOpen: "SKV_treeChevronOpen",
	categoryBar: "SKV_categoryBar",
	categoryLabel: "SKV_categoryLabel",
	categoryChip: "SKV_categoryChip",
	select: "SKV_select",
	
	field: "SKV_field",
	fieldLabel: "SKV_fieldLabel",
	skillListBox: "SKV_skillListBox",
	skillRow: "SKV_skillRow",
	skillName: "SKV_skillName",
	skillBadge: "SKV_skillBadge",
	countRow: "SKV_countRow",
	countText: "SKV_countText",
	dialogFooter: "SKV_dialogFooter",
	dangerBtn: "SKV_dangerBtn",
	textInput: "SKV_textInput",
	targetBox: "SKV_targetBox",
	targetItem: "SKV_targetItem",
	migrateSection: "SKV_migrateSection",
	migrateLabel: "SKV_migrateLabel",
	migrateFromValue: "SKV_migrateFromValue",
	migrateList: "SKV_migrateList",
	migrateItem: "SKV_migrateItem",
	migrateItemName: "SKV_migrateItemName",
	migrateItemState: "SKV_migrateItemState",
	migrateSelectAll: "SKV_migrateSelectAll",
	migrateHint: "SKV_migrateHint",
	migrateResult: "SKV_migrateResult",
	migrateResultList: "SKV_migrateResultList",
	scopeChipLabel: "SKV_scopeChipLabel",
	migrateOptionLabel: "SKV_migrateOptionLabel"
};

// ── 文案字典 ─────────────────────────────────────────────────────────
export const NS = "settings.skills";

const zh = {
	nav: "技能",
	wbSubtitle: "管理全局与各工作区里的技能：启停、增删、分组与批量迁移。",
	loading: "正在读取技能…",
	error: "暂时无法读取技能。",
	retry: "重试",
	search: "搜索技能",
	catalog: "技能列表",
	empty: "暂无技能。",
	emptySearch: "没有匹配的技能。",
	noSession: "打开一个会话后即可查看该会话的技能。",
	contentLoading: "正在加载技能内容…",
	contentError: "技能内容加载失败。",
	contentMissing: "技能内容不可用。",
	providerLabel: "来源",
	enabledTag: "已启用",
	disabledTag: "已停用",
	switchEnable: "启用",
	switchDisable: "停用",
	deleteLabel: "删除",
	confirmDelete: "确认删除？",
	opFailed: "操作失败",
	addButton: "添加技能",
	addTarget: "添加到：",
	addSingle: "添加单文件",
	addFolderZip: "添加文件夹/zip",
	addDragHint: "松开以添加技能（支持 .md、.zip 与技能文件夹）",
	addDismiss: "知道了",
	addBusy: "正在添加技能…",
	addTooMany: "所选内容文件数量过多。",
	addNoSkillFile: "所选内容不是有效的技能目录：缺少顶层的 SKILL.md 文件。",
	scopeGlobal: "全局",
	emptyScope: "该工作区下暂无技能。",
	migrateButton: "批量迁移",
	migrateTitle: "批量迁移技能",
	migrateFrom: "源工作区",
	migrateTo: "目标工作区（可多选）",
	migrateMode: "方式",
	migrateModeCopy: "复制（保留原技能）",
	migrateModeMove: "移动（删除原技能）",
	migrateSelectAll: "全选",
	migrateNoSkills: "该工作区下没有可迁移的技能。",
	migratePickSource: "请选择源工作区",
	migratePickTarget: "请至少选择一个目标工作区",
	migrateSameScope: "目标工作区不能与源工作区相同",
	migrateMoveSingle: "移动模式只能选择一个目标工作区（多目标请改用复制）",
	migratePickSkills: "请至少选择一个技能",
	migrateConfirm: "开始迁移",
	migrateBusy: "正在迁移…",
	migrateCancel: "取消",
	migrateDoneOk: "迁移完成：成功 ",
	migrateDoneFail: "，失败 ",
	migrateDoneSuffix: "",
	migrateErrors: "失败明细",
	migrateSourceLabel: "源作用域",
	migrateTargetLabel: "目标作用域",
	migrateClose: "关闭",
	skillFilterPlaceholder: "筛选技能",
	skillCountLabel: "已选",
	selectNone: "取消全选",
	categoryQuickAdd: "按分类快速添加",
	categoryQuickAddHint: "点击按顶层目录批量勾选/取消",
	checkUpdateAvailable: "发现新版本 v",
	checkUpdateCurrent: "（当前 v",
	checkUpdateHint: "）。可在终端运行 dsh-panel update 更新"
};

const en = {
	nav: "Skills",
	wbSubtitle: "Manage skills across the global root and every workspace: enable, add, remove, group and migrate.",
	loading: "Reading skills…",
	error: "Skills are temporarily unavailable.",
	retry: "Retry",
	search: "Search skills",
	catalog: "Skills",
	empty: "No skills are available.",
	emptySearch: "No matching skills.",
	noSession: "Open a session to view its skills.",
	contentLoading: "Loading skill content…",
	contentError: "Skill content failed to load.",
	contentMissing: "Skill content is unavailable.",
	providerLabel: "Provider",
	enabledTag: "Enabled",
	disabledTag: "Disabled",
	switchEnable: "Enable",
	switchDisable: "Disable",
	deleteLabel: "Delete",
	confirmDelete: "Confirm delete?",
	opFailed: "Operation failed",
	addButton: "Add skill",
	addTarget: "Add to: ",
	addSingle: "Add files",
	addFolderZip: "Add folder/ZIP",
	addDragHint: "Drop to add skills (.md, .zip or skill folders)",
	addDismiss: "Dismiss",
	addBusy: "Adding skill…",
	addTooMany: "Too many files in the selection.",
	addNoSkillFile: "Not a valid skill source: missing a top-level SKILL.md file.",
	scopeGlobal: "Global",
	emptyScope: "No skills in this workspace yet.",
	migrateButton: "Batch migrate",
	migrateTitle: "Batch migrate skills",
	migrateFrom: "From workspace",
	migrateTo: "To workspaces (multiple allowed)",
	migrateMode: "Mode",
	migrateModeCopy: "Copy (keep the original)",
	migrateModeMove: "Move (delete the original)",
	migrateSelectAll: "Select all",
	migrateNoSkills: "No skills to migrate in this workspace.",
	migratePickSource: "Pick a source workspace",
	migratePickTarget: "Pick at least one target workspace",
	migrateSameScope: "A target workspace must differ from the source",
	migrateMoveSingle: "Move mode allows exactly one target workspace (use Copy for several)",
	migratePickSkills: "Pick at least one skill",
	migrateConfirm: "Start migration",
	migrateBusy: "Migrating…",
	migrateCancel: "Cancel",
	migrateDoneOk: "Migration finished: ",
	migrateDoneFail: " succeeded, ",
	migrateDoneSuffix: " failed",
	migrateErrors: "Failed items",
	migrateSourceLabel: "From",
	migrateTargetLabel: "To",
	migrateClose: "Close",
	skillFilterPlaceholder: "Filter skills",
	skillCountLabel: "Selected",
	categoryQuickAdd: "Quick add by category",
	categoryQuickAddHint: "Click to select/deselect all skills in a category",
	selectNone: "Select none",
	checkUpdateAvailable: "Update available: v",
	checkUpdateCurrent: " (current v",
	checkUpdateHint: "). Run dsh-panel update in a terminal to install it"
};

// ── 远程贡献 ─────────────────────────────────────────────────────────
// 客户端生成 Remote 只要求 codec.mode === "strict" 且调用 schema.parse()；
// schema 用 parse 直通即可（严格校验由服务端 manifest 承担，无需 zod 依赖）。
const identity = (value) => value;
const codec = (symbol) => ({ mode: "strict", typeSymbol: symbol, schema: { parse: identity } });

const CONTRIBUTION = {
	package: "dsh-skill-mcp-panel",
	descriptors: [
		{
			id: "dsh-skill-mcp-panel#skillsViewer/list",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "list",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "sessionId", wire: "sessionId", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#sessionId") }
			],
			result: codec("dsh-skill-mcp-panel#SkillListResult")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/workspaces",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "workspaces",
			invocation: { kind: "direct" },
			parameters: [],
			result: codec("dsh-skill-mcp-panel#WorkspacesResult")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/checkUpdate",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "checkUpdate",
			invocation: { kind: "direct" },
			parameters: [],
			result: codec("dsh-skill-mcp-panel#CheckUpdateResult")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/migrate",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "migrate",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "name", wire: "name", source: "json", codec: codec("dsh-skill-mcp-panel#SkillName") },
				{ name: "sessionId", wire: "sessionId", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#sessionId") },
				{ name: "payload", wire: "payload", source: "json", codec: codec("dsh-skill-mcp-panel#MigratePayload") }
			],
			result: codec("dsh-skill-mcp-panel#MigrateResult")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/batchMigrate",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "batchMigrate",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "sessionId", wire: "sessionId", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#sessionId") },
				{ name: "payload", wire: "payload", source: "json", codec: codec("dsh-skill-mcp-panel#BatchMigratePayload") }
			],
			result: codec("dsh-skill-mcp-panel#BatchMigrateResult")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/content",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "content",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "name", wire: "name", source: "json", codec: codec("dsh-skill-mcp-panel#SkillName") },
				{ name: "sessionId", wire: "sessionId", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#sessionId") },
				{ name: "scope", wire: "scope", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#SkillScope") }
			],
			result: codec("dsh-skill-mcp-panel#SkillContent")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/setEnabled",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "setEnabled",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "name", wire: "name", source: "json", codec: codec("dsh-skill-mcp-panel#SkillName") },
				{ name: "sessionId", wire: "sessionId", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#sessionId") },
				{ name: "enabled", wire: "enabled", source: "json", codec: codec("dsh-skill-mcp-panel#EnabledFlag") },
				{ name: "scope", wire: "scope", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#SkillScope") }
			],
			result: codec("dsh-skill-mcp-panel#SetEnabledResult")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/deleteSkill",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "deleteSkill",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "name", wire: "name", source: "json", codec: codec("dsh-skill-mcp-panel#SkillName") },
				{ name: "sessionId", wire: "sessionId", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#sessionId") },
				{ name: "scope", wire: "scope", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#SkillScope") }
			],
			result: codec("dsh-skill-mcp-panel#DeleteSkillResult")
		},
		{
			id: "dsh-skill-mcp-panel#skillsViewer/addSkill",
			service: "skillsViewer",
			namespace: "skillsViewer",
			method: "addSkill",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "sessionId", wire: "sessionId", source: "json", acceptsUndefined: true, codec: codec("dsh-skill-mcp-panel#sessionId") },
				{ name: "payload", wire: "payload", source: "json", codec: codec("dsh-skill-mcp-panel#AddPayload") }
			],
			result: codec("dsh-skill-mcp-panel#AddResult")
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/list",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "list",
			invocation: { kind: "direct" },
			parameters: [],
			result: codec("dsh-skill-mcp-panel#McpListResult")
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/save",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "save",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "payload", wire: "payload", source: "json", codec: codec("dsh-skill-mcp-panel#McpSavePayload") }
			],
			result: codec("dsh-skill-mcp-panel#McpSaveResult")
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/removeServer",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "removeServer",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "payload", wire: "payload", source: "json", codec: codec("dsh-skill-mcp-panel#McpRemovePayload") }
			],
			result: codec("dsh-skill-mcp-panel#McpRemoveResult")
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/setEnabled",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "setEnabled",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "payload", wire: "payload", source: "json", codec: codec("dsh-skill-mcp-panel#McpSetEnabledPayload") }
			],
			result: codec("dsh-skill-mcp-panel#McpSaveResult")
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/test",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "test",
			invocation: { kind: "direct" },
			parameters: [
				{ name: "payload", wire: "payload", source: "json", codec: codec("dsh-skill-mcp-panel#McpTestPayload") }
			],
			result: codec("dsh-skill-mcp-panel#McpTestResult")
		},
		{
			id: "dsh-skill-mcp-panel#mcpManager/reload",
			service: "mcpManager",
			namespace: "mcpManager",
			method: "reload",
			invocation: { kind: "direct" },
			parameters: [],
			result: codec("dsh-skill-mcp-panel#McpListResult")
		}
	]
};

// ── 批量迁移对话框（源/目标均为下拉表单，目标可多选）───────────────────
function MigrateDialog({ t, options, from, setFrom, targets, toggleTarget, mode, setMode, skills, selected, toggle, selectAll, busy, result, error, onConfirm, onCancel, onClose }) {
	const known = Array.isArray(options) ? options : [];
	const [query, setQuery] = react.useState("");
	const q = query.trim().toLowerCase();
	const visible = skills.filter((skill) => skill.name.toLowerCase().includes(q));
	const allChecked = skills.length > 0 && selected.size === skills.length;
	const okCount = Array.isArray(result) ? result.filter((item) => item.ok === true).length : 0;
	const failCount = Array.isArray(result) ? result.length - okCount : 0;
	const targetLabelOf = (value) => {
		if (value === null || value === undefined || value === "global") return t("scopeGlobal");
		const hit = known.find((option) => option.path === value);
		return hit !== undefined && typeof hit.label === "string" && hit.label !== "" ? hit.label : value;
	};
	return (0, react_jsx_runtime.jsx)("div", {
		className: c.scopeOverlay,
		role: "dialog",
		"aria-modal": "true",
		children: (0, react_jsx_runtime.jsxs)("div", {
			className: c.scopeBox,
			children: [(0, react_jsx_runtime.jsx)("h4", { children: t("migrateTitle") }), (0, react_jsx_runtime.jsxs)("div", {
				className: c.field,
				children: [(0, react_jsx_runtime.jsx)("label", {
					className: c.fieldLabel,
					children: t("migrateFrom")
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: c.targetBox,
					children: [(0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: c.targetItem,
						"data-active": from === "global" ? "true" : void 0,
						onClick: () => { setFrom("global"); },
						children: [(0, react_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "migrate-from",
							checked: from === "global",
							readOnly: true
						}), (0, react_jsx_runtime.jsx)("span", {
							className: c.skillName,
							children: t("scopeGlobal")
						})]
					}, "from-global"), ...known.map((option) => (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: c.targetItem,
						"data-active": from === option.path ? "true" : void 0,
						onClick: () => { setFrom(option.path); },
						children: [(0, react_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "migrate-from",
							checked: from === option.path,
							readOnly: true
						}), (0, react_jsx_runtime.jsx)("span", {
							className: c.migrateOptionLabel,
							children: option.label
						}), (0, react_jsx_runtime.jsx)("span", {
							className: c.wsPath,
							title: option.path,
							children: option.path
						})]
					}, option.path))]
				}), from === "" ? (0, react_jsx_runtime.jsx)("p", {
					className: c.migrateHint,
					children: t("migratePickSource")
				}) : null]
			}), 
(0, react_jsx_runtime.jsxs)("div", {
				className: c.field,
				children: [(0, react_jsx_runtime.jsx)("label", {
					className: c.fieldLabel,
					children: t("migrateTo")
				}), (0, react_jsx_runtime.jsxs)("div", {
				className: c.targetBox,
				children: [(0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: c.targetItem,
					"data-active": targets.has("global") ? "true" : void 0,
					onClick: () => {
						toggleTarget("global");
					},
					children: [(0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: targets.has("global"),
						readOnly: true
					}), (0, react_jsx_runtime.jsx)("span", {
						className: c.skillName,
						children: t("scopeGlobal")
					})]
				}), ...known.map((option) => (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: c.targetItem,
					"data-active": targets.has(option.path) ? "true" : void 0,
					onClick: () => {
						toggleTarget(option.path);
					},
					children: [(0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: targets.has(option.path),
						readOnly: true
					}), (0, react_jsx_runtime.jsx)("span", {
						className: c.migrateOptionLabel,
						children: option.label
					}), (0, react_jsx_runtime.jsx)("span", {
						className: c.wsPath,
						title: option.path,
						children: option.path
					})]
				}, option.path))]
			})]
			}), mode === "move" && targets.size > 1 ? (0, react_jsx_runtime.jsx)("p", {
				className: c.migrateHint,
				children: t("migrateMoveSingle")
			}) : null, (0, react_jsx_runtime.jsxs)("div", {
				className: c.field,
				children: [(0, react_jsx_runtime.jsx)("p", {
					className: c.fieldLabel,
					children: t("migrateMode")
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: c.scopeOptions,
					children: [(0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: c.scopeOption,
						"data-active": mode === "move" ? "true" : void 0,
						onClick: () => {
							setMode("move");
						},
						children: [(0, react_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "migrate-mode",
							checked: mode === "move",
							readOnly: true
						}), (0, react_jsx_runtime.jsx)("span", { children: t("migrateModeMove") })]
					}), (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: c.scopeOption,
						"data-active": mode === "copy" ? "true" : void 0,
						onClick: () => {
							setMode("copy");
						},
						children: [(0, react_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "migrate-mode",
							checked: mode === "copy",
							readOnly: true
						}), (0, react_jsx_runtime.jsx)("span", { children: t("migrateModeCopy") })]
					})]
				})]
			}), from === "" ? null : result === null ? (0, react_jsx_runtime.jsxs)("div", {
				className: c.field,
				children: [(0, react_jsx_runtime.jsxs)("div", {
					className: c.countRow,
					children: [(0, react_jsx_runtime.jsx)("p", {
						className: c.countText,
						children: t("skillCountLabel") + " " + selected.size + "/" + skills.length
					}), (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: c.migrateSelectAll,
						onClick: selectAll,
						children: allChecked ? t("selectNone") : t("migrateSelectAll")
					})]
				}),
				(0, react_jsx_runtime.jsx)("input", {
					className: c.textInput,
					type: "text",
					value: query,
					placeholder: t("skillFilterPlaceholder"),
					onChange: (event) => {
						setQuery(event.currentTarget.value);
					}
				}), (0, react_jsx_runtime.jsxs)("div", {
					className: c.skillListBox,
					children: skills.length === 0 ? [(0, react_jsx_runtime.jsx)("p", {
						className: c.migrateHint,
						children: t("migrateNoSkills")
					}, "no-skills")] : visible.length === 0 ? [(0, react_jsx_runtime.jsx)("p", {
						className: c.migrateHint,
						children: t("emptySearch")
					}, "no-match")] : visible.map((skill) => (0, react_jsx_runtime.jsxs)("label", {
						className: c.skillRow,
						children: [(0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: selected.has(skill.name),
							onChange: () => {
								toggle(skill.name);
							}
						}), (0, react_jsx_runtime.jsx)("span", {
							className: c.skillName,
							children: skill.name
						}), (0, react_jsx_runtime.jsx)("span", {
							className: c.skillBadge,
							"data-on": skill.enabled !== false ? "true" : "false",
							children: skill.enabled !== false ? t("enabledTag") : t("disabledTag")
						})]
					}, skill.name))
				})]
			}) : null, error !== null && error !== undefined ? (0, react_jsx_runtime.jsx)("p", {
				className: c.migrateHint,
				role: "alert",
				children: error
			}) : null, result !== null ? (0, react_jsx_runtime.jsxs)("div", {
				className: c.migrateSection,
				children: [(0, react_jsx_runtime.jsxs)("p", {
					className: c.migrateResult,
					"data-ok": failCount === 0 ? "true" : "false",
					children: [failCount === 0 ? (0, react_jsx_runtime.jsxs)("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 16 16",
						fill: "none",
						"aria-hidden": "true",
						children: [(0, react_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "6.5", stroke: "currentColor", strokeWidth: 1.3 }), (0, react_jsx_runtime.jsx)("path", { d: "M5.5 8.2l1.8 1.8 3.2-4", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" })]
					}) : (0, react_jsx_runtime.jsxs)("svg", {
						width: "13",
						height: "13",
						viewBox: "0 0 16 16",
						fill: "none",
						"aria-hidden": "true",
						children: [(0, react_jsx_runtime.jsx)("path", { d: "M8 2.5l6.5 11.2h-13z", stroke: "currentColor", strokeWidth: 1.3, strokeLinejoin: "round" }), (0, react_jsx_runtime.jsx)("path", { d: "M8 6.5v3.2", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" }), (0, react_jsx_runtime.jsx)("circle", { cx: "8", cy: "11.6", r: "0.6", fill: "currentColor" })]
					}), t("migrateDoneOk") + okCount + t("migrateDoneFail") + failCount + t("migrateDoneSuffix")]
				}), failCount > 0 ? (0, react_jsx_runtime.jsxs)("div", {
					children: [(0, react_jsx_runtime.jsx)("p", { className: c.migrateLabel, children: t("migrateErrors") }), (0, react_jsx_runtime.jsxs)("ul", {
						className: c.migrateResultList,
						children: result.filter((item) => item.ok !== true).map((item) => (0, react_jsx_runtime.jsx)("li", {
							key: item.name + "-" + (item.target ?? ""),
							children: item.name + (item.target === null || item.target === undefined ? "" : " → " + targetLabelOf(item.target)) + "：" + (item.error ?? "")
						}, item.name + "-" + (item.target ?? "")))
					})]
				}) : null]
			}) : null, (0, react_jsx_runtime.jsxs)("div", {
				className: c.dialogFooter,
				children: [(0, react_jsx_runtime.jsx)("span", {}), (0, react_jsx_runtime.jsxs)("div", {
					className: c.scopeActions,
					children: result === null ? [(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: c.scopeAction + " " + c.scopeCancel,
						disabled: busy,
						onClick: onCancel,
						children: t("migrateCancel")
					}), (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: c.scopeAction + " " + c.scopeConfirm,
						disabled: busy || from === "" || targets.size === 0 || selected.size === 0 || targets.has(from) || (mode === "move" && targets.size > 1),
						onClick: onConfirm,
						children: busy ? t("migrateBusy") : t("migrateConfirm")
					})] : [(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: c.scopeAction + " " + c.scopeConfirm,
						onClick: onClose,
						children: t("migrateClose")
					})]
				})]
			})]
		})
	});
}

function SkillsSection(props) {
	const { t, currentSessionId, listSkills, loadContent, setSkillEnabled, removeSkill, addSkill, listWorkspaces, batchMigrateSkill, checkUpdateRemote } = props;
	const [query, setQuery] = react.useState("");
	const [listState, setListState] = react.useState({ status: "loading" });
	const [request, setRequest] = react.useState(0);
	const [expanded, setExpanded] = react.useState(null);
	// 树形折叠状态（默认全部展开；路径为 key）。
	const [collapsed, setCollapsed] = react.useState(() => new Set());
	const toggleCollapsed = (path) => {
		setCollapsed((prev) => {
			const next = new Set(prev);
			if (next.has(path)) next.delete(path);
			else next.add(path);
			return next;
		});
	};
	const [bodies, setBodies] = react.useState({});
	const [ops, setOps] = react.useState({});
	const [adding, setAdding] = react.useState({ status: "idle" });
	const [dragActive, setDragActive] = react.useState(false);
	const [wsOptions, setWsOptions] = react.useState(null);
	const [scopeFilter, setScopeFilter] = react.useState("global");
	const [migrator, setMigrator] = react.useState(null);
	const [updateBanner, setUpdateBanner] = react.useState(null);
	const [confirmKey, setConfirmKey] = react.useState(null);
	const [addMenuOpen, setAddMenuOpen] = react.useState(false);
	const inflight = react.useRef(new Set());
	const singleFileInput = react.useRef(null);
	const zipFileInput = react.useRef(null);

	// 列表拉取：首次显示加载态；此后静默刷新，保留旧列表避免闪烁。
	// 合并结果按名称排序——启停切换不会改变卡片位置。
	react.useEffect(() => {
		let current = true;
		setListState((prev) => (prev.status === "ready" ? prev : { status: "loading" }));
		Promise.resolve().then(() => listSkills()).then((snapshot) => {
			if (!current) return;
			const skills = snapshot !== null && typeof snapshot === "object" && Array.isArray(snapshot.skills) ? [...snapshot.skills].sort((a, b) => a.name.localeCompare(b.name)) : [];
			setListState({ status: "ready", skills });
		}, () => {
			if (current) setListState({ status: "error" });
		});
		return () => {
			current = false;
		};
	}, [listSkills, request]);
	// 工作区列表：加载一次，供作用域横栏与迁移/添加对话框使用。
	react.useEffect(() => {
		let current = true;
		Promise.resolve().then(() => listWorkspaces()).then((wsSnapshot) => {
			if (!current) return;
			setWsOptions(wsSnapshot !== null && typeof wsSnapshot === "object" && Array.isArray(wsSnapshot.workspaces) ? wsSnapshot.workspaces : []);
		}, () => {
			if (current) setWsOptions([]);
		});
		return () => {
			current = false;
		};
	}, [listWorkspaces]);

	// 错误态“重试”与显式全量刷新。
	const refresh = () => {
		setBodies({});
		setExpanded(null);
		setRequest((value) => value + 1);
	};

	// 热操作后延迟静默刷新：等网关文件监听器（约 200ms 防抖）失效缓存。
	const reloadAfterHot = () => {
		setTimeout(() => setRequest((value) => value + 1), 450);
	};

	// 启用/停用：乐观更新本地状态，随后后台对齐。
	const applySetEnabled = (skill) => {
		const target = skill.enabled !== true;
		setOps((prev) => ({ ...prev, [opKeyOf(skill)]: { status: "busy" } }));
		Promise.resolve().then(() => setSkillEnabled(skill.name, target, scopeOf(skill))).then(() => {
			setListState((prev) => (prev.status === "ready" ? { status: "ready", skills: prev.skills.map((s) => (s.name === skill.name && scopeOf(s) === scopeOf(skill) ? { ...s, enabled: target } : s)) } : prev));
			setOps((prev) => ({ ...prev, [opKeyOf(skill)]: { status: "ok" } }));
			reloadAfterHot();
		}, () => {
			setOps((prev) => ({ ...prev, [opKeyOf(skill)]: { status: "error" } }));
		});
	};

	// 删除：行内二次确认（3 秒未确认自动还原），确认后乐观移除卡片，后台对齐。
	const applyRemove = (skill) => {
		const key = opKeyOf(skill);
		if (confirmKey !== key) {
			setConfirmKey(key);
			return;
		}
		setConfirmKey(null);
		setOps((prev) => ({ ...prev, [key]: { status: "busy" } }));
		Promise.resolve().then(() => removeSkill(skill.name, scopeOf(skill))).then(() => {
			setListState((prev) => (prev.status === "ready" ? { status: "ready", skills: prev.skills.filter((s) => opKeyOf(s) !== key) } : prev));
			setOps((prev) => ({ ...prev, [key]: { status: "ok" } }));
			setExpanded((current) => (current === key ? null : current));
			reloadAfterHot();
		}, () => {
			setOps((prev) => ({ ...prev, [key]: { status: "error" } }));
		});
	};
	// 二次确认 3 秒未点击自动还原。
	react.useEffect(() => {
		if (confirmKey === null) return;
		const timer = setTimeout(() => setConfirmKey(null), 3000);
		return () => clearTimeout(timer);
	}, [confirmKey]);


	// ── 添加技能：读取本地文件并上传（宿主负责校验与落盘）──────────────
	const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const bytes = new Uint8Array(reader.result as ArrayBuffer);
			let binary = "";
			for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
			resolve(btoa(binary));
		};
		reader.onerror = () => reject(new Error("file read failed"));
		reader.readAsArrayBuffer(file);
	});

	// 把宿主的业务报错从 RPC 信封前缀里剥出来（提示语已经是面向用户的中文）。
	const cleanHostError = (error) => String(error?.message ?? error).replace(/^skillsViewer\.[a-zA-Z]+ failed: [a-zA-Z0-9_-]+: /, "");

	// 同名技能可能存在于多个作用域：操作状态与目标都按（名称, 作用域）区分。
	const opKeyOf = (skill) => skill.name + "\u0000" + (skill.scope !== undefined && skill.scope !== null && skill.scope.kind === "workspace" ? skill.scope.path : "global");

	const runAdd = (kind, items) => {
		if (items.length === 0) return;
		if (items.length > 200) {
			setAdding({ status: "error", message: t("addTooMany") });
			return;
		}
		if (kind === "bundle" && !items.some((item) => {
			const parts = item.path.replaceAll("\\", "/").split("/");
			return parts.length === 2 && parts[1] === "SKILL.md";
		})) {
			setAdding({ status: "error", message: t("addNoSkillFile") });
			return;
		}
		setAdding({ status: "busy" });
		const workspace = scopeFilter === "global" ? null : scopeFilter;
		Promise.all(items.map((item) => readFileAsBase64(item.file))).then((blobs) => {
			const payloadFiles = items.map((item, index) => ({ path: item.path.replaceAll("\\", "/"), base64: blobs[index] }));
			return addSkill({ kind, files: payloadFiles, workspace });
		}).then(() => {
			setAdding({ status: "ok" });
			setTimeout(() => setRequest((value) => value + 1), 700);
			setTimeout(() => setAdding({ status: "idle" }), 2500);
		}, (error) => {
			setAdding({ status: "error", message: cleanHostError(error) });
		});
	};
	// 统一入口：无论来源（选择器/拖放）、无论类型（.md/.zip/文件夹），
	// 都自动判定结构后交给宿主。
	const ingestItems = (items) => {
		const paths = items.map((item) => item.path.replaceAll("\\", "/"));
		const hasDir = paths.some((path) => path.includes("/"));
		const hasZip = paths.some((path) => path.toLowerCase().endsWith(".zip"));
		runAdd(hasDir ? "bundle" : hasZip ? "zip" : "flat", items);
	};

	// 批量迁移：打开对话框，源/目标/技能均由用户手动选择。
	const openMigrator = () => {
		setMigrator({
			from: "",
			targets: new Set(),
			mode: "move",
			selected: new Set(),
			busy: false,
			result: null,
			error: null
		});
	};

	const applyBatchMigrate = () => {
		const m = migrator;
		if (m === null) return;
		if (m.from === "") {
			setMigrator({ ...m, error: t("migratePickSource") });
			return;
		}
		if (m.targets.size === 0) {
			setMigrator({ ...m, error: t("migratePickTarget") });
			return;
		}
		if (m.targets.has(m.from)) {
			setMigrator({ ...m, error: t("migrateSameScope") });
			return;
		}
		if (m.mode === "move" && m.targets.size > 1) {
			setMigrator({ ...m, error: t("migrateMoveSingle") });
			return;
		}
		if (m.selected.size === 0) {
			setMigrator({ ...m, error: t("migratePickSkills") });
			return;
		}
		setMigrator({ ...m, busy: true, error: null });
		const payload = {
			from: m.from === "global" ? null : m.from,
			targets: [...m.targets].map((value) => (value === "global" ? null : value)),
			mode: m.mode,
			names: [...m.selected]
		};
		Promise.resolve().then(() => batchMigrateSkill(payload)).then((snapshot) => {
			const results = snapshot !== null && typeof snapshot === "object" && Array.isArray(snapshot.results) ? snapshot.results : [];
			setMigrator((prev) => (prev === null ? prev : { ...prev, busy: false, result: results }));
			reloadAfterHot();
		}, (error) => {
			setMigrator((prev) => (prev === null ? prev : { ...prev, busy: false, error: cleanHostError(error) }));
		});
	};

	// 进入页面时后台静默检查更新；仅在有新版本时提示，网络失败不打扰。
	react.useEffect(() => {
		let current = true;
		Promise.resolve().then(() => checkUpdateRemote()).then((snapshot) => {
			if (!current) return;
			const currentV = snapshot !== null && typeof snapshot === "object" && typeof snapshot.current === "string" ? snapshot.current : "";
			const latest = snapshot !== null && typeof snapshot === "object" && typeof snapshot.latest === "string" ? snapshot.latest : null;
			if (latest !== null && snapshot.updateAvailable === true) setUpdateBanner(t("checkUpdateAvailable") + latest + t("checkUpdateCurrent") + currentV + t("checkUpdateHint"));
		}, () => {
			// 网络不可达或超时：静默忽略
		});
		return () => {
			current = false;
		};
	}, [checkUpdateRemote]);

// 文件选择：单文件入口。
	const pickSingleFiles = (event) => {
		const input = event.currentTarget;
		const files = [...input.files];
		input.value = "";
		setAddMenuOpen(false);
		if (files.length === 0) return;
		ingestItems(files.map((file) => ({ name: file.name, path: file.name, file })));
	};

	const pickZipFiles = (event) => {
		const input = event.currentTarget;
		const files = [...input.files];
		input.value = "";
		if (files.length === 0) return;
		ingestItems(files.map((file) => ({ name: file.name, path: file.name, file })));
	};

	// 文件夹 / zip 入口：优先使用 File System Access API 选择文件夹；
	// 取消或不可用时回退到 .zip 文件选择，最终交给宿主自动识别结构。
	const readHandleDir = async (handle, prefix, out) => {
		for await (const [name, child] of handle.entries()) {
			if (child.kind === "file") {
				const file = await child.getFile();
				out.push({ name, path: prefix === "" ? name : prefix + "/" + name, file });
			} else if (child.kind === "directory") {
				await readHandleDir(child, prefix === "" ? name : prefix + "/" + name, out);
			}
		}
	};
	const pickFolderOrZip = async () => {
		setAddMenuOpen(false);
		const picker = (window as any).showDirectoryPicker;
		if (typeof picker === "function") {
			try {
				const dir = await picker.call(window, { mode: "read" });
				const items: any[] = [];
				await readHandleDir(dir, "", items);
				if (items.length > 0) ingestItems(items);
				return;
			} catch (error) {
				// 用户取消：回退到 zip 文件选择。
				zipFileInput.current?.click();
				return;
			}
		}
		zipFileInput.current?.click();
	};

// 拖放：支持拖入 .md / .zip 文件与技能文件夹（自动识别结构）。
	const readDirEntries = (dirEntry) => new Promise<any[]>((resolve, reject) => {
		const reader = dirEntry.createReader();
		const all: any[] = [];
		const readBatch = () => reader.readEntries((batch) => {
			if (batch.length === 0) resolve(all);
			else {
				all.push(...batch);
				readBatch();
			}
		}, reject);
		readBatch();
	});
	const collectDropItems = async (dataTransfer) => {
		const items: any[] = [];
		const walk = async (entry, prefix) => {
			if (entry.isFile) {
				const file = await new Promise<any>((resolve, reject) => entry.file(resolve, reject));
				items.push({ name: entry.name, path: prefix + entry.name, file });
			} else if (entry.isDirectory) {
				for (const child of await readDirEntries(entry)) await walk(child, prefix + entry.name + "/");
			}
		};
		const entries: any[] = [];
		for (const item of dataTransfer.items) {
			const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
			if (entry !== null) entries.push(entry);
		}
		if (entries.length === 0) {
			for (const file of dataTransfer.files) items.push({ name: file.name, path: file.name, file });
		} else {
			for (const entry of entries) await walk(entry, "");
		}
		return items;
	};
	const onDrop = (event) => {
		event.preventDefault();
		setDragActive(false);
		if (adding.status === "busy" || event.dataTransfer === null) return;
		collectDropItems(event.dataTransfer).then((items) => {
			if (items.length > 0) ingestItems(items);
		}, (error) => {
			setAdding({ status: "error", message: cleanHostError(error) });
		});
	};
	const onDragOver = (event) => {
		event.preventDefault();
		if (adding.status !== "busy") setDragActive(true);
	};
	const onDragLeave = (event) => {
		if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
		setDragActive(false);
	};

	const normalizedQuery = query.trim().toLocaleLowerCase();
	const skills = listState.status === "ready" ? listState.skills : [];
				const scopeOf = (skill) => (skill.scope !== undefined && skill.scope !== null && skill.scope.kind === "workspace" ? skill.scope.path : "global");
	const labelOf = (path) => {
		// 优先用 DSH 注册表的工作区名称（与文件夹名解耦），取不到回退文件夹名。
		const hit = (Array.isArray(wsOptions) ? wsOptions : []).find((workspace) => workspace.path === path);
		if (hit !== undefined && typeof hit.label === "string" && hit.label !== "") return hit.label;
		const parts = String(path).replaceAll("\\", "/").split("/").filter(Boolean);
		return parts.length > 0 ? parts[parts.length - 1] : String(path);
	};
	const knownPaths = (Array.isArray(wsOptions) ? wsOptions : []).map((workspace) => workspace.path);
	const scopeKeys = ["global", ...knownPaths.filter((path) => path !== "global")];
	if (scopeFilter !== "global" && !scopeKeys.includes(scopeFilter)) scopeKeys.push(scopeFilter);
	const scopeCount = (key) => skills.reduce((sum, skill) => sum + (scopeOf(skill) === key ? 1 : 0), 0);
	const scoped = skills.filter((skill) => scopeOf(skill) === scopeFilter);
	const filtered = scoped.filter((skill) => skill.name.toLocaleLowerCase().includes(normalizedQuery));

	// ── 树形渲染（嵌套技能按文件树显示；搜索时扁平化）──────────────────
	const querying = normalizedQuery.trim() !== "";
	const treeRoot = buildSkillTree(filtered);
	const renderCard = (skill) => {
		const open = expanded === opKeyOf(skill);
		const body = bodies[opKeyOf(skill)];
		const enabled = skill.enabled !== false;
		const editable = skill.source !== "bundled" && skill.source !== "runtime";
		const op = ops[opKeyOf(skill)];
		return (0, react_jsx_runtime.jsxs)("li", {
			key: skill.name,
			className: c.card,
			"data-skill-name": skill.name,
			"data-open": open ? "true" : void 0,
			children: [(0, react_jsx_runtime.jsxs)("button", {
				className: c.cardContent,
				type: "button",
				"aria-expanded": open,
				onClick: () => {
					toggle(skill);
				},
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: c.cardLeading,
					children: (0, react_jsx_runtime.jsx)(primitives.IconSkillOutline16, { size: 14 })
				}), (0, react_jsx_runtime.jsx)("strong", {
					className: c.cardTitle,
					"data-disabled": enabled ? void 0 : "true",
					title: skill.name,
					children: skill.name
				}), (0, react_jsx_runtime.jsxs)("span", {
					className: c.cardTrailing,
					children: [(0, react_jsx_runtime.jsx)("span", {
						className: c.statusDot,
						"data-enabled": enabled ? "true" : "false",
						"aria-hidden": "true"
					}), (0, react_jsx_runtime.jsx)("span", {
						className: c.configTag,
						"data-enabled": enabled ? "true" : "false",
						children: enabled ? t("enabledTag") : t("disabledTag")
					}), (0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutline14, {
						className: c.chevron,
						size: 12,
						"aria-hidden": "true"
					})]
				})]
			}), open ? (0, react_jsx_runtime.jsxs)("div", {
				className: c.cardDetails,
				children: [(0, react_jsx_runtime.jsxs)("p", {
					className: c.meta,
					children: [skill.description, (0, react_jsx_runtime.jsx)("span", {
						className: c.metaProvider,
						children: t("providerLabel") + ": " + skill.provider
					})]
				}), body === undefined || body.status === "loading" ? (0, react_jsx_runtime.jsx)("p", {
					className: c.status,
					children: t("contentLoading")
				}) : null,
				body !== undefined && body.status === "error" ? (0, react_jsx_runtime.jsx)("p", {
					className: c.failureText,
					children: t("contentError")
				}) : null,
				body !== undefined && body.status === "missing" ? (0, react_jsx_runtime.jsx)("p", {
					className: c.failureText,
					children: t("contentMissing")
				}) : null,
				body !== undefined && body.status === "ready" ? (0, react_jsx_runtime.jsx)("div", {
					className: c.contentBox,
					children: (0, react_jsx_runtime.jsx)("pre", {
						className: c.content,
						children: body.skill.content
					})
				}) : null,
				editable ? (0, react_jsx_runtime.jsxs)("div", {
					className: c.cardActions,
					children: [(0, react_jsx_runtime.jsxs)("span", {
						className: c.switchRow,
						children: [(0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "switch",
							className: c.switch,
							"data-on": enabled ? "true" : void 0,
							"aria-checked": enabled,
							"aria-label": enabled ? t("switchDisable") : t("switchEnable"),
							disabled: op?.status === "busy",
							onClick: () => {
								applySetEnabled(skill);
							},
							children: (0, react_jsx_runtime.jsx)("span", {
								className: c.switchThumb
							})
						}), (0, react_jsx_runtime.jsx)("span", {
							className: c.switchText,
							children: enabled ? t("switchDisable") : t("switchEnable")
						})]
					}), op?.status === "error" ? (0, react_jsx_runtime.jsx)("span", {
						className: c.opError,
						children: t("opFailed")
					}) : null, (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: c.deleteButton,
						disabled: op?.status === "busy",
						onClick: () => {
							applyRemove(skill);
						},
						"data-confirm": confirmKey === opKeyOf(skill) ? "true" : void 0,
						children: confirmKey === opKeyOf(skill) ? t("confirmDelete") : t("deleteLabel")
					})]
				}) : null]
			}) : null]
		}, skill.name);
	};
	const renderFolder = (folder) => (0, react_jsx_runtime.jsxs)("li", {
		className: c.treeFolder,
		children: [(0, react_jsx_runtime.jsx)("button", {
			type: "button",
			className: c.treeFolderHeader,
			"aria-expanded": !collapsed.has(folder.path),
			onClick: () => {
				toggleCollapsed(folder.path);
			},
			children: [(0, react_jsx_runtime.jsx)(primitives.IconChevronDownOutline14, {
				className: collapsed.has(folder.path) ? c.treeChevron : c.treeChevronOpen,
				size: 12,
				"aria-hidden": "true"
			}), (0, react_jsx_runtime.jsx)("span", {
				className: c.treeFolderName,
				children: folder.name
			}), (0, react_jsx_runtime.jsx)("span", {
				className: c.treeFolderCount,
				children: String(folder.count)
			})]
		}), !collapsed.has(folder.path) ? (0, react_jsx_runtime.jsx)("ul", {
			className: c.cards,
			children: [...folder.folders.values()].map(renderFolder).concat(folder.skills.map(renderCard))
		}) : null]
	}, folder.path);

	

	const migratorSkills = migrator !== null ? skills.filter((skill) => scopeOf(skill) === migrator.from) : [];

	// 搜索过滤掉已展开项时自动收起。
	react.useEffect(() => {
		if (expanded !== null && !filtered.some((skill) => opKeyOf(skill) === expanded)) setExpanded(null);
	}, [expanded, filtered]);

	// 展开/收起：展开时懒加载内容并缓存。缓存键与操作键一致，按
	// （名称+作用域）区分——同名技能在不同作用域各有独立展开与正文。
	const toggle = (skill) => {
		const key = opKeyOf(skill);
		const next = expanded === key ? null : key;
		setExpanded(next);
		if (next === null || bodies[key] !== undefined || inflight.current.has(key)) return;
		inflight.current.add(key);
		setBodies((prev) => ({ ...prev, [key]: { status: "loading" } }));
		Promise.resolve().then(() => loadContent(skill.name, scopeOf(skill))).then((skillBody) => {
			inflight.current.delete(key);
			setBodies((prev) => ({ ...prev, [key]: { status: skillBody === null ? "missing" : "ready", skill: skillBody } }));
		}, () => {
			inflight.current.delete(key);
			setBodies((prev) => ({ ...prev, [key]: { status: "error" } }));
		});
	};

	return (0, react_jsx_runtime.jsx)("div", {
		className: c.section,
		"aria-busy": listState.status === "loading",
		"data-dragging": dragActive ? "true" : void 0,
		onDragOver: onDragOver,
		onDragLeave: onDragLeave,
		onDrop: onDrop,
		children: listState.status === "loading" ? (0, react_jsx_runtime.jsx)("p", {
			className: c.status,
			children: t("loading")
		}) : listState.status === "error" ? (0, react_jsx_runtime.jsxs)("div", {
			className: c.failure,
			children: [(0, react_jsx_runtime.jsx)("p", {
				role: "alert",
				children: t("error")
			}), (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: refresh,
				children: t("retry")
			})]
		}) : (0, react_jsx_runtime.jsxs)("div", {
			className: c.catalog,
		children: [
		dragActive ? (0, react_jsx_runtime.jsx)("div", {
			className: c.dropHint,
			children: t("addDragHint")
		}) : null,
		updateBanner !== null ? (0, react_jsx_runtime.jsxs)("div", {
				className: c.notice,
				"data-kind": "info",
				role: "status",
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: c.noticeText,
					children: updateBanner
				}), (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: c.noticeButton,
					onClick: () => {
						setUpdateBanner(null);
					},
					children: t("addDismiss")
				})]
			}) : null,
				(0, react_jsx_runtime.jsxs)("div", {
					className: c.searchBox,
					children: [(0, react_jsx_runtime.jsx)("span", {
						className: c.searchIcon,
						"aria-hidden": "true",
						children: (0, react_jsx_runtime.jsx)(primitives.IconSearchOutline16, {})
					}), (0, react_jsx_runtime.jsx)("input", {
						type: "search",
						className: c.searchField,
						value: query,
						placeholder: t("search"),
						"aria-label": t("search"),
						onChange: (event) => {
							setQuery(event.currentTarget.value);
						}
					})]
				}),
				(0, react_jsx_runtime.jsxs)("div", {
					className: c.catalogHeading,
					children: [(0, react_jsx_runtime.jsx)("h3", { children: t("catalog") }), (0, react_jsx_runtime.jsx)("span", {
						"data-skill-count": filtered.length,
						children: filtered.length
					}), (0, react_jsx_runtime.jsxs)("span", {
						className: c.addActions,
					children: [(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: c.iconButton,
						"aria-label": t("migrateButton"),
						title: t("migrateButton"),
						disabled: listState.status !== "ready" || skills.length === 0 || adding.status === "busy",
						onClick: openMigrator,
						children: (0, react_jsx_runtime.jsxs)("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 16 16",
							fill: "none",
							"aria-hidden": "true",
							children: [(0, react_jsx_runtime.jsx)("path", {
								d: "M2.5 5h11M11 2.5 13.5 5 11 7.5",
								stroke: "currentColor",
								strokeWidth: 1.6,
								strokeLinecap: "round",
								strokeLinejoin: "round"
							}), (0, react_jsx_runtime.jsx)("path", {
								d: "M13.5 11h-11M5 8.5 2.5 11 5 13.5",
								stroke: "currentColor",
								strokeWidth: 1.6,
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})]
						})
					}), (0, react_jsx_runtime.jsxs)("span", {
                                                                        className: c.addMenuWrap,
                                                                        children: [(0, react_jsx_runtime.jsx)("button", {
                                                                                type: "button",
                                                                                className: c.iconButton,
                                                                                "aria-label": t("addButton"),
                                                                                "aria-expanded": addMenuOpen,
                                                                                title: t("addButton") + " · " + (scopeFilter === "global" ? t("scopeGlobal") : labelOf(scopeFilter)),
                                                                                disabled: adding.status === "busy",
                                                                                onClick: () => { setAddMenuOpen((value) => !value); },
                                                                                children: (0, react_jsx_runtime.jsxs)("svg", {
                                                                                        width: "14",
                                                                                        height: "14",
                                                                                        viewBox: "0 0 16 16",
                                                                                        fill: "none",
                                                                                        "aria-hidden": "true",
                                                                                        children: [(0, react_jsx_runtime.jsx)("path", {
                                                                                                d: "M8 3.5v9",
                                                                                                stroke: "currentColor",
                                                                                                strokeWidth: 1.6,
                                                                                                strokeLinecap: "round"
                                                                                        }), (0, react_jsx_runtime.jsx)("path", {
                                                                                                d: "M3.5 8h9",
                                                                                                stroke: "currentColor",
                                                                                                strokeWidth: 1.6,
                                                                                                strokeLinecap: "round"
                                                                                        })]
                                                                                })
                                                                        }), addMenuOpen ? (0, react_jsx_runtime.jsxs)("div", {
                                                                                className: c.addMenu,
                                                                                children: [(0, react_jsx_runtime.jsx)("p", {
                                                                                        className: c.addMenuTitle,
                                                                                        children: t("addTarget") + (scopeFilter === "global" ? t("scopeGlobal") : labelOf(scopeFilter))
                                                                                }), (0, react_jsx_runtime.jsx)("button", {
                                                                                        type: "button",
                                                                                        className: c.addMenuButton,
                                                                                        onClick: () => { singleFileInput.current?.click(); },
                                                                                        children: t("addSingle")
                                                                                }), (0, react_jsx_runtime.jsx)("button", {
                                                                                        type: "button",
                                                                                        className: c.addMenuButton,
                                                                                        onClick: () => { pickFolderOrZip(); },
                                                                                        children: t("addFolderZip")
                                                                                })]
                                                                        }) : null]
                                                                })
]
					})]
				}),
			(0, react_jsx_runtime.jsxs)("div", {
				className: c.scopeBar,
				children: scopeKeys.map((key) => (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": scopeFilter === key,
					className: c.scopeChip,
					"data-active": scopeFilter === key ? "true" : void 0,
					onClick: () => {
						setScopeFilter(key);
					},
					children: [(0, react_jsx_runtime.jsx)("span", {
						className: c.scopeChipLabel,
						title: key === "global" ? t("scopeGlobal") : key,
						children: key === "global" ? t("scopeGlobal") : labelOf(key)
					}), (0, react_jsx_runtime.jsx)("span", {
						className: c.scopeChipCount,
						children: scopeCount(key)
					})]
				}, key))
			}),
				adding.status === "busy" ? (0, react_jsx_runtime.jsx)("p", {
					className: c.addStatus,
					children: t("addBusy")
				}) : null,
				adding.status === "error" ? (0, react_jsx_runtime.jsxs)("div", {
					className: c.notice,
					"data-kind": "error",
					role: "alert",
					children: [(0, react_jsx_runtime.jsx)("span", {
						className: c.noticeText,
						children: adding.message
					}), (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: c.noticeButton,
						onClick: () => {
							setAdding({ status: "idle" });
						},
						children: t("addDismiss")
					})]
				}) : null,
				currentSessionId() === undefined ? (0, react_jsx_runtime.jsx)("p", {
					className: c.status,
					children: t("noSession")
				}) : null,
				skills.length === 0 && currentSessionId() !== undefined ? (0, react_jsx_runtime.jsx)("p", {
					className: c.status,
					children: t("empty")
				}) : null,
				skills.length > 0 && scoped.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
					className: c.status,
					children: t("emptyScope")
				}) : null,
				scoped.length > 0 && filtered.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
					className: c.status,
					children: t("emptySearch")
				}) : null,
				filtered.length > 0 ? (0, react_jsx_runtime.jsx)("ul", {
					className: c.cards,
					children: querying ? filtered.map(renderCard) : [...treeRoot.folders.values()].map(renderFolder).concat(treeRoot.skills.map(renderCard))
				}) : null,
										(0, react_jsx_runtime.jsx)("input", {
                                                        ref: singleFileInput,
                                                        className: c.fileInput,
                                                        type: "file",
                                                        accept: ".md,text/markdown",
                                                        multiple: true,
                                                        onChange: pickSingleFiles
                                                }), (0, react_jsx_runtime.jsx)("input", {
                                                        ref: zipFileInput,
                                                        className: c.fileInput,
                                                        type: "file",
                                                        accept: ".zip,application/zip,application/x-zip-compressed",
                                                        multiple: true,
                                                        onChange: pickZipFiles
                                                }),
migrator !== null ? (0, react_jsx_runtime.jsx)(MigrateDialog, {
				t,
				options: wsOptions,
				from: migrator.from,
				setFrom: (value) => {
					setMigrator((prev) => (prev === null ? prev : { ...prev, from: value, error: null }));
				},
				targets: migrator.targets,
				toggleTarget: (value) => {
					setMigrator((prev) => {
						if (prev === null) return prev;
						const next = new Set(prev.targets);
						if (next.has(value)) next.delete(value);
						else next.add(value);
						return { ...prev, targets: next, error: null, ...(next.size > 1 && prev.mode === "move" ? { mode: "copy" } : {}) };
					});
				},
				mode: migrator.mode,
				setMode: (value) => {
					setMigrator((prev) => (prev === null ? prev : { ...prev, mode: value }));
				},
				skills: migratorSkills,
				selected: migrator.selected,
				toggle: (skillName) => {
					setMigrator((prev) => {
						if (prev === null) return prev;
						const next = new Set(prev.selected);
						if (next.has(skillName)) next.delete(skillName);
						else next.add(skillName);
						return { ...prev, selected: next };
					});
				},
				selectAll: () => {
					setMigrator((prev) => {
						if (prev === null) return prev;
						const all = new Set(migratorSkills.map((skill) => skill.name));
						return { ...prev, selected: prev.selected.size === all.size ? new Set() : all };
					});
				},
				busy: migrator.busy,
				result: migrator.result,
				error: migrator.error,
				onConfirm: applyBatchMigrate,
				onCancel: () => {
					setMigrator(null);
				},
				onClose: () => {
					setMigrator(null);
				}
			}) : null
			]
		})
	});
}


                // ── MCP 页面：字典 / 样式 / 表单 / 卡片 ──────────────────────────
                const MCP_NS = "settings.mcp";
                const mcpZh = {
                        nav: "MCP",
                        title: "MCP 服务器",
                        subtitle: "在 profile cordis.patch.yml 的受管块中维护 MCP 服务器，保存后由 DSH HMR 热加载。",
                        add: "+ 添加服务器",
                        refresh: "刷新",
                        empty: "还没有 MCP 服务器。",
                        loading: "正在读取 MCP 服务器…",
                        loadError: "暂时无法读取 MCP 服务器。",
                        retry: "重试",
                        newTitle: "添加 MCP 服务器",
                        editTitle: "编辑 MCP 服务器",
                        save: "保存",
                        cancel: "取消",
                        close: "关闭",
                        test: "测试连接",
                        testing: "测试中…",
                        testOk: "连接成功，发现 {count} 个工具：",
                        testFailed: "连接失败：",
                        enable: "启用",
                        disable: "停用",
                        stateEnabled: "已启用",
                        stateDisabled: "已停用",
                        delete: "删除",
                        confirmDelete: "确认删除？",
                        external: "外部管理",
                        patchBroken: "cordis.patch.yml 不可用：",
                        reconciled: "已写入，等待 HMR 生效…",
                        reconcileTimeout: "配置已写入，但 HMR 确认超时，请稍后刷新。",
                        fieldServerName: "名称",
                        fieldTransport: "调用方式",
                        transportStdio: "STDIO",
                        transportHttp: "HTTP",
                        fieldCommand: "命令",
                        fieldArgs: "参数（每行一个）",
                        fieldEnv: "环境变量（每行 键=值；已配置的键留空保持不变）",
                        fieldCwd: "工作目录（留空使用默认）",
                        fieldUrl: "服务器地址",
                        fieldHeaders: "请求头（每行 键=值；已配置的键留空保持不变）",
                        fieldTimeout: "单次调用超时",
                        fieldFailOnStartup: "启动失败时报错",
                        fieldReconnect: "自动重连",
                        fieldInitialDelay: "首次重连延迟",
                        fieldMaxDelay: "最大重连延迟",
                        fieldMaxAttempts: "最大重连次数",
                        configuredKeys: "已配置的密钥：",
                        deleteSecret: "删除",
                        stateActive: "运行中",
                        stateLoading: "加载中",
                        statePending: "等待中",
                        stateFailed: "启动失败",
                        stateStopped: "已停用",
                        stateUnknown: "未知",
                        toolCount: "{count} 个工具",
                        advanced: "高级设置",
                        currentVersion: "dsh-skill-mcp-panel",
                        checkUpdateAvailable: "发现新版本 v",
                        checkUpdateCurrent: "（当前 v",
                        checkUpdateHint: "）。可在终端运行 dsh-panel update 更新"
                };
                const mcpEn = {
                        nav: "MCP",
                        title: "MCP Servers",
                        subtitle: "MCP servers are maintained in the managed block of profile cordis.patch.yml and hot-applied by DSH HMR.",
                        add: "+ Add server",
                        refresh: "Refresh",
                        empty: "No MCP servers yet.",
                        loading: "Loading MCP servers…",
                        loadError: "Unable to load MCP servers.",
                        retry: "Retry",
                        newTitle: "Add MCP server",
                        editTitle: "Edit MCP server",
                        save: "Save",
                        cancel: "Cancel",
                        close: "Close",
                        test: "Test connection",
                        testing: "Testing…",
                        testOk: "Connected, {count} tools found:",
                        testFailed: "Connection failed:",
                        enable: "Enable",
                        disable: "Disable",
                        stateEnabled: "Enabled",
                        stateDisabled: "Disabled",
                        delete: "Delete",
                        confirmDelete: "Confirm delete?",
                        external: "External",
                        patchBroken: "cordis.patch.yml is unavailable:",
                        reconciled: "Written, waiting for HMR…",
                        reconcileTimeout: "Config written, but HMR confirmation timed out. Refresh later.",
                        fieldServerName: "serverName",
                        fieldTransport: "Transport",
                        transportStdio: "STDIO",
                        transportHttp: "HTTP",
                        fieldCommand: "command",
                        fieldArgs: "args (one per line)",
                        fieldEnv: "env (KEY=VALUE per line; leave configured keys blank to keep them)",
                        fieldCwd: "cwd (blank for default)",
                        fieldUrl: "url",
                        fieldHeaders: "headers (KEY=VALUE per line; leave configured keys blank to keep them)",
                        fieldTimeout: "toolCallTimeoutMs",
                        fieldFailOnStartup: "Fail on startup error",
                        fieldReconnect: "Auto reconnect",
                        fieldInitialDelay: "initialDelayMs",
                        fieldMaxDelay: "maxDelayMs",
                        fieldMaxAttempts: "maxAttempts",
                        configuredKeys: "Configured secrets:",
                        deleteSecret: "Delete",
                        stateActive: "Running",
                        stateLoading: "Loading",
                        statePending: "Pending",
                        stateFailed: "Startup failed",
                        stateStopped: "Stopped",
                        stateUnknown: "Unknown",
                        toolCount: "{count} tools",
                        advanced: "Advanced",
                        currentVersion: "dsh-skill-mcp-panel",
                        checkUpdateAvailable: "Update available: v",
                        checkUpdateCurrent: " (current v",
                        checkUpdateHint: "). Run dsh-panel update in a terminal to install it"
                };

                const cssMcpEffects = "@keyframes skvFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}@keyframes skvFadeOnly{from{opacity:0}to{opacity:1}}.MCP_card{transition:border-color .18s cubic-bezier(.22,.61,.36,1),box-shadow .18s ease}.MCP_card:hover{border-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-shadow-lv1)}.MCP_dot{transition:background-color .2s ease}.MCP_input,.MCP_textarea{transition:border-color .15s ease,box-shadow .15s ease}.MCP_transportBtn{transition:background-color .15s ease,border-color .15s ease,color .15s ease}.MCP_actionBtn,.MCP_dangerBtn,.MCP_iconBtn,.MCP_add,.MCP_advancedToggle{transition:background-color .15s ease,border-color .15s ease,transform .1s ease}.MCP_actionBtn:active:not(:disabled),.MCP_dangerBtn:active:not(:disabled),.MCP_iconBtn:active,.MCP_add:active{transform:scale(.96)}.MCP_actionBtn:focus-visible,.MCP_dangerBtn:focus-visible,.MCP_iconBtn:focus-visible,.MCP_add:focus-visible,.MCP_transportBtn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}.MCP_cards{animation:skvFadeOnly .2s ease}.MCP_result{animation:skvFadeIn .18s ease}@media (prefers-reduced-motion: reduce){.MCP_section *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}";
const cssMcp = ".MCP_section{position:relative;width:100%;max-width:760px;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:14px}.MCP_head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.MCP_head h3{font-size:14px;font-weight:600;line-height:20px;margin:0}.MCP_sub{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;margin:0}.MCP_toolbar{display:flex;align-items:center;gap:8px}.MCP_add{font:inherit;color:var(--dsw-alias-state-business-primary);cursor:pointer;background:0 0;border:1px dashed var(--dsw-alias-border-l1);border-radius:8px;padding:7px 16px;font-size:13px;line-height:20px;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box}.MCP_add:hover{background:var(--dsw-alias-interactive-bg-hover)}.MCP_cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.MCP_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;min-width:0}.MCP_cardTop{display:flex;align-items:center;gap:8px;min-width:0}.MCP_name{font-size:13px;font-weight:600;line-height:20px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.MCP_badges{display:inline-flex;align-items:center;gap:6px;flex:none}.MCP_badge{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:5px;padding:1px 6px;font-size:11px;line-height:16px}.MCP_meta{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.MCP_dot{width:7px;height:7px;border-radius:999px;background:var(--dsw-alias-label-tertiary);flex:none}.MCP_dot[data-on=true]{background:var(--dsw-alias-state-success-primary)}.MCP_dot[data-err=true]{background:var(--dsw-alias-state-error-primary)}.MCP_actions{display:flex;align-items:center;gap:8px;border-top:1px solid var(--dsw-alias-border-l2);padding-top:8px;flex-wrap:wrap}.MCP_spacer{flex:1}.MCP_form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.MCP_field{display:flex;flex-direction:column;gap:5px}.MCP_field[data-wide=true]{grid-column:1 / -1}.MCP_label{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);margin:0}.MCP_input{box-sizing:border-box;width:100%;height:32px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:0 8px}.MCP_input:focus-visible,.MCP_textarea:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent);outline:none}.MCP_textarea{box-sizing:border-box;width:100%;min-height:64px;font:inherit;font-size:12px;line-height:18px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px 8px;resize:vertical}.MCP_transportRow{display:flex;gap:8px}.MCP_transportBtn{font:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:4px 14px}.MCP_transportBtn[data-active=true]{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)}.MCP_secretKeys{display:flex;flex-wrap:wrap;gap:6px}.MCP_key{display:inline-flex;align-items:center;gap:6px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:2px 8px;font-size:11px;line-height:16px}.MCP_key button{font:inherit;color:var(--dsw-alias-state-error-primary);cursor:pointer;background:0 0;border:none;padding:0}.MCP_checkRow{display:flex;align-items:center;gap:8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}.MCP_result{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 10px;font-size:12px;line-height:18px;max-height:160px;overflow:auto}.MCP_actionBtn{font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;padding:0 12px;font-size:12px;line-height:26px;height:28px;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;box-sizing:border-box}.MCP_actionBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}.MCP_actionBtn:disabled{cursor:default;opacity:.6}.MCP_dangerBtn{font:inherit;color:var(--dsw-alias-state-error-primary);cursor:pointer;background:0 0;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;padding:0 12px;font-size:12px;line-height:26px;height:28px;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;box-sizing:border-box}.MCP_dangerBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}.MCP_iconBtn{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:0;flex:none}.MCP_iconBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.MCP_advancedToggle{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:1px dashed var(--dsw-alias-border-l1);border-radius:8px;padding:6px 12px;font-size:13px;line-height:20px}.MCP_advancedToggle:hover{background:var(--dsw-alias-interactive-bg-hover)}.MCP_result[data-ok=true]{border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 40%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 8%, transparent)}.MCP_result[data-ok=false]{border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent)}" + cssMcpEffects;
                const mcpTagId = "dsh-better-workbench-skill-mcp-panels/McpSection.module.css";
                if (typeof document !== "undefined") {
                        let mcpTag = document.querySelector("style[data-plugin-css=" + JSON.stringify(mcpTagId) + "]") as HTMLElement | null;
                        if (mcpTag === null) {
                                mcpTag = document.createElement("style");
                                mcpTag.dataset.plugin = "dsh-better-workbench-skill-mcp-panels";
                                mcpTag.dataset.pluginCss = mcpTagId;
                                document.head.appendChild(mcpTag);
                        }
                        mcpTag.textContent = cssMcp;
                }
                const m = {
                        section: "MCP_section",
                        head: "MCP_head",
                        sub: "MCP_sub",
                        toolbar: "MCP_toolbar",
                        add: "MCP_add",
                        cards: "MCP_cards",
                        card: "MCP_card",
                        cardTop: "MCP_cardTop",
                        name: "MCP_name",
                        badges: "MCP_badges",
                        badge: "MCP_badge",
                        meta: "MCP_meta",
                        dot: "MCP_dot",
                        actions: "MCP_actions",
                        spacer: "MCP_spacer",
                        form: "MCP_form",
                        field: "MCP_field",
                        label: "MCP_label",
                        input: "MCP_input",
                        textarea: "MCP_textarea",
                        transportRow: "MCP_transportRow",
                        transportBtn: "MCP_transportBtn",
                        secretKeys: "MCP_secretKeys",
                        key: "MCP_key",
                        checkRow: "MCP_checkRow",
                        result: "MCP_result",
                        actionBtn: "MCP_actionBtn",
                        dangerBtn: "MCP_dangerBtn",
                        iconBtn: "MCP_iconBtn",
                        advancedToggle: "MCP_advancedToggle"
                };

                function mcpParseLines(text) {
                        return String(text ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
                }
                function mcpParsePairs(text) {
                        const out = {};
                        for (const line of mcpParseLines(text)) {
                                const index = line.indexOf("=");
                                if (index <= 0) continue;
                                const key = line.slice(0, index).trim();
                                if (key !== "") out[key] = line.slice(index + 1).trim();
                        }
                        return out;
                }
                function mcpNumber(value, fallback) {
                        const n = parseInt(String(value ?? ""), 10);
                        return Number.isFinite(n) && n > 0 ? n : fallback;
                }
                function defaultMcpForm() {
                        return {
                                serverName: "",
                                transport: "stdio",
                                command: "",
                                argsText: "",
                                envText: "",
                                cwd: "",
                                url: "",
                                headersText: "",
                                timeout: "60000",
                                failOnStartup: false,
                                reconnectEnabled: true,
                                initialDelay: "500",
                                maxDelay: "30000",
                                maxAttempts: "10"
                        };
                }
                function formFromServer(server) {
                        const form = defaultMcpForm();
                        form.serverName = server.serverName ?? "";
                        form.transport = server.transport === "streamable-http" ? "streamable-http" : "stdio";
                        form.command = server.command ?? "";
                        form.argsText = Array.isArray(server.args) ? server.args.join("\n") : "";
                        form.cwd = server.cwd ?? "";
                        form.url = server.url ?? "";
                        form.timeout = String(server.toolCallTimeoutMs ?? 60000);
                        form.failOnStartup = !!server.failOnStartupError;
                        form.reconnectEnabled = server.reconnect?.enabled !== false;
                        form.initialDelay = String(server.reconnect?.initialDelayMs ?? 500);
                        form.maxDelay = String(server.reconnect?.maxDelayMs ?? 30000);
                        form.maxAttempts = String(server.reconnect?.maxAttempts ?? 10);
                        return form;
                }
                function buildMcpInput(form, deletedEnv, deletedHeaders) {
                        const reconnect = {
                                enabled: !!form.reconnectEnabled,
                                initialDelayMs: mcpNumber(form.initialDelay, 500),
                                maxDelayMs: mcpNumber(form.maxDelay, 30000),
                                maxAttempts: mcpNumber(form.maxAttempts, 10)
                        };
                        const common = {
                                serverName: String(form.serverName ?? "").trim(),
                                toolCallTimeoutMs: mcpNumber(form.timeout, 60000),
                                failOnStartupError: !!form.failOnStartup,
                                reconnect
                        };
                        if (form.transport === "streamable-http") {
                                const headers = mcpParsePairs(form.headersText);
                                for (const key of deletedHeaders) headers[key] = null;
                                return { ...common, transport: "streamable-http", url: String(form.url ?? "").trim(), headers };
                        }
                        const env = mcpParsePairs(form.envText);
                        for (const key of deletedEnv) env[key] = null;
                        return { ...common, transport: "stdio", command: String(form.command ?? "").trim(), args: mcpParseLines(form.argsText), env, cwd: String(form.cwd ?? "").trim() };
                }

                function McpFormDialog({ t, initial, onSave, onCancel, busy, error }) {
                        const editing = initial !== null && initial !== undefined;
                        const [form, setForm] = react.useState(() => editing ? formFromServer(initial) : defaultMcpForm());
                        const [deletedEnv, setDeletedEnv] = react.useState(() => new Set());
                        const [deletedHeaders, setDeletedHeaders] = react.useState(() => new Set());
                        const [advancedOpen, setAdvancedOpen] = react.useState(false);
                        const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
                        const envKeys = editing && Array.isArray(initial.envKeys) ? initial.envKeys.filter((key) => !deletedEnv.has(key)) : [];
                        const headerKeys = editing && Array.isArray(initial.headerKeys) ? initial.headerKeys.filter((key) => !deletedHeaders.has(key)) : [];
                        const submit = () => {
                                onSave(buildMcpInput(form, deletedEnv, deletedHeaders), editing ? initial.serverName : undefined);
                        };
                        const label = (text) => (0, react_jsx_runtime.jsx)("span", { className: m.label, children: text });
                        const field = (text, node, wide) => (0, react_jsx_runtime.jsxs)("label", {
                                className: m.field,
                                "data-wide": wide ? "true" : void 0,
                                children: [label(text), node]
                        });
                        const textInput = (value, onChange, placeholder = "") => (0, react_jsx_runtime.jsx)("input", {
                                className: m.input,
                                value,
                                placeholder,
                                onChange: (event) => onChange(event.target.value)
                        });
                        const textArea = (value, onChange, placeholder = "") => (0, react_jsx_runtime.jsx)("textarea", {
                                className: m.textarea,
                                value,
                                placeholder,
                                onChange: (event) => onChange(event.target.value)
                        });
                        const secretEditor = (keys, deleted, setDeleted, text, setText, placeholder) => (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                                children: [
                                        keys.length > 0 ? (0, react_jsx_runtime.jsx)("div", {
                                                className: m.secretKeys,
                                                children: keys.map((key) => (0, react_jsx_runtime.jsxs)("span", {
                                                        className: m.key,
                                                        children: [
                                                                key,
                                                                (0, react_jsx_runtime.jsx)("button", {
                                                                        type: "button",
                                                                        onClick: () => {
                                                                                const next = new Set(deleted);
                                                                                next.add(key);
                                                                                setDeleted(next);
                                                                        },
                                                                        children: t("deleteSecret")
                                                                })
                                                        ]
                                                }, key))
                                        }) : null,
                                        textArea(text, setText, placeholder)
                                ]
                        });
                        const fields = [
                                field(t("fieldServerName"), textInput(form.serverName, (value) => set({ serverName: value }), "MCP Server"), false),
                                field(t("fieldTransport"), (0, react_jsx_runtime.jsxs)("div", {
                                        className: m.transportRow,
                                        children: [
                                                (0, react_jsx_runtime.jsx)("button", {
                                                        type: "button",
                                                        className: m.transportBtn,
                                                        "data-active": form.transport === "stdio" ? "true" : "false",
                                                        onClick: () => set({ transport: "stdio" }),
                                                        children: t("transportStdio")
                                                }),
                                                (0, react_jsx_runtime.jsx)("button", {
                                                        type: "button",
                                                        className: m.transportBtn,
                                                        "data-active": form.transport === "streamable-http" ? "true" : "false",
                                                        onClick: () => set({ transport: "streamable-http" }),
                                                        children: t("transportHttp")
                                                })
                                        ]
                                }), false)
                        ];
                        if (form.transport === "stdio") {
                                fields.push(field(t("fieldCommand"), textInput(form.command, (value) => set({ command: value }), ""), true));
                                fields.push(field(t("fieldArgs"), textArea(form.argsText, (value) => set({ argsText: value }), ""), true));
                                fields.push(field(t("fieldEnv"), secretEditor(envKeys, deletedEnv, setDeletedEnv, form.envText, (value) => set({ envText: value }), ""), true));
                                fields.push(field(t("fieldCwd"), textInput(form.cwd, (value) => set({ cwd: value }), ""), false));
                        } else {
                                fields.push(field(t("fieldUrl"), textInput(form.url, (value) => set({ url: value }), ""), true));
                                fields.push(field(t("fieldHeaders"), secretEditor(headerKeys, deletedHeaders, setDeletedHeaders, form.headersText, (value) => set({ headersText: value }), ""), true));
                        }
                        fields.push((0, react_jsx_runtime.jsx)("div", {
                                className: m.field,
                                "data-wide": "true",
                                children: (0, react_jsx_runtime.jsx)("button", {
                                        type: "button",
                                        className: m.advancedToggle,
                                        onClick: () => setAdvancedOpen((value) => !value),
                                        children: (advancedOpen ? "▾ " : "▸ ") + t("advanced")
                                })
                        }));
                        if (advancedOpen) {
                                fields.push(field(t("fieldFailOnStartup"), (0, react_jsx_runtime.jsxs)("label", {
                                        className: m.checkRow,
                                        children: [
                                                (0, react_jsx_runtime.jsx)("input", {
                                                        type: "checkbox",
                                                        checked: !!form.failOnStartup,
                                                        onChange: (event) => set({ failOnStartup: event.target.checked })
                                                }),
                                                t("fieldFailOnStartup")
                                        ]
                                }), false));
                                fields.push(field(t("fieldReconnect"), (0, react_jsx_runtime.jsxs)("label", {
                                        className: m.checkRow,
                                        children: [
                                                (0, react_jsx_runtime.jsx)("input", {
                                                        type: "checkbox",
                                                        checked: !!form.reconnectEnabled,
                                                        onChange: (event) => set({ reconnectEnabled: event.target.checked })
                                                }),
                                                t("fieldReconnect")
                                        ]
                                }), false));
                                fields.push(field(t("fieldTimeout"), textInput(form.timeout, (value) => set({ timeout: value }), "60000"), false));
                                fields.push(field(t("fieldInitialDelay"), textInput(form.initialDelay, (value) => set({ initialDelay: value }), "500"), false));
                                fields.push(field(t("fieldMaxDelay"), textInput(form.maxDelay, (value) => set({ maxDelay: value }), "30000"), false));
                                fields.push(field(t("fieldMaxAttempts"), textInput(form.maxAttempts, (value) => set({ maxAttempts: value }), "10"), false));
                        }
                        return (0, react_jsx_runtime.jsx)("div", {
                                className: c.scopeOverlay,
                                role: "dialog",
                                "aria-modal": "true",
                                children: (0, react_jsx_runtime.jsxs)("div", {
                                        className: c.scopeBox,
                                        children: [
                                                (0, react_jsx_runtime.jsx)("h4", { children: editing ? t("editTitle") : t("newTitle") }),
                                                (0, react_jsx_runtime.jsx)("div", {
                                                        className: m.form,
                                                        children: fields
                                                }),
                                                error !== undefined && error !== null ? (0, react_jsx_runtime.jsx)("div", {
                                                        className: c.notice,
                                                        "data-kind": "error",
                                                        children: (0, react_jsx_runtime.jsx)("span", { className: c.noticeText, children: String(error) })
                                                }) : null,
                                                (0, react_jsx_runtime.jsxs)("div", {
                                                        className: c.scopeActions,
                                                        children: [
                                                                (0, react_jsx_runtime.jsx)("button", {
                                                                        type: "button",
                                                                        className: c.scopeAction + " " + c.scopeCancel,
                                                                        disabled: busy,
                                                                        onClick: onCancel,
                                                                        children: t("cancel")
                                                                }),
                                                                (0, react_jsx_runtime.jsx)("button", {
                                                                        type: "button",
                                                                        className: c.scopeAction + " " + c.scopeConfirm,
                                                                        disabled: busy,
                                                                        onClick: submit,
                                                                        children: t("save")
                                                                })
                                                        ]
                                                })
                                        ]
                                })
                        });
                }
                function McpSection({ t, listMcp, saveMcp, removeMcp, setEnabledMcp, testMcp, reloadMcp, checkUpdateRemote }) {
                        const [loadState, setLoadState] = react.useState({ kind: "loading" } as any);
                        const [data, setData] = react.useState(null);
                        const [request, setRequest] = react.useState(0);
                        const [editing, setEditing] = react.useState(null);
                        const [dialogBusy, setDialogBusy] = react.useState(false);
                        const [updateBanner, setUpdateBanner] = react.useState(null);
                        const [dialogError, setDialogError] = react.useState(null);
                        const [confirming, setConfirming] = react.useState(null);
                        const [testing, setTesting] = react.useState(null);
                        const [testResult, setTestResult] = react.useState(null);
                        react.useEffect(() => {
                                let cancelled = false;
                                listMcp().then((value) => {
                                        if (cancelled) return;
                                        setData(value);
                                        setLoadState({ kind: "ready" });
                                }).catch((error) => {
                                        if (cancelled) return;
                                        setLoadState({ kind: "error", message: String(error?.message ?? error) });
                                });
                                return () => { cancelled = true; };
                        }, [listMcp, request]);
                        react.useEffect(() => {
                                if (confirming === null) return;
                                const timer = setTimeout(() => setConfirming(null), 3000);
                                return () => clearTimeout(timer);
                        }, [confirming]);

                        react.useEffect(() => {
                                let current = true;
                                Promise.resolve().then(() => checkUpdateRemote()).then((snapshot) => {
                                        if (!current) return;
                                        const currentV = snapshot !== null && typeof snapshot === "object" && typeof snapshot.current === "string" ? snapshot.current : "";
                                        const latest = snapshot !== null && typeof snapshot === "object" && typeof snapshot.latest === "string" ? snapshot.latest : null;
                                        if (latest !== null && snapshot.updateAvailable === true) setUpdateBanner(t("checkUpdateAvailable") + latest + t("checkUpdateCurrent") + currentV + t("checkUpdateHint"));
                                }, () => {});
                                return () => { current = false; };
                        }, [checkUpdateRemote, t]);
                        const servers = data?.servers ?? [];
                        const external = data?.externalServers ?? [];
                        const patch = data?.patch ?? {};
                        const refresh = (quiet) => setRequest((value) => value + 1);
                        const stateLabel = (server) => {
                                if (!server.enabled) return t !== null ? "stateStopped" : "";
                                const phase = server.fiberPhase;
                                if (phase === "active") return "stateActive";
                                if (phase === "loading" || phase === "unloading") return "stateLoading";
                                if (phase === "failed") return "stateFailed";
                                if (phase === "pending") return "statePending";
                                return "stateUnknown";
                        };
                        const applySave = async (input, previousServerName) => {
                                setDialogBusy(true);
                                setDialogError(null);
                                try {
                                        const result = await saveMcp(input, previousServerName);
                                        setEditing(null);
                                        setTimeout(() => refresh(true), 500);
                                } catch (error: any) {
                                        setDialogError(String(error?.message ?? error));
                                } finally {
                                        setDialogBusy(false);
                                }
                        };
                        const applyToggle = async (server) => {
                                const previous = server.enabled;
                                const wanted = !previous;
                                setData((prev) => prev === null ? prev : { ...prev, servers: prev.servers.map((item) => item.serverName === server.serverName ? { ...item, enabled: wanted } : item) });
                                try {
                                        const next = await setEnabledMcp(server.serverName, wanted);
                                        setData((prev) => prev === null ? prev : { ...prev, servers: prev.servers.map((item) => item.serverName === next.serverName ? next : item) });
                                } catch (error: any) {
                                        setData((prev) => prev === null ? prev : { ...prev, servers: prev.servers.map((item) => item.serverName === server.serverName ? { ...item, enabled: previous } : item) });
                                        setLoadState({ kind: "error", message: String(error?.message ?? error) });
                                }
                        };
                        const applyRemove = async (server) => {
                                if (confirming !== server.serverName) {
                                        setConfirming(server.serverName);
                                        return;
                                }
                                setConfirming(null);
                                try {
                                        await removeMcp(server.serverName);
                                        setData((prev) => prev === null ? prev : { ...prev, servers: prev.servers.filter((item) => item.serverName !== server.serverName) });
                                } catch (error: any) {
                                        setLoadState({ kind: "error", message: String(error?.message ?? error) });
                                }
                        };
                        const applyTest = async (server) => {
                                setTesting(server.serverName);
                                setTestResult(null);
                                try {
                                        const result = await testMcp({ serverName: server.serverName });
                                        setTestResult({ serverName: server.serverName, result });
                                } catch (error: any) {
                                        setTestResult({ serverName: server.serverName, result: { ok: false, error: String(error?.message ?? error), tools: [] } });
                                } finally {
                                        setTesting(null);
                                }
                        };
                        const gearIcon = (0, react_jsx_runtime.jsxs)("svg", {
                                width: 14,
                                height: 14,
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: 1.8,
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                        (0, react_jsx_runtime.jsx)("circle", { cx: 12, cy: 12, r: 3 }),
                                        (0, react_jsx_runtime.jsx)("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
                                ]
                        });
                        const serverCard = (server, isExternal) => {
                                const state = stateLabel(server);
                                const dotOn = server.enabled && server.fiberPhase === "active";
                                const dotErr = server.fiberPhase === "failed";
                                return (0, react_jsx_runtime.jsxs)("div", {
                                        className: m.card,
                                        children: [(0, react_jsx_runtime.jsxs)("div", {
                                                className: m.cardTop,
                                                children: [(0, react_jsx_runtime.jsx)("span", { className: m.name, children: server.serverName }), (0, react_jsx_runtime.jsxs)("span", {
                                                        className: m.badges,
                                                        children: [(0, react_jsx_runtime.jsx)("span", { className: m.badge, children: server.transport === "streamable-http" ? "HTTP" : "STDIO" }), isExternal ? (0, react_jsx_runtime.jsx)("span", { className: m.badge, children: t("external") }) : null]
                                                }), (0, react_jsx_runtime.jsx)("span", { className: m.spacer }), isExternal ? null : (0, react_jsx_runtime.jsx)("button", {
                                                        type: "button",
                                                        className: m.iconBtn,
                                                        "aria-label": t("editTitle"),
                                                        onClick: () => { setDialogError(null); setEditing({ server }); },
                                                        children: gearIcon
                                                })]
                                        }), (0, react_jsx_runtime.jsxs)("div", {
                                                className: m.meta,
                                                children: [(0, react_jsx_runtime.jsx)("span", {
                                                        className: m.dot,
                                                        "data-on": server.enabled ? "true" : "false",
                                                        "data-err": server.fiberPhase === "failed" ? "true" : "false"
                                                }), (0, react_jsx_runtime.jsx)("span", { children: t !== null ? t("toolCount").replace("{count}", String(server.toolCount ?? 0)) : "" })]
                                        }), isExternal ? null : (0, react_jsx_runtime.jsxs)("div", {
                                                className: m.actions,
                                                children: [(0, react_jsx_runtime.jsxs)("span", {
                                                        className: c.switchRow,
                                                        children: [(0, react_jsx_runtime.jsx)("button", {
                                                                type: "button",
                                                                role: "switch",
                                                                className: c.switch,
                                                                "data-on": server.enabled ? "true" : void 0,
                                                                "aria-checked": server.enabled,
                                                                "aria-label": server.enabled ? t("disable") : t("enable"),
                                                                onClick: () => applyToggle(server),
                                                                children: (0, react_jsx_runtime.jsx)("span", { className: c.switchThumb })
                                                        }), (0, react_jsx_runtime.jsx)("span", { className: c.switchText, children: t !== null ? (server.enabled ? t("stateEnabled") : t("stateDisabled")) : "" })]
                                                }), (0, react_jsx_runtime.jsx)("span", { className: m.spacer }), (0, react_jsx_runtime.jsx)("button", {
                                                        type: "button",
                                                        className: m.actionBtn,
                                                        disabled: testing === server.serverName,
                                                        onClick: () => applyTest(server),
                                                        children: testing === server.serverName ? t !== null ? t("testing") : "" : t !== null ? t("test") : ""
                                                }), confirming === server.serverName ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
                                                        children: [
                                                                (0, react_jsx_runtime.jsx)("button", {
                                                                        type: "button",
                                                                        className: m.actionBtn,
                                                                        onClick: () => setConfirming(null),
                                                                        children: t !== null ? t("cancel") : ""
                                                                }),
                                                                (0, react_jsx_runtime.jsx)("button", {
                                                                        type: "button",
                                                                        className: m.dangerBtn,
                                                                        "data-confirm": "true",
                                                                        onClick: () => applyRemove(server),
                                                                        children: t !== null ? t("confirmDelete") : ""
                                                                })
                                                        ]
                                                }) : (0, react_jsx_runtime.jsx)("button", {
                                                        type: "button",
                                                        className: m.dangerBtn,
                                                        onClick: () => applyRemove(server),
                                                        children: t !== null ? t("delete") : ""
                                                })]
                                                                                }), testResult?.serverName === server.serverName ? (0, react_jsx_runtime.jsxs)("div", {
                                                className: m.result,
                                                "data-ok": testResult.result.ok ? "true" : "false",
                                                children: [testResult.result.ok ? t !== null ? t("testOk").replace("{count}", String(testResult.result.tools?.length ?? 0)) : "" : t !== null ? t("testFailed") + " " + (testResult.result.error ?? "") : "", testResult.result.ok && Array.isArray(testResult.result.tools) ? (0, react_jsx_runtime.jsx)("div", { children: testResult.result.tools.map((tool) => tool.name).join(", ") }) : null]
                                        }) : null]
                                }, server.serverName + (isExternal ? ":external" : ""));
                        };
                        return (0, react_jsx_runtime.jsxs)("div", {
                                className: m.section,
                                children: [(0, react_jsx_runtime.jsxs)("div", {
                                        className: m.head,
                                        children: [(0, react_jsx_runtime.jsx)("h3", { children: t !== null ? t("title") : "" }), (0, react_jsx_runtime.jsx)("button", {
                                                type: "button",
                                                className: m.actionBtn,
                                                onClick: () => { reloadMcp().then((value) => { setData(value); }).catch(() => refresh(true)); },
                                                children: t !== null ? t("refresh") : ""
                                        })]
                                }), (0, react_jsx_runtime.jsx)("p", { className: m.sub, children: t !== null ? t("subtitle") : "" }), updateBanner !== null ? (0, react_jsx_runtime.jsxs)("div", {
                                        className: c.notice,
                                        "data-kind": "info",
                                        role: "status",
                                        children: [(0, react_jsx_runtime.jsx)("span", { className: c.noticeText, children: updateBanner }), (0, react_jsx_runtime.jsx)("button", {
                                                type: "button",
                                                className: c.noticeButton,
                                                onClick: () => { setUpdateBanner(null); },
                                                children: t !== null ? t("close") : ""
                                        })]
                                }) : null, patch?.ok === false ? (0, react_jsx_runtime.jsxs)("div", {
                                        className: c.notice,
                                        "data-kind": "error",
                                        children: [(0, react_jsx_runtime.jsx)("span", { className: c.noticeText, children: t !== null ? t("patchBroken") + " " + (patch.error ?? "") : "" }), (0, react_jsx_runtime.jsx)("button", {
                                                type: "button",
                                                className: c.noticeButton,
                                                onClick: () => refresh(true),
                                                children: t !== null ? t("retry") : ""
                                        })]
                                }) : null, loadState.kind === "error" ? (0, react_jsx_runtime.jsxs)("div", {
                                        className: c.notice,
                                        "data-kind": "error",
                                        children: [(0, react_jsx_runtime.jsx)("span", { className: c.noticeText, children: loadState.message }), (0, react_jsx_runtime.jsx)("button", {
                                                type: "button",
                                                className: c.noticeButton,
                                                onClick: () => refresh(true),
                                                children: t !== null ? t("retry") : ""
                                        })]
                                }) : null, (0, react_jsx_runtime.jsx)("div", {
                                        className: m.toolbar,
                                        children: (0, react_jsx_runtime.jsx)("button", {
                                                type: "button",
                                                className: m.add,
                                                onClick: () => { setDialogError(null); setEditing({ server: null }); },
                                                children: t !== null ? t("add") : ""
                                        })
                                }), loadState.kind === "loading" && servers.length === 0 ? (0, react_jsx_runtime.jsx)("p", { className: m.sub, children: t !== null ? t("loading") : "" }) : null, servers.length === 0 && external.length === 0 && loadState.kind === "ready" ? (0, react_jsx_runtime.jsx)("p", { className: m.sub, children: t !== null ? t("empty") : "" }) : null, (0, react_jsx_runtime.jsxs)("div", {
                                        className: m.cards,
                                        children: [...servers.map((server) => serverCard(server, false)), ...external.map((server) => serverCard(server, true))]
                                }), editing !== null ? (0, react_jsx_runtime.jsx)(McpFormDialog, {
                                        t: t !== null ? t : (key) => key,
                                        initial: editing.server,
                                        onSave: applySave,
                                        onCancel: () => setEditing(null),
                                        busy: dialogBusy,
                                        error: dialogError
                                }) : null]
                        });
                }

// ── Workbench 应用图标 ───────────────────────────────────────────────
// 由 assets/icon.png、assets/mcp-icon.png 描摹而来：16x16 viewBox、
// 单条 evenodd 填充路径、fill=currentColor，随主题色与 16px 槽位缩放。
const SKILLS_ICON_PATH = "M3.00 0.38 L2.50 0.62 L1.62 1.75 L1.62 14.25 L2.00 14.62 L1.88 14.75 L3.00 15.62 L12.75 15.62 L13.25 15.38 L14.12 14.25 L14.12 5.25 L9.25 0.38 Z M3.00 1.38 L2.62 1.75 L2.62 14.25 L3.00 14.62 L12.75 14.62 L13.25 14.12 L13.25 5.88 L13.00 5.62 L9.75 5.62 L9.25 5.38 L8.62 4.50 L8.75 1.62 L8.50 1.38 Z M9.50 2.12 L9.38 3.75 L9.75 4.62 L10.25 4.88 L12.38 4.75 L9.75 2.12 Z M4.75 7.62 L4.38 8.00 L4.75 8.62 L11.00 8.62 L11.38 8.25 L11.00 7.62 Z M4.75 9.88 L4.38 10.25 L4.50 10.62 L10.38 10.50 L10.25 9.88 Z M4.75 11.88 L4.38 12.25 L4.75 12.88 L8.25 12.88 L8.62 12.50 L8.00 11.88 Z";
const MCP_ICON_PATH = "M9.00 0.12 L7.75 0.62 L1.12 7.25 L1.12 7.75 L1.75 7.88 L8.25 1.38 L8.75 1.12 L10.00 1.38 L10.75 2.12 L10.62 2.50 L10.88 2.75 L10.62 3.00 L10.75 3.38 L10.38 3.75 L10.50 3.88 L6.50 7.88 L6.25 7.88 L5.38 9.00 L6.00 9.38 L7.00 8.62 L11.25 4.38 L12.25 4.12 L12.50 4.38 L13.00 4.38 L13.50 4.88 L13.38 5.00 L14.00 5.88 L13.62 6.25 L13.75 6.62 L8.00 12.38 L7.75 12.38 L7.38 13.00 L7.62 14.25 L8.75 15.38 L9.50 15.38 L9.62 15.00 L8.38 13.75 L8.38 13.25 L14.38 7.25 L14.62 6.75 L14.62 5.00 L13.50 3.62 L11.75 3.38 L11.38 1.50 L10.25 0.38 Z M9.00 2.38 L4.12 7.00 L4.25 7.12 L3.38 8.25 L3.38 9.50 L3.75 9.88 L3.88 10.50 L5.25 11.38 L6.75 11.38 L7.25 11.12 L12.62 6.00 L12.62 5.75 L12.00 5.38 L6.75 10.38 L6.25 10.38 L6.00 10.62 L5.75 10.38 L5.25 10.38 L4.38 9.50 L4.38 8.25 L4.62 7.75 L9.62 3.00 L9.62 2.75 Z";
function workbenchIcon(path, tag) {
	return function WorkbenchIcon(props) {
		const size = props !== null && props !== undefined && typeof props.size === "number" ? props.size : 16;
		return (0, react_jsx_runtime.jsx)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			width: size,
			height: size,
			viewBox: "0 0 16 16",
			fill: "currentColor",
			"aria-hidden": "true",
			focusable: "false",
			className: props !== null && props !== undefined ? props.className : undefined,
			"data-dsh-better-workbench-skill-mcp-panels-icon": tag,
			children: (0, react_jsx_runtime.jsx)("path", { fillRule: "evenodd", d: path })
		});
	};
}
const SkillsWorkbenchIcon = workbenchIcon(SKILLS_ICON_PATH, "skills");
const McpWorkbenchIcon = workbenchIcon(MCP_ICON_PATH, "mcp");

// ── cordis 插件体 ─────────────────────────────────────────────────────
export const inject = ["locale", "remote", "sessions", "workbench"];

export function apply(ctx: any): void {
	// 字典注册（生命周期随插件 fiber）
	ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-better-workbench-skill-mcp-panels: skill dictionaries");
	ctx.effect(() => ctx.locale.register(MCP_NS, { zh: mcpZh, en: mcpEn }), "dsh-better-workbench-skill-mcp-panels: mcp dictionaries");


	const t = ctx.locale.bind(NS);
	const mt = ctx.locale.bind(MCP_NS);
	// 挂载远程贡献；所有远程调用都等待挂载完成后再取命名空间服务。
	const mount = ctx.remote.$mount(CONTRIBUTION);
	const currentSessionId = () => {
		// 桌面外壳的 sessions 服务并非所有版本都有 currentProvideInfo
		//（DSH Desktop 2.0.4 就没有），直接链式调用会抛同步 TypeError，
		// 技能页因此整体显示“暂时无法读取技能”。改为逐级特性探测：
		// currentProvideInfo → selection（持久化选择 store，快照含
		// sessionId）→ list（快照 current 为会话 id）；都取不到时返回
		// undefined——服务端把 sessionId 视为可选，将回退全局注册表
		// 并自行枚举工作区，仅丢失会话级项目作用域，功能可用。
		const sessions = ctx.get("sessions");
		const store = sessions?.currentProvideInfo ?? sessions?.selection ?? sessions?.list;
		const snapshot = store !== null && typeof store === "object" && typeof store.getSnapshot === "function" ? store.getSnapshot() : undefined;
		const direct = snapshot?.sessionId;
		if (typeof direct === "string" && direct !== "")
			return direct;
		const current = snapshot?.current;
		return typeof current === "string" && current !== "" ? current : undefined;
	};
	const callRemote = async (method, ...args) => {
		await mount;
		const remote = ctx.get("remote.skillsViewer");
		const result = await remote[method](...args);
		if (!result.ok) throw new Error("skillsViewer." + method + " failed: " + result.error.code + ": " + result.error.message);
		return result.value;
	};
	const callMcp = async (method, ...args) => {
		await mount;
		const remote = ctx.get("remote.mcpManager");
		const result = await remote[method](...args);
		if (!result.ok) throw new Error("mcpManager." + method + " failed: " + result.error.code + ": " + result.error.message);
		return result.value;
	};
	const sectionFace = () => ({
		currentSessionId,
		listSkills: () => callRemote("list", currentSessionId()),
		listWorkspaces: () => callRemote("workspaces"),
		loadContent: (name, scope) => callRemote("content", name, currentSessionId(), scope),
		setSkillEnabled: (name, enabled, scope) => callRemote("setEnabled", name, currentSessionId(), enabled, scope),
		batchMigrateSkill: (payload) => callRemote("batchMigrate", currentSessionId(), payload),
		checkUpdateRemote: () => callRemote("checkUpdate"),
		removeSkill: (name, scope) => callRemote("deleteSkill", name, currentSessionId(), scope),
		addSkill: (payload) => callRemote("addSkill", currentSessionId(), payload)
	});
	const mcpSectionFace = () => ({
		listMcp: () => callMcp("list"),
		saveMcp: (input, previousServerName) => callMcp("save", { input, previousServerName }),
		removeMcp: (serverName) => callMcp("removeServer", { serverName }),
		setEnabledMcp: (serverName, enabled) => callMcp("setEnabled", { serverName, enabled }),
		testMcp: (payload) => callMcp("test", payload),
		reloadMcp: () => callMcp("reload")
	});
	// face 只构建一次：SkillsSection / McpSection 的 useEffect 依赖这些回调
	// 标识，每次渲染新建会导致重复请求。
	const skillsFace = { ...sectionFace(), t };
	const mcpFace = { ...mcpSectionFace(), checkUpdateRemote: () => callRemote("checkUpdate"), t: mt };
	const workbenchPage = (app, Section, face) => function WorkbenchPage(props) {
		return (0, react_jsx_runtime.jsx)("div", {
			className: "SKV_wbPage",
			"data-workbench-app": app,
			children: (0, react_jsx_runtime.jsx)(Section, { ...props, ...face })
		});
	};
	const workbenchConfig = {
		version: 1,
		defaults: () => ({}),
		validate(config) {
			if (Object.keys(config).length !== 0) throw new Error("Workbench 页面实例配置必须为空对象");
		}
	};
	const registerWorkbenchPage = (definition) => ctx.effect(
		() => ctx.workbench.registerApp({
			protocolVersion: 1,
			allowMultiple: false,
			config: workbenchConfig,
			presentations: [{ kind: "page", conversation: "exclusive" }],
			defaultPresentation: "page",
			...definition
		}),
		"dsh-better-workbench-skill-mcp-panels: " + definition.appId
	);
	registerWorkbenchPage({
		appId: "dsh-better-workbench-skill-mcp-panels:skills",
		title: t("nav"),
		description: t("wbSubtitle"),
		renderIcon: SkillsWorkbenchIcon,
		defaultInstance: { instanceId: "dsh-better-workbench-skill-mcp-panels-skills", title: t("nav") },
		renderMain: workbenchPage("skills", SkillsSection, skillsFace)
	});
	registerWorkbenchPage({
		appId: "dsh-better-workbench-skill-mcp-panels:mcp",
		title: mt("nav"),
		description: mt("subtitle"),
		renderIcon: McpWorkbenchIcon,
		defaultInstance: { instanceId: "dsh-better-workbench-skill-mcp-panels-mcp", title: mt("nav") },
		renderMain: workbenchPage("mcp", McpSection, mcpFace)
	});
}
