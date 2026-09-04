window.__ModuleLoader__.load({
	id: "dsh-workbench-design-board",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/DesignBoard.tsx
		const SECTION_GROUPS = [
			{
				label: "总览",
				sections: [{
					id: "overview",
					label: "系统总览",
					icon: _deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16
				}]
			},
			{
				label: "基础资源",
				sections: [
					{
						id: "foundations",
						label: "颜色与字体",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16
					},
					{
						id: "icons",
						label: "图标",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16
					},
					{
						id: "primitives",
						label: "基础组件",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16
					}
				]
			},
			{
				label: "规范",
				sections: [
					{
						id: "states",
						label: "状态与响应式",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16
					},
					{
						id: "accessibility",
						label: "无障碍",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16
					},
					{
						id: "governance",
						label: "实现记录",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconInspectOutline12
					}
				]
			},
			{
				label: "产品页面",
				sections: [
					{
						id: "shell",
						label: "应用框架",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16
					},
					{
						id: "sidebar",
						label: "侧边栏",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconFolderOpen16
					},
					{
						id: "settings",
						label: "设置弹窗",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconSettingsOutline16
					},
					{
						id: "session",
						label: "会话标题栏",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutline16
					},
					{
						id: "chat",
						label: "对话流",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconNewChatOutline16
					},
					{
						id: "composer",
						label: "输入区",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16
					},
					{
						id: "trajectory",
						label: "轨迹",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconDataOutline16
					},
					{
						id: "overlays",
						label: "浮层与全局反馈",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16
					}
				]
			}
		];
		const SECTIONS = SECTION_GROUPS.flatMap((group) => group.sections);
		const TOKEN_GROUPS = [
			{
				title: "表面与边界",
				source: "theme semantic aliases",
				tokens: [
					{
						token: "--dsw-alias-bg-base",
						label: "基础表面",
						usage: "应用和对话主工作面"
					},
					{
						token: "--dsw-alias-bg-layer-1",
						label: "第一层表面",
						usage: "输入与基础浮起面"
					},
					{
						token: "--dsw-alias-bg-layer-2",
						label: "第二层表面",
						usage: "设置与模块面板"
					},
					{
						token: "--dsw-alias-bg-layer-3",
						label: "第三层表面",
						usage: "菜单和更高层浮起面"
					},
					{
						token: "--dsw-alias-bg-overlay",
						label: "浮层表面",
						usage: "遮罩上的浮层"
					},
					{
						token: "--dsw-alias-bg-mask-1",
						label: "第一层遮罩",
						usage: "普通阻断遮罩"
					},
					{
						token: "--dsw-alias-bg-mask-2",
						label: "第二层遮罩",
						usage: "轻量遮罩和背景压暗"
					},
					{
						token: "--dsw-alias-bg-mask-3",
						label: "第三层遮罩",
						usage: "更强的阻断遮罩"
					},
					{
						token: "--dsw-alias-bg-mask-photo",
						label: "图片遮罩",
						usage: "图片内容上的强遮罩"
					},
					{
						token: "--dsw-alias-bg-mask-drop",
						label: "拖拽遮罩",
						usage: "拖拽进入时的覆盖层"
					},
					{
						token: "--dsw-alias-bg-module-platform",
						label: "平台模块背景",
						usage: "平台模块背景"
					},
					{
						token: "--dsw-alias-bg-multi-select",
						label: "多选背景",
						usage: "多选区域背景"
					},
					{
						token: "--dsw-alias-bg-skeleton",
						label: "骨架屏背景",
						usage: "加载占位区域"
					},
					{
						token: "--dsw-alias-border-inverted2",
						label: "第二级反色边界",
						usage: "反色表面的弱边界"
					},
					{
						token: "--dsw-alias-border-inverted",
						label: "反色边界",
						usage: "反色表面的边界"
					},
					{
						token: "--dsw-alias-border-l1",
						label: "第一层边界",
						usage: "弱分组边界"
					},
					{
						token: "--dsw-alias-border-l2-darkmode-thin",
						label: "暗色细第二层边界",
						usage: "暗色主题的细控件边界"
					},
					{
						token: "--dsw-alias-border-l2",
						label: "第二层边界",
						usage: "控件和面板边界"
					},
					{
						token: "--dsw-alias-border-l3",
						label: "第三层边界",
						usage: "焦点与强调边界"
					},
					{
						token: "--dsw-alias-border-l4",
						label: "第四层边界",
						usage: "更强的分隔和拖拽边界"
					},
					{
						token: "--dsw-alias-scrollbar-bg-l1",
						label: "第一层滚动条",
						usage: "普通内容滚动条滑块"
					},
					{
						token: "--dsw-alias-scrollbar-bg-l2",
						label: "第二层滚动条",
						usage: "菜单和浮层滚动条滑块"
					},
					{
						token: "--dsw-alias-scrollbar-hover-l1",
						label: "第一层滚动条悬停",
						usage: "普通内容滚动条悬停"
					},
					{
						token: "--dsw-alias-scrollbar-hover-l2",
						label: "第二层滚动条悬停",
						usage: "菜单和浮层滚动条悬停"
					}
				]
			},
			{
				title: "文字与交互",
				source: "theme semantic aliases",
				tokens: [
					{
						token: "--dsw-alias-label-primary",
						label: "主要文字",
						usage: "标题与主要正文"
					},
					{
						token: "--dsw-alias-label-primary-bluish",
						label: "冷色主要文字",
						usage: "需要冷色前景的主要文字"
					},
					{
						token: "--dsw-alias-label-primary-dimmed",
						label: "弱化主要文字",
						usage: "弱化的主要文字"
					},
					{
						token: "--dsw-alias-label-secondary",
						label: "次要文字",
						usage: "次级说明与控件"
					},
					{
						token: "--dsw-alias-label-tertiary",
						label: "第三级文字",
						usage: "元数据与摘要"
					},
					{
						token: "--dsw-alias-label-caption",
						label: "说明文字",
						usage: "弱提示和占位"
					},
					{
						token: "--dsw-alias-label-dimmed",
						label: "弱化辅助文字",
						usage: "最低优先级的辅助信息"
					},
					{
						token: "--dsw-alias-label-primary-foreground",
						label: "主要填充前景",
						usage: "主要填充色上的前景文字"
					},
					{
						token: "--dsw-alias-label-primary-inverted",
						label: "反色主要文字",
						usage: "反色表面的主要文字"
					},
					{
						token: "--dsw-alias-brand-primary-invert",
						label: "反色品牌主色",
						usage: "品牌反色配对前景"
					},
					{
						token: "--dsw-alias-brand-primary-new-colorprimary-new-color",
						label: "新品牌主色",
						usage: "源码中的品牌色兼容命名"
					},
					{
						token: "--dsw-alias-brand-primary",
						label: "品牌主色",
						usage: "品牌主色；不是链接蓝"
					},
					{
						token: "--dsw-alias-brand-text",
						label: "品牌文字",
						usage: "品牌文字；不是链接蓝"
					},
					{
						token: "--dsw-alias-interactive-bg-hover",
						label: "悬停背景",
						usage: "列表和图标悬停"
					},
					{
						token: "--dsw-alias-interactive-bg-hover-accent",
						label: "强调悬停背景",
						usage: "带业务强调的悬停"
					},
					{
						token: "--dsw-alias-interactive-bg-hover-solid",
						label: "不透明悬停背景",
						usage: "需要不透明悬停面的控件"
					},
					{
						token: "--dsw-alias-interactive-bg-active",
						label: "激活背景",
						usage: "按下或当前激活状态"
					},
					{
						token: "--dsw-alias-interactive-bg-hover-danger",
						label: "危险悬停背景",
						usage: "破坏性操作悬停"
					},
					{
						token: "--dsw-alias-button-contrast-fill",
						label: "高对比度填充",
						usage: "高对比度按钮填充"
					},
					{
						token: "--dsw-alias-button-elevated-fill",
						label: "抬升按钮填充",
						usage: "有边界的次级按钮表面"
					},
					{
						token: "--dsw-alias-button-floating-fill",
						label: "浮动按钮填充",
						usage: "浮动操作按钮表面"
					},
					{
						token: "--dsw-alias-button-floating-hover",
						label: "浮动按钮悬停",
						usage: "浮动操作按钮悬停"
					},
					{
						token: "--dsw-alias-button-ghost-active-border",
						label: "幽灵按钮激活边界",
						usage: "幽灵按钮激活边界"
					},
					{
						token: "--dsw-alias-button-ghost-active-fill",
						label: "幽灵按钮激活填充",
						usage: "幽灵按钮激活填充"
					},
					{
						token: "--dsw-alias-button-ghost-hover",
						label: "幽灵按钮悬停",
						usage: "幽灵按钮悬停"
					},
					{
						token: "--dsw-alias-button-info-fill",
						label: "信息按钮填充",
						usage: "发送、确认等主要动作"
					},
					{
						token: "--dsw-alias-button-info-hover",
						label: "信息按钮悬停",
						usage: "主要动作悬停"
					},
					{
						token: "--dsw-alias-button-primary-dimmed",
						label: "Primary dimmed",
						usage: "弱化的主要按钮"
					},
					{
						token: "--dsw-alias-button-primary-fill",
						label: "Primary",
						usage: "主要按钮填充"
					},
					{
						token: "--dsw-alias-button-primary-hover",
						label: "Primary hover",
						usage: "主要按钮悬停"
					},
					{
						token: "--dsw-alias-button-tool-bar-fill-invisible",
						label: "Toolbar invisible",
						usage: "工具栏透明填充"
					},
					{
						token: "--dsw-alias-button-tool-bar-fill",
						label: "Toolbar",
						usage: "工具栏按钮填充"
					},
					{
						token: "--dsw-alias-button-tool-bar-hover",
						label: "Toolbar hover",
						usage: "工具栏按钮悬停"
					}
				]
			},
			{
				title: "状态与内容",
				source: "theme semantic aliases",
				tokens: [
					{
						token: "--dsw-alias-state-business-primary",
						label: "Business",
						usage: "品牌动作、选中和进行中"
					},
					{
						token: "--dsw-alias-state-business-tertiary",
						label: "Business tertiary",
						usage: "品牌状态的浅色背景"
					},
					{
						token: "--dsw-alias-state-warn-primary",
						label: "Warning",
						usage: "等待用户处理或注意"
					},
					{
						token: "--dsw-alias-state-warn-secondary",
						label: "Warning secondary",
						usage: "警告辅助背景或边界"
					},
					{
						token: "--dsw-alias-state-warn-tertiary",
						label: "Warning tertiary",
						usage: "弱警告背景"
					},
					{
						token: "--dsw-alias-state-warn-label",
						label: "Warning label",
						usage: "警告文字"
					},
					{
						token: "--dsw-alias-state-error-primary",
						label: "Error",
						usage: "错误、失败和删除动作"
					},
					{
						token: "--dsw-alias-state-error-secondary",
						label: "Error secondary",
						usage: "错误辅助背景或边界"
					},
					{
						token: "--dsw-alias-state-success-primary",
						label: "Success",
						usage: "完成和成功反馈"
					},
					{
						token: "--dsw-alias-state-success-secondary",
						label: "Success secondary",
						usage: "成功辅助背景或边界"
					},
					{
						token: "--dsw-alias-state-success-tertiary",
						label: "Success tertiary",
						usage: "弱成功背景"
					},
					{
						token: "--dsw-alias-markdown-code-block",
						label: "Code block",
						usage: "代码块背景"
					},
					{
						token: "--dsw-alias-markdown-code-block-banner",
						label: "Code block banner",
						usage: "代码块标题栏背景"
					},
					{
						token: "--dsw-alias-markdown-inline-code",
						label: "Inline code",
						usage: "行内代码背景"
					},
					{
						token: "--dsw-alias-markdown-code-segment-selected",
						label: "Code selected",
						usage: "代码选中片段"
					},
					{
						token: "--dsw-alias-markdown-code-segment-unselected",
						label: "Code unselected",
						usage: "代码未选中片段"
					},
					{
						token: "--dsw-alias-markdown-citation",
						label: "Citation",
						usage: "引用标记背景"
					},
					{
						token: "--dsw-alias-markdown-placeholder",
						label: "Placeholder",
						usage: "Markdown 占位内容"
					},
					{
						token: "--dsw-alias-markdown-tag",
						label: "Tag",
						usage: "Markdown 标签内容"
					},
					{
						token: "--dsw-alias-toast-bg",
						label: "Toast",
						usage: "全局 Toast 表面"
					},
					{
						token: "--dsw-alias-tooltip-bg",
						label: "Tooltip",
						usage: "Tooltip 和提示内容"
					}
				]
			},
			{
				title: "产品专用表面",
				source: "theme specific aliases",
				tokens: [
					{
						token: "--dsw-specific-bubble-highlight",
						label: "Bubble highlight",
						usage: "用户消息气泡的高亮层"
					},
					{
						token: "--dsw-specific-bubble",
						label: "Bubble",
						usage: "用户消息气泡"
					},
					{
						token: "--dsw-specific-input-major",
						label: "Input major",
						usage: "对话 Composer 表面"
					},
					{
						token: "--dsw-specific-login-input",
						label: "Login input",
						usage: "登录表单输入表面"
					},
					{
						token: "--dsw-specific-menu",
						label: "Menu",
						usage: "菜单组件表面"
					},
					{
						token: "--dsw-specific-selector",
						label: "Selector",
						usage: "Composer 添加按钮"
					},
					{
						token: "--dsw-specific-sidebar-fill",
						label: "Sidebar fill",
						usage: "侧栏产品模块"
					},
					{
						token: "--dsw-specific-sidebar-nav-item-active-accent",
						label: "Sidebar active accent",
						usage: "侧栏导航选中的强调层"
					},
					{
						token: "--dsw-specific-sidebar-nav-item-active",
						label: "Sidebar active",
						usage: "侧栏导航选中"
					},
					{
						token: "--dsw-specific-sidebar-nav-item-hover",
						label: "Sidebar hover",
						usage: "侧栏导航悬停"
					},
					{
						token: "--dsw-specific-tip",
						label: "Tip",
						usage: "任务、目标和队列提示条"
					}
				]
			}
		];
		const FOUNDATION_LAYERS = [
			[
				"基础基元",
				":root",
				"字体栈、代码字体、基础缓动曲线和过渡时长",
				"提供全局基线，不直接提供页面颜色。"
			],
			[
				"原始色阶",
				"body / body[data-ds-dark-theme]",
				"73 个琥珀色、蓝色、深度求索色、绿色、中性色、中性蓝灰色和红色色阶",
				"只作为语义别名的映射源；原始色阶名称不保证跨主题值绝对不变。"
			],
			[
				"语义别名",
				"body / body[data-ds-dark-theme]",
				"背景、边界、文字、按钮、状态和 Markdown 等语义角色",
				"组件优先消费这一层；主题切换只替换语义值。"
			],
			[
				"产品专用表面",
				"body / body[data-ds-dark-theme]",
				"侧栏、输入区、消息气泡、菜单、选择器和提示条等产品表面",
				"只在命名的产品模块使用，不推广为通用颜色。"
			],
			[
				"专项资源",
				"全局样式表",
				"语法高亮、滚动条、阴影、渐变文字",
				"只服务代码高亮、滚动条、层级或特定文字状态。"
			]
		];
		const STATIC_FAMILY_LABELS = {
			amber: "琥珀色",
			blue: "蓝色",
			deepseek: "深度求索色",
			green: "绿色",
			neutral: "中性色",
			"neutral-bluish": "中性蓝灰色",
			red: "红色"
		};
		const STATIC_FAMILIES = [
			["amber", [
				"100",
				"400",
				"500",
				"600",
				"900"
			]],
			["blue", [
				"50",
				"50p",
				"75",
				"100",
				"300",
				"400",
				"450",
				"500",
				"600",
				"800",
				"900",
				"950"
			]],
			["deepseek", [
				"50",
				"100",
				"200",
				"300",
				"400",
				"450",
				"500",
				"600",
				"700-delete",
				"800",
				"900"
			]],
			["green", [
				"100",
				"400",
				"500",
				"900"
			]],
			["neutral", [
				"00",
				"50",
				"100",
				"150",
				"200",
				"250",
				"300",
				"400",
				"500",
				"550",
				"600",
				"700",
				"800",
				"850",
				"900",
				"1000"
			]],
			["neutral-bluish", [
				"00",
				"50",
				"60",
				"75",
				"100",
				"150",
				"200",
				"300",
				"400",
				"500",
				"600",
				"700",
				"750",
				"800",
				"850",
				"875",
				"900",
				"950",
				"1000"
			]],
			["red", [
				"50",
				"100",
				"400",
				"500",
				"600",
				"900"
			]]
		];
		const FOUNDATION_THEME_RULES = [
			[
				"表面层级",
				"浅色：基础 / 第一层 / 第二层 / 第三层当前均为白；深色：中性蓝灰 950 / 875 / 850 / 800",
				"层级由语义名称和组件关系决定，不能依赖浅色主题的色差。"
			],
			[
				"文字阶梯",
				"主要文字 → 次要文字 → 第三级文字 → 说明文字",
				"标题和正文使用主要文字；说明和元数据逐级降低，不用透明度临时调灰。"
			],
			[
				"品牌与蓝色",
				"品牌主色与品牌文字接近黑或白；业务主色与信息按钮填充才是蓝色动作",
				"链接、发送和进行中状态使用对应业务蓝色，不把品牌色当作链接色。"
			],
			[
				"边界对比",
				"浅色使用黑色透明度；深色使用白色透明度",
				"第一至第四层边界代表强度；组件选择层级，不直接复制透明度。"
			],
			[
				"状态颜色",
				"业务、成功、警告、错误各有主要、辅助、弱背景或文字角色",
				"状态颜色必须与文案或图标一起表达，不能只靠颜色区分。"
			],
			[
				"遮罩与前景",
				"遮罩使用背景遮罩；主要填充前景和反色主要文字只与对应表面配对",
				"不要把前景 token 当普通正文颜色，也不要用黑色临时覆盖弹窗。"
			],
			[
				"代码专项",
				"Markdown 专用资源服务文档内容；语法高亮变量只服务代码着色",
				"代码背景、行内代码、引用和语法色与普通 UI 表面分开。"
			],
			[
				"滚动条",
				"普通内容绑定第一层；菜单和弹窗等抬升表面重新绑定第二层",
				"滚动条变量是渲染桥接，不是新增色阶。"
			]
		];
		const TYPE_ROWS = [
			{
				token: "--dsw-font-markdown-h1",
				label: "Markdown H1",
				metric: "24 / 34 · 700",
				specimen: "产品模块标题",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-h2",
				label: "Markdown H2",
				metric: "22 / 32 · 700",
				specimen: "模块内大标题",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-h3",
				label: "Markdown H3",
				metric: "20 / 30 · 700",
				specimen: "内容层级标题",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-h4",
				label: "Markdown H4",
				metric: "16 / 28 · 600",
				specimen: "段落内标题",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-base",
				label: "Markdown 正文",
				metric: "16 / 28 · 400",
				specimen: "连续助手回答与文档内容",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-base-strong",
				label: "Markdown 强调",
				metric: "16 / 28 · 600",
				specimen: "重要正文内容",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-base-italic",
				label: "Markdown 斜体",
				metric: "16 / 28 · 400 italic",
				specimen: "补充说明内容",
				status: "仅声明"
			},
			{
				token: "--dsw-font-markdown-base-strong-italic",
				label: "Markdown 粗斜体",
				metric: "16 / 28 · 600 italic",
				specimen: "强调的补充说明",
				status: "仅声明"
			},
			{
				token: "--dsw-font-markdown-table",
				label: "Markdown 表格",
				metric: "15 / 25 · 400",
				specimen: "表格正文内容",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-table-head",
				label: "Markdown 表头",
				metric: "15 / 25 · 500",
				specimen: "表格列标题",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-small",
				label: "Markdown 小号",
				metric: "14 / 24 · 400",
				specimen: "折叠内容和辅助正文",
				status: "仅声明"
			},
			{
				token: "--dsw-font-markdown-small-strong",
				label: "Markdown 小号强调",
				metric: "14 / 24 · 600",
				specimen: "小号重点内容",
				status: "仅声明"
			},
			{
				token: "--dsw-font-markdown-small-italic",
				label: "Markdown 小号斜体",
				metric: "14 / 24 · 400 italic",
				specimen: "小号补充说明",
				status: "仅声明"
			},
			{
				token: "--dsw-font-markdown-small-strong-italic",
				label: "Markdown 小号粗斜体",
				metric: "14 / 24 · 600 italic",
				specimen: "小号强调说明",
				status: "仅声明"
			},
			{
				token: "--dsw-font-markdown-code",
				label: "行内代码",
				metric: "14 / 22 · code",
				specimen: "src/client/index.ts",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-code-block",
				label: "代码块",
				metric: "13 / 22 · code",
				specimen: "pnpm run build",
				status: "已消费"
			},
			{
				token: "--dsw-font-markdown-code-block-small",
				label: "紧凑代码",
				metric: "12 / 18 · code",
				specimen: "role=\"treeitem\"",
				status: "已消费"
			},
			{
				token: "--dsw-font-xl-24",
				label: "UI XL",
				metric: "24 / 32 · 600",
				specimen: "大型浮层标题",
				status: "仅声明"
			},
			{
				token: "--dsw-font-l-20",
				label: "UI L",
				metric: "20 / 28 · 500",
				specimen: "浮层说明标题",
				status: "已消费"
			},
			{
				token: "--dsw-font-m-18",
				label: "UI M",
				metric: "16 / 28 · 500",
				specimen: "名称含 18，实际字号 16px",
				status: "仅声明"
			},
			{
				token: "--dsw-font-base-16",
				label: "UI Base",
				metric: "16 / 24 · 400",
				specimen: "发消息或做任务…",
				status: "仅声明"
			},
			{
				token: "--dsw-font-base-strong-16",
				label: "UI Base 强调",
				metric: "16 / 24 · 500",
				specimen: "正在执行任务",
				status: "仅声明"
			},
			{
				token: "--dsw-font-s-14",
				label: "列表 / 工具标题",
				metric: "14 / 22 · 400",
				specimen: "分析工作区插件层级与功能",
				status: "已消费"
			},
			{
				token: "--dsw-font-s-strong-14",
				label: "列表强调",
				metric: "14 / 22 · 500",
				specimen: "当前工作区",
				status: "已消费"
			},
			{
				token: "--dsw-font-xs-13",
				label: "控件 / 辅助信息",
				metric: "13 / 20 · 400",
				specimen: "DeepSeek V3.2 · 工具调用",
				status: "已消费"
			},
			{
				token: "--dsw-font-xs-strong-13",
				label: "控件强调",
				metric: "13 / 20 · 500",
				specimen: "对话 / 轨迹",
				status: "已消费"
			},
			{
				token: "--dsw-font-xxs-12",
				label: "紧凑元信息",
				metric: "12 / 18 · 400",
				specimen: "刚刚 · 2,304 tokens",
				status: "已消费"
			},
			{
				token: "--dsw-font-xxs-strong-12",
				label: "紧凑强调",
				metric: "12 / 18 · 500",
				specimen: "进行中",
				status: "仅声明"
			},
			{
				token: "--dsw-font-xxxs-11",
				label: "极小元信息",
				metric: "11 / 14 · 400",
				specimen: "状态说明",
				status: "已消费"
			},
			{
				token: "--dsw-font-xxxs-strong-11",
				label: "极小强调",
				metric: "11 / 14 · 500",
				specimen: "分组标签",
				status: "仅声明"
			}
		];
		const TYPE_LABEL_ZH = {
			"Markdown H1": "内容一级标题",
			"Markdown H2": "内容二级标题",
			"Markdown H3": "内容三级标题",
			"Markdown H4": "内容四级标题",
			"Markdown 斜体": "文档斜体",
			"Markdown 粗斜体": "文档粗斜体",
			"Markdown 表格": "文档表格",
			"Markdown 表头": "文档表头",
			"Markdown 小号": "文档小号",
			"Markdown 小号强调": "文档小号强调",
			"Markdown 小号斜体": "文档小号斜体",
			"Markdown 小号粗斜体": "文档小号粗斜体",
			"Markdown 正文": "文档正文",
			"Markdown 强调": "文档正文强调",
			"UI XL": "界面特大字号",
			"UI L": "界面大字号",
			"UI M": "界面中字号",
			"UI Base": "界面正文",
			"UI Base 强调": "界面正文强调"
		};
		const FOUNDATION_RULES = [
			["语义颜色", "优先选择语义变量；不要在组件 CSS 里写新的黑、灰、蓝或透明度。"],
			["字体角色", "先选内容类型或控件层级，再使用对应字体变量；字号和行高成对使用。"],
			["组件变体", "相同语义角色复用相同变体；页面只负责排列，不修改变体自身的尺寸。"],
			["产品专用", "产品专用变量只在它命名的产品表面使用，不把输入区或侧栏表面扩散到其他区域。"],
			["主题切换", "组件只引用语义变量或命名的产品专用变量；主题层替换值，组件不写浅色和深色两套颜色。原始色阶不是绝对不变值。"],
			["例外记录", "真实业务需要特殊颜色、动画或密度时，先命名变体并在实现记录中说明用途。"]
		];
		const FOUNDATION_FONT_STACKS = [[
			"UI 字体",
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
			"body、button、input、select、textarea 继承这一栈。"
		], [
			"代码字体",
			"'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, Courier, 'PingFang SC', 'Microsoft YaHei'",
			"代码块、行内代码和工具输出使用这一栈，不追加裸 monospace。"
		]];
		const FOUNDATION_METRICS = [
			[
				"应用框架",
				"侧栏 264–420px，默认 280px；收起栏 56px；视口小于 1024px 自动收起",
				"框架持有列宽和收起状态；主内容始终使用 minmax(0, 1fr)。"
			],
			[
				"右侧详情区",
				"关闭 0；重新打开 360px；范围 300–520px；拖拽命中区 8px",
				"视觉分隔线可以更细，但可点击拖拽区域和 col-resize 光标不能省略。"
			],
			[
				"侧栏与列表",
				"分区标题 36px；工作区行 34px；会话行 32px；圆角 8px；横向内边距 8px",
				"对象层级使用两档固定密度；标题栏图标按钮 28×28，收起栏按钮 36×36。"
			],
			[
				"会话标题栏",
				"上 12px / 左 20px / 右 28px；标题行至少 32px；页签上间距 4px、间隔 36px、激活条 2px",
				"标题路径、能力动作和页签按真实出现条件排列，不为不存在的能力预留入口。"
			],
			[
				"对话阅读列",
				"最大宽度 748px；节点间距 16px；两侧安全留白 16px",
				"用户消息、助手正文、思考、工具、错误、运行状态和统计信息对齐到同一阅读轴。"
			],
			[
				"用户消息气泡",
				"最大 525px 或 82%；圆角 22px；内边距 10px 16px",
				"只用于用户与待发送消息；助手正文和工具节点不套用消息气泡。"
			],
			[
				"输入区",
				"卡片最大 780px；圆角 22px；顶部 10px；内部间距 12px；文本最多 336px / 14 行；发送或停止 34×34",
				"Todo、Goal、Queue 位于卡片上方；问题、审批和计划评审接管整个输入席位。"
			],
			[
				"设置弹窗",
				"面板 800px；高度 min(800px, 100vh−48px)；圆角 24px；导航 188px；标题 54px；选项内边距 24px",
				"单行输入 32px / 圆角 8px；切换设置页时保持面板尺寸和内容滚动区域稳定。"
			],
			[
				"轨迹视图",
				"工具栏 32px；时间概览 50px；事件列 122px；记录行至少 30px；检查器 320–440px；拖拽命中区 8px",
				"大历史使用虚拟行；窄空间事件列收至 50px，检查器转为覆盖层。"
			],
			[
				"浮层",
				"菜单 218–360px / 圆角 12px / 内边距 4px；弹窗 380px / 圆角 24px；悬浮卡 244px / 圆角 12px",
				"Tooltip/HoverCard z100、Modal z1000、Portal Menu 与 Toast z1100；关闭和焦点策略按类型处理。"
			]
		];
		const FOUNDATION_MOTION = [
			[
				"一级阴影",
				"0 2px 4px rgba(0,0,0,.05)",
				"用于最轻的抬升关系；不代替边界。"
			],
			[
				"一级模糊阴影",
				"0 4px 12px rgba(0,0,0,.02)",
				"一级阴影的柔和版本，只在已命名表面使用。"
			],
			[
				"二级阴影",
				"0 4px 12px rgba(0,0,0,.02) + 0 2px 8px rgba(0,0,0,.04)",
				"Composer 和浮动按钮等持续抬升表面使用。"
			],
			[
				"三级阴影",
				"0 0 1px rgba(0,0,0,.20) + 0 0 4px rgba(0,0,0,.02) + 0 12px 32px rgba(0,0,0,.08)",
				"Menu、Modal、HoverCard 和 Toast 等最高浮层使用。"
			],
			[
				"遮罩模糊",
				"blur(2px)",
				"与语义遮罩背景一起用于阻断式浮层；不能只加模糊而省略遮罩。"
			],
			[
				"共享过渡基线",
				"cubic-bezier(0.4, 0, 0.2, 1)；快速 0.1s / 默认 0.2s / 慢速 0.3s",
				"只提供基础过渡；产品组件仍可拥有经过验证的专用曲线和时长。"
			],
			[
				"运行文字",
				"TurnStatus：1.8s linear infinite",
				"“深度求索中...”使用文字 shimmer；15 秒后追加经过时间，不作为通用加载器。"
			],
			[
				"思考行",
				"ReasoningRow：300px 光带，2.6s ease-out infinite",
				"与运行文字是两个独立动效；动效关闭后仍保留图标、标题和状态文字。"
			],
			[
				"短暂提示",
				"Toast：进入 160ms ease-out；停留 3000ms；淡出 1000ms ease",
				"减少动效时取消位移进入，但保留淡出和定时卸载。"
			],
			[
				"减少动效",
				"prefers-reduced-motion: reduce",
				"没有源码级全局总开关；每个拥有动画的组件分别停止位移、静态化或保留必要的无位移淡出。"
			]
		];
		const ICON_RULES = [
			[
				"图标本体",
				"默认 16px；思考、插件等紧凑状态可以使用源码提供的 14px 版本。",
				"图标尺寸不等于按钮点击区域。"
			],
			[
				"按钮容器",
				"标题栏图标按钮 28×28；rail 图标按钮 36×36；同一变体保持圆形。",
				"容器负责 hover、active、focus-visible 和 disabled。"
			],
			[
				"颜色继承",
				"图标使用 currentColor，由控件的 label alias 或状态 alias 提供颜色。",
				"不要在图标 SVG 内固定产品颜色。"
			],
			[
				"命名复用",
				"使用 ui-primitives 导出的真实图标组件和 canonical name。",
				"不复制 SVG、不发明相似图标、不用文字字符替代图标。"
			],
			[
				"动作语义",
				"图标表达对象或动作；页面通过按钮、行或状态组件补齐上下文。",
				"同一图标在不同区域不自动变成不同视觉变体。"
			],
			[
				"可访问名称",
				"图标按钮必须有 aria-label；带可见文字的按钮由文字提供名称。",
				"禁用和状态信息不能只靠图标颜色传达。"
			]
		];
		const ICON_GROUPS = [
			{
				title: "导航与工作区",
				icons: [
					{
						label: "新建会话",
						name: "IconNewChatOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconNewChatOutline16,
						usage: "侧边栏和对话标题栏的新会话入口"
					},
					{
						label: "搜索",
						name: "IconSearchOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16,
						usage: "工作区筛选和搜索入口"
					},
					{
						label: "视图选项",
						name: "IconPersonalizationOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16,
						usage: "工作区标题栏的视图选项"
					},
					{
						label: "添加工作区",
						name: "IconProjectAddOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconProjectAddOutline16,
						usage: "工作区标题栏添加工作区"
					},
					{
						label: "更多操作",
						name: "IconEllipsisOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16,
						usage: "列表行操作菜单触发"
					},
					{
						label: "侧栏",
						name: "IconPanelLeftOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16,
						usage: "应用框架收起和展开侧栏"
					}
				]
			},
			{
				title: "对话与反馈",
				icons: [
					{
						label: "添加内容",
						name: "IconPlusOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16,
						usage: "Composer 添加附件、任务或上下文"
					},
					{
						label: "发送",
						name: "IconSendOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconSendOutline16,
						usage: "Composer 发送消息"
					},
					{
						label: "复制",
						name: "IconCopyOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16,
						usage: "助手消息复制操作"
					},
					{
						label: "赞同",
						name: "IconLikeOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconLikeOutline16,
						usage: "助手消息正向反馈"
					},
					{
						label: "不赞同",
						name: "IconDislikeOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconDislikeOutline16,
						usage: "助手消息负向反馈"
					},
					{
						label: "思考",
						name: "IconThinkOutline14",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconThinkOutline14,
						usage: "思考状态的紧凑 leading icon"
					},
					{
						label: "加载",
						name: "IconLoadingOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16,
						usage: "加载或等待状态"
					},
					{
						label: "警告",
						name: "IconWarningOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16,
						usage: "错误、风险或阻断状态"
					}
				]
			},
			{
				title: "能力与主题",
				icons: [
					{
						label: "工具代码",
						name: "IconCodeOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16,
						usage: "工具行和代码结果的 leading icon"
					},
					{
						label: "插件",
						name: "IconCordisPluginOutline14",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconCordisPluginOutline14,
						usage: "设置中的插件入口或插件状态"
					},
					{
						label: "目标",
						name: "IconGoalOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16,
						usage: "Goal 面板入口"
					},
					{
						label: "技能",
						name: "IconSkillOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconSkillOutline16,
						usage: "Skill 面板入口"
					},
					{
						label: "浅色",
						name: "IconLightOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconLightOutline16,
						usage: "主题设置的浅色选项"
					},
					{
						label: "深色",
						name: "IconDarkOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconDarkOutline16,
						usage: "主题设置的深色选项"
					},
					{
						label: "删除",
						name: "IconTrashOutline16",
						icon: _deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16,
						usage: "删除工作区等破坏性动作"
					}
				]
			}
		];
		const PRIMITIVE_RULES = [
			[
				"Button",
				"用于明确动作；md 36px / r18 / 14·22，sm 28px / r14 / 12·18。",
				"primary、ghost、outline、toolbar 是命名变体；页面不能局部改写胶囊几何。"
			],
			[
				"Icon button",
				"用于单一图标动作；标题栏 28×28，rail 36×36。",
				"必须补 aria-label；按钮状态由容器表达。"
			],
			[
				"Input",
				"设置、搜索和单行表单使用 32px / r8 / 16px icon slot。",
				"它只有单行输入责任，不承载任务、附件、队列或发送。"
			],
			[
				"DisclosureRow",
				"用于工具、文件和结果摘要的展开/收起。",
				"摘要行和展开内容分开；状态点、菜单触发和内容区不能互相冒充。"
			],
			[
				"Overlay primitives",
				"Menu、Tooltip、HoverCard、Modal、Toast 各自拥有触发、层级和收束方式。",
				"相似的浮层不合并为一个通用卡片。"
			],
			[
				"页面组合",
				"Composer、工具行、设置字段和工作区行由产品页面组合原子资源。",
				"组合可以拥有自己的布局，但不重复定义原子的字体、状态和基础几何。"
			]
		];
		const A11Y_CHECKS = [
			[
				"键盘路径",
				"Tab 顺序覆盖页面中所有可操作元素；Enter/Space 执行动作，Esc 收束当前浮层。",
				"失败：只能用鼠标打开、提交或关闭。"
			],
			[
				"可访问名称",
				"图标按钮有 aria-label；菜单、弹窗和表单控件有可读名称与关联说明。",
				"失败：读屏只能得到“button”或重复的无意义名称。"
			],
			[
				"状态语义",
				"selected、expanded、disabled、readonly、busy 等状态同时反映到 ARIA 或原生属性。",
				"失败：视觉上选中或加载，但 DOM 没有对应状态。"
			],
			[
				"焦点可见",
				"键盘焦点使用清晰的 focus-visible 边界，不能用 outline: none 隐藏。",
				"失败：焦点进入后无法判断当前位置。"
			],
			[
				"颜色独立",
				"错误、成功、选中和进行中同时有文字、图标、位置或结构信号。",
				"失败：只靠红、绿、蓝或动画区分状态。"
			],
			[
				"动效收束",
				"每个带动画的组件单独处理 prefers-reduced-motion；关闭后仍保留信息和动作。",
				"失败：系统减少动效仍持续 shimmer、sweep 或位移。"
			],
			[
				"浮层焦点",
				"Modal 打开时焦点进入对话框，关闭后回到触发源；Menu/Tooltip 按各自交互方式收束。",
				"失败：焦点留在遮罩后或关闭后丢失。"
			]
		];
		const TRAJECTORY_RULES = [
			[
				"视图根",
				"height 100% · overflow hidden · bg-layer-1",
				"轨迹是会话中的独立视图，工具栏固定，下面的账本和详情检查器共享一个受限容器。"
			],
			[
				"工具栏",
				"32px · sticky top 0 · gap 8px · controls 20px",
				"Duration、Turns、Calls 和搜索使用紧凑控制；按下状态通过 aria-pressed 保持可读。"
			],
			[
				"时间概览",
				"50px · labels 44px · track crosshair",
				"Input、Model、Tools 三条 lane 使用相同时间域；拖选、滚轮缩放和 Escape 复位。"
			],
			[
				"事件账本",
				"event column 122px · row min 30px",
				"记录按 turn 分组；历史分页位于顶部，加载时保留读者位置。"
			],
			[
				"记录生命周期",
				"completed · pending · failed",
				"每条记录保留角色、内容、时间和错误信息；pending 不伪造完成时间。"
			],
			[
				"虚拟滚动",
				"only visible rows + 12-row buffer",
				"大历史记录只挂载可见窗口；表头、加载条和详情不与行内容争夺滚动轴。"
			],
			[
				"记录检查器",
				"内嵌 split pane · adjustable width",
				"选择记录后显示 Summary、Payload、Result、Timing；关闭或切换记录不离开轨迹。"
			],
			[
				"响应式职责",
				"event column 122px → 50px · inspector overlay",
				"窄空间优先收缩事件列；检查器转为覆盖层，轨道与账本继续独立滚动。"
			]
		];
		const COMPOSER_RULES = [
			[
				"共享宽度轴",
				"content 748px · card max 780px · side clearance 16px",
				"对话流、dock、接管面板和 Composer 围绕同一会话阅读轴排列；输入卡片比正文宽 32px。"
			],
			[
				"dock 区",
				"conversation.input.dock · order Todo 0 / Goal 10 / Queue 20",
				"dock 位于 Composer 上方，按会话数据出现；它不是消息流节点，也不进入卡片内部。"
			],
			[
				"输入卡片",
				"top pad 10px · gap 12px · r22 · shadow lv2",
				"卡片使用 input-major 表面和 darkmode-thin border；空工作区改为同半径的虚线选择工作区触发器。"
			],
			[
				"文本层",
				"16/24 · hero floor 52px · cap 14 lines",
				"textarea、backdrop、mirror 共享一个滚动偏移，编辑和引用高亮不能漂移；只有文本区域滚动。"
			],
			[
				"附件与提示",
				"attachment rail before text · notice 12/18 r8",
				"附件在文本前；局部错误或提示在卡片外上方，不能伪装为消息或 Toast。"
			],
			[
				"左侧工具",
				"add 28px circular · selection controls 28px / r8",
				"添加、权限/计划等使用独立控件；选择项是下拉选择，不用外观相似的按钮冒充。"
			],
			[
				"右侧动作",
				"model select + context meter + send/stop 34px circular",
				"发送使用 info fill；普通运行时主动作改为停止，连续子代理则保留 Send 并显示独立 Stop。"
			],
			[
				"接管面板",
				"question · approval · plan review",
				"提问、审批、计划评审会替换 Composer seat；保持共享宽度，不在普通输入卡片下追加第二套表单。"
			]
		];
		const CHAT_FLOW_RULES = [
			[
				"滚动所有权",
				"conversation scroll body",
				"会话根持有单一纵向滚动轴；ChatView 在该容器中作为普通内容流，不再创建第二个竞争滚动区。"
			],
			[
				"内容列",
				"max-width 748px · centered · vertical gap 16px",
				"助手正文、用户气泡、上下文、工具、错误和状态行都对齐到同一阅读轴。"
			],
			[
				"历史加载",
				"top-of-flow · button r14 · padding 4/12",
				"加载更早记录时保存阅读锚点，prepend 后不把读者跳到另一条消息。"
			],
			[
				"跟随策略",
				"reader scroll disables follow",
				"新用户消息、待发送项和读者停在底部时可以跟随；读者上翻后保留当前位置。"
			],
			[
				"回到底部",
				"34×34 · circular · sticky zero-height slot",
				"独立于 Composer；只在离开底部后显示，不增加 scrollHeight。"
			],
			[
				"进行中",
				"TurnStatus 26px · shimmer 1.8s",
				"覆盖本轮首次 token、工具和 streaming 阶段；15 秒后补充经过时间。"
			],
			[
				"思考与错误",
				"ReasoningRow sweep 300px/2.6s · error text + code + retry",
				"思考、工具、错误和重试保持不同的节点结构，不能泛化为同一种“消息卡片”。"
			],
			[
				"会话统计",
				"12/20 · centered · ellipsis",
				"元数据位于对话流尾部并与阅读列对齐；超长内容只截断这一行。"
			]
		];
		const SESSION_HEADER_RULES = [
			[
				"标题区",
				"top 12px · left 20px · right 28px · title row min 32px",
				"标题栏属于会话视图；当前会话和子代理路径共用 breadcrumb 结构。"
			],
			[
				"层级路径",
				"gap 4px · crumb 14/20 · current 500",
				"普通会话没有父级路径时展示当前会话；子代理显示可返回的祖先路径。"
			],
			[
				"标题栏动作槽",
				"min-height 28px · gap 8px",
				"Agent 预设、子代理目录、后台任务各自按能力注册；没有能力时不占入口。"
			],
			[
				"子代理触发",
				"min-height 28px · pad 3/2 · r6 · 12/18 · count margin 5",
				"使用状态点、数量和 disclosure；不是虚构的“子代理图标按钮”。"
			],
			[
				"后台任务触发",
				"min-height 28px · pad 3/2 · r6 · 12/18",
				"有任务时才出现；列表内按运行和已结束状态排序。"
			],
			[
				"右侧工具区",
				"gap 8px · margin-left 20px",
				"Session 日志和分享等是独立插件贡献，不能当作原生标题栏保证存在。"
			],
			[
				"页签",
				"margin-top 4px · left 8px · gap 36px · text 13/16 · active bar 2px",
				"“对话 / 轨迹”由会话视图切换，页签数大于 1 时才显示。"
			]
		];
		const SETTINGS_RULES = [
			[
				"遮罩",
				"viewport fixed · z1000 · bg-mask-1 + mask blur",
				"设置是阻断式工作面；点击遮罩或 Esc 的关闭行为必须与未保存状态协调。"
			],
			[
				"面板",
				"800px × min(800px, 100vh−48px) · max-width 100vw−48px · r24",
				"切换设置页时面板尺寸稳定；超出内容只在 options 区滚动。"
			],
			[
				"导航轨",
				"188px · top 22px · side 12px · gap 18px",
				"设置页入口属于 shell 导航；选中项使用 40px / r12 的 nav cell。"
			],
			[
				"内容标题",
				"54px header · 24px options padding",
				"标题与关闭固定；字段、卡片和列表在 options 内滚动。"
			],
			[
				"单行字段",
				"Input 32px · r8 · icon slot 16px",
				"搜索、名称和凭据等单行值使用 Input，不使用 Composer。"
			],
			[
				"动作",
				"Button md 36px · sm 28px",
				"应用、取消、删除和添加使用基础 Button 变体，不在每个设置页重新定义。"
			],
			[
				"页面状态",
				"saved · dirty · saving · invalid · readonly · error",
				"状态由具体设置页持有；shell 只负责导航、滚动和关闭流程。"
			]
		];
		const SIDEBAR_RULES = [
			[
				"宽度与滚动",
				"264–420px · default 280px",
				"侧边栏整体固定宽度；品牌和设置固定，工作台/工作区/会话区域独立滚动。"
			],
			[
				"品牌标题区",
				"40px row · wordmark + 28×28 collapse",
				"品牌是第一视觉信号；收起动作使用标题栏图标按钮变体。"
			],
			[
				"新会话",
				"38px · r12 · elevated fill + border L2",
				"宽侧栏使用带文字的整行入口；rail 切换为 36×36 图标按钮。"
			],
			[
				"分区标题",
				"36px · label 14/20 · actions 28×28 · gap 4",
				"工作台与工作区共享同一标题行和搜索/视图/添加按钮变体。"
			],
			[
				"对象行",
				"工作区 34px · 会话 32px · r8 · horizontal 8px",
				"对象层级造成两档密度；同类行跨分区保持一致。"
			],
			[
				"选中与悬停",
				"semantic hover / active fills",
				"选中、hover、running、menu-open 可叠加；不能通过改变行高或圆角表达。"
			],
			[
				"行级操作",
				"ellipsis only on hover/focus/menu-open",
				"菜单触发不切换 treeitem；重命名与删除使用统一菜单项密度。"
			],
			[
				"收起 rail",
				"56px",
				"保留品牌、展开、新会话、工作区入口和设置；隐藏文字不是删除功能。"
			]
		];
		const SHELL_RULES = [
			[
				"侧边栏列",
				"min 264px · default 280px · max 420px · rail 56px",
				"应用框架持有宽度和收起状态；侧边栏页面只渲染自身内容。"
			],
			[
				"主内容列",
				"minmax(0, 1fr)",
				"始终保留标题栏、当前视图和 Composer 的可用宽度，不为详情区硬编码剩余尺寸。"
			],
			[
				"详情列",
				"closed 0 · reopen 360px · range 300–520px",
				"详情关闭时归零；重新打开使用默认宽度，再允许拖拽。"
			],
			[
				"拖拽命中",
				"8px invisible hit strip",
				"视觉分隔线可以更细，但鼠标命中区保持 8px，并提供 col-resize 光标。"
			],
			[
				"自动收起",
				"< 1024px → 56px rail",
				"视口级变化由应用框架决定；产品页面根据实际可用宽度重排。"
			],
			[
				"全局浮层",
				"shell.overlay · z20 · pointer-events: none",
				"浮层根不拦截主界面；具体子项显式恢复交互。"
			]
		];
		const MODULE_ROWS = [
			{
				layer: "基础资源",
				owner: "ui-theme / ui-primitives",
				slot: "全局样式 + 基础组件",
				dom: "令牌、Button、Input、Menu",
				states: "主题 / 焦点 / 禁用",
				source: "ui-theme, ui-primitives"
			},
			{
				layer: "应用框架",
				owner: "ui-layout / ui-sidebar",
				slot: "根节点 → 侧栏 | 对话 | 详情",
				dom: "AppFrame grid + overlay",
				states: "宽侧栏 / rail / 详情打开",
				source: "AppFrame.tsx + SidebarRoot.tsx"
			},
			{
				layer: "导航",
				owner: "ui-workspace",
				slot: "sidebar.workspaces",
				dom: "sectionHeader + treeitem 行",
				states: "搜索 / 选中 / 拖拽 / 重命名",
				source: "WorkspaceBrowser.tsx + Rows.tsx"
			},
			{
				layer: "对话",
				owner: "ui-conversation",
				slot: "conversation.view + conversation.composer",
				dom: "scrollBody + composerSeat",
				states: "初始 / 活动 / 阻塞 / 进行中",
				source: "ConversationRoot.tsx + InputBar.tsx"
			},
			{
				layer: "消息",
				owner: "ui-conversation/chat",
				slot: "conversation.chat.node",
				dom: "助手流 + 用户气泡",
				states: "流式 / 错误 / 重试",
				source: "AssistantMarkdown + MessageItem"
			},
			{
				layer: "工具",
				owner: "ui-tool",
				slot: "tool.call.toolview",
				dom: "DisclosureRow + 输入输出内容",
				states: "空闲 / 进行中 / 错误 / 展开",
				source: "ToolRow.tsx + ToolDetails.tsx"
			},
			{
				layer: "设置",
				owner: "ui-settings-*",
				slot: "settings.section / tab / item",
				dom: "弹窗 + 导航轨 + 表单",
				states: "已保存 / 待保存 / 无效 / 只读",
				source: "SettingsRoot + feature sections"
			},
			{
				layer: "反馈",
				owner: "ui-primitives + feature packages",
				slot: "shell.overlay / feature status",
				dom: "banner + toast + 空状态 / 加载",
				states: "成功 / 进行中 / 错误 / 空状态",
				source: "ConnectionBanner + Toast"
			},
			{
				layer: "无障碍",
				owner: "所有客户端模块",
				slot: "每个可交互根节点",
				dom: "button / treeitem / dialog / status",
				states: "焦点 / 键盘 / 减少动效",
				source: "roles + focus rules"
			}
		];
		const IMPLEMENTATION_AUDIT_ROWS = [
			[
				"语义颜色与字体",
				"已采用",
				"新实现优先使用 `--dsw-alias-*` 与已消费的字体令牌；原始色阶和“仅声明”字体不能被当作默认组件标准。"
			],
			[
				"阴影与遮罩",
				"已采用",
				"只使用一级、一级模糊、二级、三级阴影和 2px 遮罩模糊；具体表面归属以产品页为准。"
			],
			[
				"产品专用变量",
				"受限采用",
				"输入区、侧栏、消息气泡、菜单、选择器和提示条只在同名产品表面使用。"
			],
			[
				"局部固定颜色",
				"受控例外",
				"悬浮卡、用户引用标签和语法高亮保留源码局部值，不提升为共享颜色。"
			],
			[
				"历史未定义变量",
				"禁止采用",
				"模型设置中无法在当前主题层解析的历史变量只记录问题，不复制到基础资源或新页面。"
			],
			[
				"直接字号与间距",
				"需要归属",
				"源码中的固定值只有在对应产品页记录了组件、状态和原因后才能复用，不能据此推导全局刻度。"
			]
		];
		const IMPLEMENTATION_GATES = [
			["来源", "至少一份当前 DSH 组件或主题源码能证明名称、结构或数值。"],
			["归属", "标明语义角色、所属模块、挂载位置，以及通用组件或产品组合的边界。"],
			["状态", "列出触发、默认、悬停、按下、选中、焦点、禁用、加载、成功和错误中的适用项。"],
			["几何", "记录宽高、间距、圆角、滚动、层级和命中区域；不从相似页面猜值。"],
			["响应式", "写清外层断点与组件在实际可用宽度中的重排责任。"],
			["无障碍", "验证键盘路径、名称、ARIA/原生状态、焦点回归和减少动效。"],
			["回归", "构建与类型检查通过，并在现有 3080 GUI 中核对无溢出、无重叠和真实组件关系。"]
		];
		const GEOMETRY_ROWS = [
			[
				"侧边栏收起轨道",
				"56px",
				"收起后仍保留品牌、新会话、工作区操作和设置入口。"
			],
			[
				"工作区行 / 会话行",
				"34px / 32px",
				"对象层级不同，因此使用两档固定列表密度。"
			],
			[
				"对话内容宽度",
				"748px",
				"用户消息、助手正文和状态信息共享阅读基线。"
			],
			[
				"输入区最大宽度",
				"780px",
				"包含 748px 内容宽度和两侧各 16px 的控件留白。"
			],
			[
				"输入文字滚动上限",
				"336px",
				"最多展示 14 行，每行 24px，超过后在输入区内部滚动。"
			],
			[
				"菜单 / Modal / HoverCard",
				"218–360px / 380px / 244px",
				"操作菜单、阻断确认和延迟信息卡使用不同宽度。"
			],
			[
				"设置弹窗 / 左侧导航",
				"800px / 188px",
				"设置内容在固定导航与主表单之间分列。"
			]
		];
		function sectionFor(value) {
			if (value === "tokens" || value === "surfaces") return "foundations";
			if (value === "components") return "primitives";
			return SECTIONS.some((section) => section.id === value) ? value : "overview";
		}
		function SectionHeading({ title, detail, source }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-heading",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: detail })] }), source !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("code", {
					className: "dsh-specimen-source",
					children: ["依据：", source]
				})]
			});
		}
		function BoardIntro({ path, title, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-intro",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: path }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: title }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children })
				]
			});
		}
		const TOKEN_LABEL_ZH = {
			Base: "基础表面",
			"Layer 1": "第一层表面",
			"Layer 2": "第二层表面",
			"Layer 3": "第三层表面",
			Overlay: "浮层表面",
			"Mask 1": "第一层遮罩",
			"Mask 2": "第二层遮罩",
			"Mask 3": "第三层遮罩",
			"Mask photo": "图片遮罩",
			"Mask drop": "拖拽遮罩",
			"Module platform": "平台模块背景",
			"Multi-select": "多选背景",
			Skeleton: "骨架屏背景",
			"Border inverted 2": "第二级反色边界",
			"Border inverted": "反色边界",
			"Border L1": "第一层边界",
			"Border L2 darkmode thin": "暗色细第二层边界",
			"Border L2": "第二层边界",
			"Border L3": "第三层边界",
			"Border L4": "第四层边界",
			"Scrollbar L1": "第一层滚动条",
			"Scrollbar L2": "第二层滚动条",
			"Scrollbar hover L1": "第一层滚动条悬停",
			"Scrollbar hover L2": "第二层滚动条悬停",
			"Ghost active border": "幽灵按钮激活边界",
			"Ghost active fill": "幽灵按钮激活填充",
			"Ghost hover": "幽灵按钮悬停",
			Info: "信息按钮填充",
			"Info hover": "信息按钮悬停",
			"Primary dimmed": "弱化主要按钮",
			Primary: "主要按钮填充",
			"Primary hover": "主要按钮悬停",
			"Toolbar invisible": "工具栏透明填充",
			Toolbar: "工具栏按钮填充",
			"Toolbar hover": "工具栏按钮悬停",
			Business: "业务状态",
			"Business tertiary": "业务状态浅色背景",
			Warning: "警告状态",
			"Warning secondary": "警告辅助背景",
			"Warning tertiary": "警告弱背景",
			"Warning label": "警告文字",
			Error: "错误状态",
			"Error secondary": "错误辅助背景",
			Success: "成功状态",
			"Success secondary": "成功辅助背景",
			"Success tertiary": "成功弱背景",
			"Code block": "代码块背景",
			"Code block banner": "代码块标题栏背景",
			"Inline code": "行内代码",
			"Code selected": "代码选中片段",
			"Code unselected": "代码未选中片段",
			Citation: "引用标记",
			Placeholder: "占位内容",
			Tag: "标签内容",
			Toast: "全局提示表面",
			Tooltip: "提示内容",
			"Bubble highlight": "用户气泡高亮",
			Bubble: "用户消息气泡",
			"Input major": "对话输入表面",
			"Login input": "登录输入表面",
			Menu: "菜单表面",
			Selector: "选择器表面",
			"Sidebar fill": "侧栏表面",
			"Sidebar active accent": "侧栏选中强调层",
			"Sidebar active": "侧栏选中背景",
			"Sidebar hover": "侧栏悬停背景",
			Tip: "提示条表面"
		};
		function TokenRow({ token, label, usage }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-token-row",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-specimen-swatch",
						style: { backgroundColor: `var(${token})` },
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-specimen-token-copy",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: TOKEN_LABEL_ZH[label] ?? label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: token })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: usage })
				]
			});
		}
		function StaticRamp() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-static-family-grid",
				children: STATIC_FAMILIES.map(([family, tokens]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					className: "dsh-static-family",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-static-family-heading",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: STATIC_FAMILY_LABELS[family] ?? family }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [tokens.length, " 个色阶"] })]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-static-token-grid",
						children: tokens.map((level) => {
							const token = `--dsw-static-${family}-${level}`;
							const isThemeVariant = token === "--dsw-static-neutral-bluish-60";
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-static-token",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-specimen-swatch",
										style: { backgroundColor: `var(${token})` },
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: token }),
									isThemeVariant && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "浅色 245,246,247 · 深色 249,250,251" })
								]
							}, token);
						})
					})]
				}, family))
			});
		}
		function Overview() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "总览",
						title: "系统总览",
						children: "DSH 是一个围绕会话展开的工作界面：左侧选择会话和工作区，设置在独立弹窗中完成配置，中间区域在对话和轨迹之间切换。产品区域负责布局和组合，共享组件通过统一的语义变体保持一致。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "阅读顺序",
							detail: "先认识共享的颜色、字体、图标和基础组件，再用规范确定组合方法，最后到产品页面查看完整实例。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-board-layer-strip",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "01" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "基础资源" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "颜色 · 字体 · 图标 · 基础组件" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "02" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "规范" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "状态 · 响应式 · 无障碍 · 实现记录" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "03" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "产品页面" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "侧边栏 · 设置 · 会话 · 对话 · 轨迹" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "产品区域",
							detail: "先确定需求放在哪个区域，以选择正确的页面组合和周边关系。控件样式仍由语义角色和组件变体决定；同一变体跨区域保持一致。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-overview-page-map",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "应用框架" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "安排侧边栏、主内容和右侧详情，提供列宽调整与全局浮层位置。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderOpen16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "侧边栏" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "品牌、收起、新会话、工作台、工作区、会话树和设置入口。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSettingsOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "设置弹窗" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "通用、模型、插件和 Agent 预设；每项配置拥有独立状态。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "会话标题栏" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "父子路径、预设、子代理、后台任务与视图页签；工具可由插件追加。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconNewChatOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "对话流" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "用户与助手消息、思考过程、工具调用、结果和会话反馈。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "输入区" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "任务、目标、队列、附件、模式、模型、上下文、发送和会话统计。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDataOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "轨迹" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "时间概览、搜索、轮次和工具折叠、事件账本、历史加载与记录检查。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "浮层与反馈" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "菜单、确认、提示、连接状态和错误反馈；各自有不同的关闭方式与层级。" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "一致性原则",
							detail: "组件先于页面。页面选择组件、变体与排列方式，不在局部重新定义控件自身的视觉。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-board-callouts",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "同一角色，同一变体" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "添加工作台与添加工作区都是标题栏添加按钮，统一为 28×28 的圆形图标按钮，并共享全部交互状态。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconInspectOutline12, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "差异必须有语义" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "只有功能或约束确实不同，才选择另一个已命名变体；例如 28px 标题栏按钮与 36px rail 按钮。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "页面不能改写组件" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "页面负责位置、间距和响应式编排；字号、内边距、边界、圆角、图标与状态由组件变体持有。" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "设计决策顺序",
							detail: "新增或修改 UI 时按同一套顺序判断，任何一步缺失都不进入产品页面。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-overview-workflow",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "1" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "明确任务" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "先说明要展示的信息、用户动作和完成反馈。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "2" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "确定区域" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "确定控件放置位置、相邻内容和页面组合关系。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "3" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "识别角色" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "判断它是图标按钮、菜单项、列表行、输入框还是其他语义组件。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "4" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "复用变体" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "同一角色和变体直接复用；差异必须对应明确的功能或密度要求。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "5" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "补齐状态" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "同时设计默认、hover、active、selected、focus、disabled、loading 和 error。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "6" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "校验一致性" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "并排比较字号、行高、间距、边界、圆角和图标尺寸，再验证实际环境。" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "关键尺寸",
							detail: "这些尺寸直接决定页面密度和行为；它们属于具体页面，并非一套脱离产品的全局刻度。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-board-geometry-table",
							children: GEOMETRY_ROWS.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: row[0] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: row[1] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: row[2] })
							] }, row[0]))
						})]
					})
				]
			});
		}
		function Foundations() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "基础资源 / 颜色与字体",
						title: "颜色与字体",
						children: "这里定义所有 DSH 页面共同使用的语义颜色、字体角色、层级和动效。先从本页选择资源与度量，再到产品页面确定它们如何组合。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "资源分层",
							detail: "新页面从下往上使用资源：底层基元只提供基线，组件优先使用语义变量，产品专用变量只服务命名的产品表面。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-layer-table",
							children: FOUNDATION_LAYERS.map(([title, scope, resources, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: scope }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: resources }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "使用规则",
							detail: "这些规则用于阻止页面出现局部猜测出来的字号、边距、圆角或颜色。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-rule-grid",
							children: FOUNDATION_RULES.map(([title, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "明暗主题对照",
							detail: "主题层替换 token 的值，组件只保留语义引用。下面是选择资源时必须知道的跨主题行为。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-theme-table",
							children: FOUNDATION_THEME_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "原始色阶",
							detail: "完整原始色阶仅供主题映射和特殊专项使用；产品组件不要直接消费原始 token。`neutral-bluish-60` 是当前源码中唯一发现浅色与深色值不同的原始名称。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StaticRamp, {})]
					}),
					TOKEN_GROUPS.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: group.title,
							detail: group.title === "产品专用表面" ? "这些语义变量虽由主题层声明，但只服务具体产品表面；不要当作通用颜色。" : "使用对应的语义变量；明暗主题由主题层提供值，页面不写固定颜色。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-specimen-token-table",
							children: group.tokens.map((token) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TokenRow, { ...token }, token.token))
						})]
					}, group.title)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "字体栈",
							detail: "字体角色只决定字号、行高和字重；字体家族遵循下面两套栈，由 shell 统一应用到正文和表单控件。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-font-table",
							children: FOUNDATION_FONT_STACKS.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
								title: "字体角色",
								detail: "字号、行高和字重必须作为一个角色一起使用。示例文字用于比较实际密度，不代表额外的页面标题样式。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-specimen-type-head",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "角色" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "示例" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "字号 / 行高 / 字重" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "令牌" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "使用情况" })
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-specimen-type-table",
								children: TYPE_ROWS.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-specimen-type-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: TYPE_LABEL_ZH[row.label] ?? row.label }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
											style: { font: `var(${row.token})` },
											children: row.specimen
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: row.metric }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: row.token }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", {
											"data-status": row.status,
											children: row.status
										})
									]
								}, row.token))
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "页面度量",
							detail: "这些数值约束几何，不单独决定行为；实现仍需同时遵循对应产品页面的状态、交互、无障碍和源码例外。新增设计优先复用已验证的度量。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-metric-table",
							children: FOUNDATION_METRICS.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "阴影与动效",
							detail: "阴影值、模糊、过渡基线和已验证的组件动效都写在表中；页面仍必须按所属组件的触发、完成和减少动效行为实现。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-motion-table",
							children: FOUNDATION_MOTION.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					})
				]
			});
		}
		function Icons() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "基础资源 / 图标",
						title: "图标",
						children: "图标本体、按钮容器和可访问名称是三个不同层次。先按下面的规则选择真实图标，再到产品页面决定它所在的行、工具栏或状态组合。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "使用规则",
							detail: "图标只提供对象或动作的视觉线索；尺寸、颜色、交互和语义名称由承载它的控件完成。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-icon-rule-grid",
							children: ICON_RULES.map(([title, detail, note]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: note })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "尺寸与容器",
							detail: "同一图标在不同点击密度中只改变命名的容器变体，不改变 glyph 画法。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-icon-geometry-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-icon-button-28",
										"aria-label": "添加工作区",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconProjectAddOutline16, {})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "标题栏图标按钮" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "glyph 16 · button 28×28 · r14" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-icon-button-36",
										"aria-label": "打开侧栏",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, {})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "rail 图标按钮" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "glyph 16 · button 36×36 · r18" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-icon-status-14",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconThinkOutline14, {})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "紧凑状态图标" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "glyph 14 · 不承担点击动作" })
								] })
							]
						})]
					}),
					ICON_GROUPS.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: group.title,
							detail: "这里的 canonical name 来自真实图标导出；使用时保留命名和尺寸后缀。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-specimen-icon-grid",
							children: group.icons.map((item) => {
								const Icon = item.icon;
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-specimen-icon-item",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-specimen-icon-box",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { size: item.name.endsWith("14") ? 14 : 16 })
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: item.label }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: item.name }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: item.usage })
									] })]
								}, item.name);
							})
						})]
					}, group.title)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "图标状态",
							detail: "默认、悬停、选中、禁用是控件状态，不是另一套图标。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-specimen-icon-states",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-label": "搜索，默认",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}), "默认"]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-state": "hover",
									"aria-label": "搜索，悬停",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}), "悬停"]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-state": "selected",
									"aria-label": "搜索，选中",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}), "选中"]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: true,
									"aria-label": "搜索，禁用",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}), "禁用"]
								})
							]
						})]
					})
				]
			});
		}
		function Primitives() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "基础资源 / 基础组件",
						title: "基础组件",
						children: "这些是可被多个产品页面复用的原子控件。它们持有自己的几何和基础状态；完整的对话、侧栏、设置和轨迹组合到产品页面查看。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "责任边界",
							detail: "先判断需求是原子控件还是产品组合，再选择对应页面；不要用相似的基础控件替代真实组合。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-primitive-rule-grid",
							children: PRIMITIVE_RULES.map(([title, detail, note]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: note })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
								title: "按钮的不同用法",
								source: "ui-primitives/Button.tsx + Button.module.css",
								detail: "Button 有主要、幽灵、描边和工具栏四种用法，也提供适合紧凑列表的尺寸。宽侧栏的新会话按钮是页面里的特殊组合。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-primitive-button-row",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dsh-primitive-button is-primary",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}), "Primary"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-primitive-button is-ghost",
										children: "Ghost"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-primitive-button is-outline",
										children: "Outline"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "dsh-primitive-button is-toolbar",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, {}), "Toolbar"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-primitive-button is-small",
										children: "Compact"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "dsh-primitive-button",
										disabled: true,
										children: "Disabled"
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-board-spec-grid",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "md: 36px / r18 / 14px·22px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "sm: 28px / r14 / 12px·18px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "icon slot: 16px / gap 4px" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
								title: "单行输入框",
								source: "ui-primitives/Input.tsx + Input.module.css",
								detail: "这是设置、搜索和单行表单使用的 32px Input；对话 Composer 不使用这个组件。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-primitive-input-row",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["带图标", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										className: "dsh-primitive-input",
										icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}),
										defaultValue: "搜索模型"
									})] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["空状态", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										className: "dsh-primitive-input",
										placeholder: "输入名称"
									})] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["禁用", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										className: "dsh-primitive-input",
										disabled: true,
										placeholder: "不可编辑"
									})] })
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-board-note",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "责任边界：`ui-primitives/Input` 是单行原子；`ui-conversation/InputBar` 是多行文本层、Composer card、toolbar 和 send action 的产品组合。" })]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "可展开行与状态点",
							source: "ui-primitives/DisclosureRow.tsx + StateDot.tsx",
							detail: "工具摘要和状态行共享 24px 行高，但展开内容和状态文案由各自模块提供。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-primitive-disclosure",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-primitive-leading",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, {})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "读取" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-primitive-separator" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "WorkspaceBrowser.module.css" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, {})
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									"data-open": "true",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dsh-primitive-leading",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {})
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "运行中" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-primitive-separator" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "pnpm run check" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, {})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-primitive-leading",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "失败" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-primitive-separator" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "需要重新读取文件" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, {})
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "组件目录",
							source: "ui-primitives/src/index.ts",
							detail: "这是当前 DSH 可复用组件的完整分类。具体的页面组合请到“产品页面”查看。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-primitive-catalog",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "操作与选择" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Button · Pill · Input · Menu · Tooltip · HoverCard · Modal · RiskConfirmation" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "状态与反馈" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "StateDot · DisclosureRow · Toast · ConnectionBanner · OnboardingSurface" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "结构化结果" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "JsonTree · TerminalBlock · ReadBlock · DiffBlock · SearchBlock · WebBlock" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "文本内容" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "MarkdownText · MessageText · CodeBlock · JsonBlock" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "品牌资源" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "FishLogo · BrandWordmark · icons" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "页面层的补充组件" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Tabs · Tree rows · Composer · ToolRow · Settings fields" })] })
							]
						})]
					})
				]
			});
		}
		function Shell() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 应用框架",
						title: "应用框架",
						children: "应用框架只负责侧边栏、主内容、详情区和全局浮层的页面关系，也持有列宽、收起与拖拽状态。消息、Composer、轨迹和设置仍由各自页面定义。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "布局规则",
							source: "ui-layout/AppFrame.tsx + ui-sidebar/SidebarRoot.tsx",
							detail: "页面先遵循列宽与收起规则，再把产品模块放进对应区域；应用框架不改变内部组件变体。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-shell-rule-table",
							children: SHELL_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "三列布局",
							detail: "侧边栏、主内容和详情区保持独立；详情区可归零，overlay 使用绝对层。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-shell-diagram",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "侧边栏" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "264–420px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "default 280 · rail 56" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("main", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "主内容" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "标题栏 + 当前视图 + Composer" })] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-shell-chat-lines",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "dsh-shell-composer-line" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dsh-shell-resize-handle",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
									className: "dsh-shell-details",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "详情区" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "0 / 300–520px" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "reopen 360 · hit strip 8" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-shell-overlay",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconInspectOutline12, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "全局浮层 · z20 · 根层不拦截点击" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "框架状态",
							detail: "页面框架根据视口和用户操作切换列状态，同时保留主内容和关键入口。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-shell-state-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "宽侧栏" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "侧边栏内容可见，工作区树和设置入口保持完整。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "56px rail" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "1024px 以下自动收起；保留品牌、新会话、工作区和设置入口。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconInspectOutline12, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "详情关闭 / 打开" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "关闭为 0；重新打开 360px，再在 300–520px 内拖拽。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "全局浮层" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "根层 click-through，Toast、Banner 等子项按需要恢复交互。" })
								] })
							]
						})]
					})
				]
			});
		}
		function Conversation() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 对话流",
						title: "对话流",
						children: "对话流负责按时间阅读用户、助手、思考、工具、上下文和错误信息。它在会话的单一滚动轴内工作；Composer 及其 Todo、Goal、Queue dock 由“输入区”页面定义。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "阅读与滚动规则",
							source: "ui-conversation/ChatView.tsx + ConversationRoot.tsx",
							detail: "对话流保持稳定列宽和阅读位置；加载历史、运行状态与回到底部各自有明确位置和行为。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-chat-rule-table",
							children: CHAT_FLOW_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "完整消息流",
							detail: "所有内容以 16px vertical rhythm 排列；每个节点保留其业务身份，而不是套进同一种卡片。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-chat-flow-specimen",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-chat-flow-column",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dsh-chat-load-older",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											children: "加载更早历史"
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-chat-context-row",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconInspectOutline12, {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "已压缩 409 条历史记录" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "展开查看摘要" })
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dsh-chat-user-row",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "dsh-chat-user-bubble",
											children: "请按真实 DSH 模块重构样式看板。"
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
										className: "dsh-chat-assistant",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "我会先确认组件归属、状态和页面关系，再把重复控件收敛为同一个命名变体。" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-module-message-actions",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "复制",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "赞同",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLikeOutline16, {})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "不赞同",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDislikeOutline16, {})
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-chat-reasoning",
										"data-running": "true",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconThinkOutline14, {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "思考中" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "正在整理模块之间的关系" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-chat-tool",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "读取" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-conversation/chat/ChatView.tsx" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-chat-error",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "本轮未完成" }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "读取记录时出现错误" }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "open-error" })
											] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												children: "重试"
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-chat-turn-status",
										children: ["深度求索中...", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "15秒" })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dsh-chat-pending",
										children: "待发送消息：继续核对轨迹页面。"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-chat-stats",
										children: [
											"25 轮 · 741 步",
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
											"LLM 325分7秒",
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
											"工具调用 14分7秒",
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
											"输入 124M tok · 输出 333K tok"
										]
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dsh-chat-to-bottom",
								"aria-label": "回到最新消息",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "Composer dock 的相邻关系",
							detail: "Todo、Goal、Queue 是输入区上方的按序贡献，不属于消息流节点；它们共享会话内容宽度轴但各自按有无数据出现。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-chat-dock-order",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Todo" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "order 0" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "计划投影存在时显示。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Goal" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "order 10" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "当前目标投影存在时显示。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Queue" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "order 20" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "会话队列存在时显示。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "快速跳转轨" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "当前无 native 实现" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "不能在产品页假设存在；需要先定义所有权、键盘路径和阅读锚点。" })
								] })
							]
						})]
					})
				]
			});
		}
		function Sidebar() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 侧边栏",
						title: "侧边栏",
						children: "侧边栏负责身份入口、收起和新会话；下方再分成工作台、工作区、会话树和设置。宽侧栏和 56px 收起栏是同一套结构的两种呈现。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "布局与密度",
							source: "ui-sidebar/SidebarRoot.module.css + ui-workspace/WorkspaceBrowser.tsx",
							detail: "侧边栏先固定区域与行高，再组合品牌、新会话、工作台、工作区、会话树和设置入口。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-sidebar-rule-table",
							children: SIDEBAR_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "宽侧栏",
							detail: "品牌、收起、新会话和工作区共同组成左侧导航；工作台与工作区标题行使用同一组图标按钮。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-sidebar-specimen",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-sidebar-brand",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.BrandWordmark, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "收起侧边栏",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, {})
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dsh-sidebar-new",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconNewChatOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "新会话" })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-sidebar-section-title",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "工作台" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "搜索工作台",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {})
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "添加工作台",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconProjectAddOutline16, {})
									})] })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-sidebar-workbench",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCordisPluginOutline14, {}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "DSH UI 样式看板" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, {})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-sidebar-section-title",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "工作区" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "搜索会话",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {})
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "添加工作区",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconProjectAddOutline16, {})
									})] })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-sidebar-project",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderOpen16, {}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "AI 项目" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, {})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-sidebar-rename",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "重命名" })]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("hr", {}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "is-danger",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "删除" })]
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dsh-sidebar-session",
									"data-selected": "true",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, {}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "分析工作区插件层级与功能" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", { children: "刚刚" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dsh-sidebar-session",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-sidebar-session-empty" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "DSH Cordis 插件开发规范" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", { children: "8小时" })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "收起与列表状态",
							detail: "收起后只保留可继续操作的入口；列表行的选中、运行、悬停菜单和重命名都需要单独处理。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-sidebar-state-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "56px rail" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Logo、展开、新会话和设置使用图标入口。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "进行中会话" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "状态点、子代理数量和当前会话标题同时出现。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "重命名与删除" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "工作区菜单使用统一行高和图标槽；删除使用 danger 状态，不新增不存在的操作。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "搜索与空列表" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "搜索工作台、搜索会话、无结果和加载状态不改变树的行高。" })
								] })
							]
						})]
					})
				]
			});
		}
		function Session() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 会话标题栏",
						title: "会话标题栏",
						children: "标题栏是会话区域的总入口：它显示父子会话关系、当前 Agent 预设、子代理和后台任务，右侧工具区可由插件追加分享等操作，Session 日志也由独立插件提供。下方页签决定进入对话还是轨迹。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "布局与贡献规则",
							source: "ui-conversation/ConversationSession.tsx + session header slots",
							detail: "标题栏提供层级与页签；动作入口来自按能力挂载的动作槽和工具槽。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-session-rule-table",
							children: SESSION_HEADER_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "完整标题栏",
							detail: "单层会话只有当前标题；子代理增加可点击的父级路径。动作槽和工具槽保持独立。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-session-header-specimen",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-session-title-row",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
										"aria-label": "会话层级",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												children: "AI 项目"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "/" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "分析工作区插件层级与功能" })
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-session-header-actions",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "dsh-session-preset",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutline16, {}), "Codex"]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "dsh-session-subagents",
												"aria-label": "8 个子代理，正在运行",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-session-running-dot" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "8 个子代理" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})
												]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "dsh-session-jobs",
												"aria-label": "后台任务",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-session-running-dot" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "2" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dsh-session-header-tools",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "dsh-session-log",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, {}), "Session 日志"]
										})
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-session-tabs",
								role: "tablist",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": "true",
									children: "对话"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": "false",
									children: "轨迹"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "能力出现条件",
							detail: "不要为了视觉对称渲染不存在的入口；普通会话、运行任务和插件贡献的组合会不同。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-session-action-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Agent 预设" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "当前会话显示预设；新会话页面才允许选择。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "子代理目录" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "状态点、数量和 disclosure；有子代理或加载态才出现。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "后台任务" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "有任务才出现；触发后展示按状态排序的任务清单。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCordisPluginOutline14, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "插件贡献" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Session 日志、分享等独立挂载，未注册时标题栏不预留位置。" })
								] })
							]
						})]
					})
				]
			});
		}
		function Composer() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 输入区",
						title: "输入区",
						children: "输入区是会话底部的连续工作面：按序显示 Todo、Goal、Queue dock，再提供多行编辑、附件、选择控件、上下文占用和发送或停止动作。它不是 32px 的单行 Input。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "布局与责任",
							source: "ui-conversation/InputBar.tsx + InputBar.module.css",
							detail: "Composer 持有卡片、文本层、附件和工具栏；问题、审批和计划评审接管整个输入席位，而不是在输入卡片里堆叠表单。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-composer-rule-table",
							children: COMPOSER_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "活动 Composer",
							detail: "dock 处于卡片上方；附件、文本和控制行位于同一张 r22 卡片中，所有控件有确定的尺寸与职责。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-composer-surface",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-composer-dock-stack",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "任务" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "1 进行中 · 5 待处理" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})
										] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16, {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "进行中的目标" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "按真实 DSH 模块重构样式看板" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "暂停目标",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconStopFill16, {})
											})
										] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "队列" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "2 条待发送消息" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})
										] })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dsh-composer-notice",
									children: "引用了 1 个文件；发送前会保留上下文关联。"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-composer-real-card",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-composer-real-attachments",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "移除附件",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFill14, {})
											})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "附件 rail 位于文本层之前" })]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-composer-real-text",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												"aria-hidden": "true",
												children: [
													"请按真实 ",
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("mark", { children: "DSH UI 样式看板" }),
													" 重构。"
												]
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
												"aria-label": "Composer 文本",
												readOnly: true,
												defaultValue: "请按真实 DSH UI 样式看板重构。",
												rows: 2
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-composer-real-row",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "dsh-composer-real-tools",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: "dsh-composer-real-add",
														"aria-label": "打开命令菜单",
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {})
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
														"aria-label": "权限模式",
														defaultValue: "plan",
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "plan",
															children: "Plan"
														})
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
														"aria-label": "会话模式",
														defaultValue: "readonly",
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "readonly",
															children: "只读"
														})
													})
												]
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "dsh-composer-real-trailing",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
														"aria-label": "选择模型",
														defaultValue: "v3",
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "v3",
															children: "DeepSeek V3.2"
														})
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: "dsh-composer-real-meter",
														"aria-label": "上下文占用",
														children: "42%"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: "dsh-composer-real-send",
														"aria-label": "发送",
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSendOutline16, {})
													})
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-composer-real-stats",
									children: [
										"25 轮 · 741 步",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
										"LLM 325分7秒",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
										"工具调用 14分7秒",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
										"首 token 平均 13.8秒 · 36 tok/s"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "输入状态与接管",
							detail: "运行和阻断改变可编辑性与主动作，但不改变宽度轴；不能为了复用把不同状态塞进相同的空白卡片。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-composer-state-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "无工作区" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "r22 虚线卡片是选择工作区触发器；文本和工具控件禁用，点击整个卡片。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "普通运行" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "textarea 只读；主 34px 动作切换为停止，TurnStatus 留在消息流中。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "连续子代理" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Send 保留，旁边独立 Stop；父会话不可用时显示只读说明。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "附件拖入" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "页面级 DropOverlay 显示可接受/拒绝；类型或大小错误通过 Toast 反馈。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "审批与问题" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ApprovalPanel 和问题面板接管 Composer seat，保持内容宽度并给出明确选项。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "计划评审" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "计划 Markdown、讨论、拒绝、批准与忙碌状态属于独立接管面板。" })] })
							]
						})]
					})
				]
			});
		}
		function Trajectory() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 轨迹",
						title: "轨迹",
						children: "轨迹是独立的会话视图，用时间概览和事件账本展示模型、工具和上下文的执行过程。它有自己的工具栏、滚动区、搜索、折叠、历史分页和记录检查器，不等同于对话里的工具行。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "布局与交互规则",
							source: "ui-trajectory/TrajectoryView.tsx + TrajectoryToolbar.tsx + TrajectoryTimeline.tsx + TrajectoryTable.tsx",
							detail: "工具栏、时间概览、事件账本和记录检查器各自承担不同的阅读任务，统一由轨迹视图管理滚动和选择。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-trajectory-rule-table",
							children: TRAJECTORY_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "时间概览与工具栏",
							detail: "顶部固定工具栏负责时间宽度、轮次/工具折叠和搜索；时间概览用 Input、Model、Tools 三条轨道表达真实耗时。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-trajectory-frame",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-trajectory-toolbar",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-active": "true",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, {}), "Duration"]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {}), "Turns"]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {}), "Calls"]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											"aria-label": "搜索轨迹",
											placeholder: "Search",
											readOnly: true
										})] })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-trajectory-timeline",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-trajectory-lanes",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Input" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Model" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Tools" })
										]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-trajectory-bars",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { className: "is-input" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { className: "is-model" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { className: "is-tool" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { className: "is-error" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "TTFT 1.3s · decode 1.1s" })
										]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-trajectory-body",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-trajectory-ledger",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
												className: "dsh-trajectory-load-earlier",
												children: "… 加载更早历史"
											}),
											[
												[
													"#128",
													"USER",
													"请按真实模块重构样式看板。",
													"—"
												],
												[
													"#129",
													"ASSISTANT",
													"我先核对页面结构与可用组件。",
													"2.4s"
												],
												[
													"#130",
													"TOOL",
													"read · ui-conversation/InputBar.tsx",
													"0.8s"
												],
												[
													"#131",
													"SUBTOOL",
													"grep · conversation.session.header",
													"0.2s"
												],
												[
													"#132",
													"ASSISTANT",
													"正在整理模块之间的关系",
													"running"
												],
												[
													"#133",
													"COMPACTED",
													"已压缩 409 条历史记录",
													"—"
												],
												[
													"#134",
													"CONTEXT",
													"skill-catalog · agent preset",
													"—"
												]
											].map(([index, kind, text, time]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: `dsh-trajectory-row kind-${kind.toLowerCase()}`,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "dsh-trajectory-event",
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: index }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: kind })]
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "dsh-trajectory-content",
														children: text
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", { children: time })
												]
											}, index)),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "dsh-trajectory-turn-break",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Turn 25" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "3 steps · 2 tool calls" })
												]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "dsh-trajectory-row is-selected",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: "dsh-trajectory-event",
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "#135" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: "TOOL" })]
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
														className: "dsh-trajectory-content",
														children: "Bash · pnpm run check → Typecheck passed"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", { children: "1.8s" })
												]
											})
										]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
										className: "dsh-trajectory-inspector",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Record #135" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "关闭记录检查器",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFill14, {})
											})] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													"data-active": "true",
													children: "Summary"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													children: "Payload"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													children: "Result"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													children: "Timing"
												})
											] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "dsh-trajectory-inspector-body",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", { children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "Event" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: "TOOL / Bash" })] }),
														/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "Status" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
															className: "is-success",
															children: "Completed"
														})] }),
														/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "Duration" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: "1.8s" })] }),
														/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: "Request" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: "Request #24" })] })
													] }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", { children: "Result" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", { children: "Typecheck passed\\n0 errors" })
												]
											})
										]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "轨迹中的完整状态",
							detail: "角色、生命周期和阅读状态是三个独立维度；进行中不虚构耗时，失败记录保留错误和重试入口。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-trajectory-state-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "7 类记录" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "SYSTEM · USER · CONTEXT · COMPACTED · ASSISTANT · TOOL · SUBTOOL" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "三种生命周期" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Completed · Pending · Failed；Request 还会显示 provider、model、usage、timing。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "大历史记录" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "超过 100 行启动虚拟滚动，只挂载可见行和 12 行缓冲；顶部 48px 自动补页。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "时间交互" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "点击选择、拖选范围、滚轮缩放、右键清除、Escape/双击复位、悬停 500ms 看详情。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "两类详情栏" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "轨迹内嵌记录检查器可调整宽度；应用框架右侧详情栏默认 0 宽，当前普通工具点击不可达。" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "窄屏转换" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "事件列 122px 变 50px，记录检查器变为右侧覆盖层，轨道和账本仍独立滚动。" })] })
							]
						})]
					})
				]
			});
		}
		const OVERLAY_RULES = [
			[
				"Tooltip / HoverCard",
				"fixed · z100 · Tooltip r8 · HoverCard 244px/r12",
				"由 hover 或 focus 延迟打开；HoverCard 可接住 pointer，Tooltip 只承载短标签，不放确认动作。"
			],
			[
				"Menu",
				"r12 · 218–360px · pad 4px · z100 / Portal z1100",
				"对象操作使用菜单；Portal 菜单必须高于 Modal，靠近边缘时调整方向并在自身 viewport 内滚动。"
			],
			[
				"Modal",
				"fixed inset 0 · z1000 · pad 24px · dialog 380px/r24",
				"遮罩阻断背景交互；焦点进入 dialog，Esc/遮罩关闭后回到触发源。"
			],
			[
				"Toast",
				"fixed · z1100 · r14 · shadow lv3",
				"短暂结果放在全局提示层；持续连接问题使用 ConnectionBanner，不用 Toast 轮询。"
			],
			[
				"全局反馈",
				"banner z100 · onboarding z1100",
				"连接、加载和空状态分别有持续时间与归属；失败必须同时给出原因和下一步动作。"
			],
			[
				"收束",
				"outside click · Escape · focus return",
				"每种浮层声明自己的打开、关闭和焦点策略；不要用同一个 outside-click 处理器覆盖所有类型。"
			]
		];
		function Overlays() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 浮层与全局反馈",
						title: "浮层与全局反馈",
						children: "菜单、Modal、HoverCard、Tooltip、Toast 和连接提示都使用浮层或固定层，但它们的触发方式、层级、交互收束和尺寸不同。此页先给出层级规则，再展示各自的产品组合。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GlobalFeedback, {}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "层级与收束规则",
							detail: "层级只解决覆盖关系；触发方式、焦点和关闭行为仍由具体浮层类型负责。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-overlay-rule-table",
							children: OVERLAY_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "Menu",
							source: "ui-primitives/Menu.tsx + Menu.module.css",
							detail: "菜单用于承载当前对象的操作；它会根据触发按钮的位置选择展开方向，并在靠近窗口边缘时自动调整。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-overlay-menu-specimen",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-overlay-menu-card",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "dsh-overlay-menu-label",
										children: "工作台操作"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEditOutline16, {}), "重命名"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderOpen16, {}), "移动到工作区"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "dsh-overlay-menu-separator" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "is-danger",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, {}), "删除"]
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-overlay-facts",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "width 218–360px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "radius 12px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "padding 4px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "z-index 1100" })
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
								title: "Modal 与 HoverCard",
								source: "ui-primitives/Modal.module.css + HoverCard.module.css",
								detail: "Modal 是确认和编辑的阻断层；HoverCard 是延迟信息卡，不应承担确认动作。"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-overlay-duo",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-overlay-modal",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "dsh-overlay-modal-mask" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dsh-overlay-modal-card",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "删除工作区？" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "删除只移除工作区注册；文件和会话日志会保留在未分组会话中。" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh-primitive-button is-outline",
												children: "取消"
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh-primitive-button is-primary",
												children: "确认"
											})] })
										]
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-overlay-hovercard",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "WorkspaceHoverContent" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "/Users/zhaowenbo/Downloads/AI项目" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {}), "复制路径"]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "HoverCard 默认延迟打开，固定在 row 右侧。" })
									]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-board-note",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "HoverCard 的固定深色背景和白色文字是 primitives 的局部例外，不应推广为全局 token。" })]
							})
						]
					})
				]
			});
		}
		function GlobalFeedback() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "dsh-specimen-band",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					title: "全局反馈状态",
					detail: "持续连接问题、短暂操作结果、首次引导和空状态使用不同的固定层；状态信息必须同时给出原因与下一步动作。"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dsh-overlay-feedback-strip",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "is-banner",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "ConnectionBanner" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "固定顶部 · 连接断开持续可见" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "top 0 · z100 · 12/18" })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "is-toast",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Toast" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "复制成功 · 不拦截点击" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "top 120 · z1100 · r14" })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "DropOverlay" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "拖入附件时覆盖工作面" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "mask-drop · 按拖拽状态显示" })
						] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "is-onboarding",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "OnboardingSurface" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "首次进入拥有独立工作面" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "inset 0 · z1100 · mask top 80" })
							]
						})
					]
				})]
			});
		}
		function Settings() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "产品页面 / 设置弹窗",
						title: "设置弹窗",
						children: "设置外层、通用设置、模型设置和插件设置不是一个组件。它们共享 Modal、导航、Input 和 Button 资源，但各自持有字段、保存、校验和待处理状态。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "布局与状态",
							detail: "设置外层保持稳定尺寸和滚动位置，具体设置页只负责自己的数据、字段与保存生命周期。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-settings-rule-table",
							children: SETTINGS_RULES.map(([title, value, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "设置窗口与单行输入框",
							source: "ui-settings-general/SettingsRoot.module.css + ui-primitives/Input.module.css",
							detail: "面板 800px，导航轨 188px，导航行 40px；单行 Input 32px / r8。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-module-settings-panel",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
								className: "dsh-module-settings-nav",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "设置" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-active": "true",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSettingsOutline16, {}), "通用"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDataOutline16, {}), "模型"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPersonalizationOutline16, {}), "插件"]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconAgentPresetOutline16, {}), "Agent 预设"]
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-module-settings-content",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "通用" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "关闭设置",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFill14, {})
								})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-module-settings-options",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["默认 Agent 预设", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
											className: "dsh-module-settings-input",
											icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}),
											defaultValue: "DeepSeek Harness"
										})] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["工作区过滤", /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
											className: "dsh-module-settings-input",
											placeholder: "输入文件夹名称"
										})] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "dsh-module-settings-row",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "紧凑模式" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "使用较紧凑的会话列表行距" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: "dsh-module-switch",
												"aria-label": "紧凑模式",
												"data-on": "true",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {})
											})]
										})
									]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "不同设置页面的写法",
							source: "ui-settings-models + ui-settings-plugins",
							detail: "模型设置和插件设置解决不同问题，因此字段排列、操作按钮和保存方式也不同。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-settings-recipe-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "模型设置" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "提供商卡片 · 适配器字段 · 采用/声明动作 · 删除确认" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-settings-models/ModelsSection" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCordisPluginOutline14, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "插件设置" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "页签 · 已访问面板 · 暂存字段 · 未保存标记 · 保存/放弃底栏" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-settings-plugins/PluginCard + fields" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Validation" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "field-level invalid state and async pending belong to feature section" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "feature-owned CSS" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconInspectOutline12, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Data logic" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "schema-form only rehydrates and sets values; it does not render fields" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "schema-form/model.ts" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "Input 责任对照",
							source: "ui-primitives/Input + ui-conversation/InputBar",
							detail: "相同的 label / border token 不代表相同组件。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-settings-comparison",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Settings Input" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "single-line · 32px · r8 · Layer 1 · focus-within brand border" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-primitives/Input" })
							] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Conversation Composer" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "multi-line · r22 · Input major · lv2 shadow · mirror/backdrop · toolbar" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-conversation/InputBar" })
							] })]
						})]
					})
				]
			});
		}
		function Accessibility() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "规范 / 无障碍",
						title: "无障碍",
						children: "无障碍是每个产品页面的验收条件：键盘能完成同样的任务，焦点清楚可见，状态能被读屏理解，减少动效后信息和动作仍然完整。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "键盘操作",
							detail: "所有可操作元素都能通过键盘到达，并且保持和鼠标操作一致。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-a11y-keyboard-list",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "Tab" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "移动焦点" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "按照页面顺序访问按钮、输入框、菜单和链接。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "Enter / Space" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "执行操作" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "打开页面、选择会话、提交表单或确认动作。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "Esc" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "收束当前层" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "关闭菜单、HoverCard、Modal 或搜索输入，并恢复合理焦点。" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "↑ ↓" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "移动选项" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "在树形列表、菜单、页签和命令选项中移动。" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "语义与读屏",
							detail: "视觉上的状态还要有语义对应，不能只依赖颜色或图标。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-a11y-role-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-a11y-role",
										children: "treeitem"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "会话与工作区行" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "aria-selected / aria-expanded" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-a11y-role",
										children: "dialog"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Modal 和设置窗口" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "aria-modal / labelled heading" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-a11y-role",
										children: "status"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "加载、运行与连接提示" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "文字状态 + live announcement" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-a11y-role",
										children: "button"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "图标操作" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "aria-label 描述动作" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "焦点与动效",
							detail: "焦点环不能被 outline: none 删除；减少动效由每个拥有动画的组件单独处理。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-a11y-focus-demo",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-focus-demo": "true",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {}), "键盘焦点"]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {}), "运行中"]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									defaultChecked: true
								}), "减少动效"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "focus-visible 使用清晰边界；TurnStatus shimmer、ReasoningRow sweep 和位移过渡分别收束。" })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "验收清单",
							detail: "实现完成前逐项检查；任一项失败都不能只靠视觉截图放过。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-a11y-checklist",
							children: A11Y_CHECKS.map(([title, detail, failure]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: failure })
							] }, title))
						})]
					})
				]
			});
		}
		function States() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "使用规范 / 状态与响应式",
						title: "状态与响应式",
						children: "状态需要同时说明当前进度、对象和可执行动作。对话、思考行、工具、按钮不会因为同样处于“进行中”就使用同一种视觉表现。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "进行中状态",
							detail: "进行中需要同时表达状态、当前对象和下一步动作。相同的状态语义在对话、思考行、工具和主操作中使用不同的表现。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-running-state-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-running-thinking",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconThinkOutline14, {}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
											className: "dsh-running-shimmer",
											children: "深度求索中..."
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "TurnStatus：蓝色文字 shimmer · 1.8s" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-running-reasoning",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconThinkOutline14, {}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "思考中" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ReasoningRow：300px sweep · 2.6s" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-running-tool",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16, {}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "读取" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "工具行：保留任务与对象" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-running-button",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "停止",
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconStopFill16, {})
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "停止" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "主操作切换为下一步动作" })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "状态维度",
							detail: "先确定状态属于哪一维，再决定视觉表达；同一个组件可以同时拥有多个维度。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-state-matrix",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "可用性" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "可用 · 禁用 · 不可交互 · 只读 · 阻塞" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "输入框 / 按钮 / Composer / 设置" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "进度" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "空闲 · 加载 · 进行中 · 等待处理 · 成功 · 已停止 · 错误" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "工具 / 会话 / 设置" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "选择与焦点" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "默认 · 悬停 · 按下 · 选中 · 键盘焦点" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "列表行 / 页签 / 导航 / 图标按钮" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "展开与浮层" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "收起 · 展开 · 菜单打开 · 弹窗打开 · HoverCard 打开" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "工作区 / 工具 / 浮层" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "环境" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "宽屏 · 窄屏 · rail · 移动端 · 减少动效" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "应用框架决定视口级状态；页面响应其可用空间" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Content" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "empty · streaming · interrupted · retry · history error" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Conversation and message domain" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "响应式断点责任",
							source: "ui-layout/columns.ts + package-local CSS",
							detail: "外层断点和内层组合分开：1024px 以下 shell 进入 rail，720px 以下工作台二级侧栏纵向连续。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-responsive-table",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "≥ 1024px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "AppFrame wide columns，sidebar 280px，workspace header / tree 完整展示。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-layout" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "< 1024px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "shell collapsed，sidebar 56px rail；Workbench 不渲染自己的 rail icons。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "dsh-workbench + ui-sidebar" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "≤ 720px" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Workbench secondary sidebar 纵向连续，Composer / settings 内容各自收缩。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "package-local media rules" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "reduced motion" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "shell fade、search transition、running sweep 都应停止或缩短。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-theme + feature CSS" })
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "状态检查清单",
							source: "real DSH browser/component tests",
							detail: "设计看板以后每新增一个标本，都要说明它覆盖的状态和未覆盖的状态。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-checklist",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "尺寸与 owner 源码一致" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "暗色主题使用 semantic alias" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "焦点、禁用、错误可识别" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "局部 literal 颜色已登记为 exception" })] })
							]
						})]
					})
				]
			});
		}
		function Governance() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoardIntro, {
						path: "实现记录",
						title: "实现记录",
						children: "这里集中记录每个样本对应的页面、组件、尺寸、状态和实现位置，方便后续更新时保持一致。外观相似的内容也不自动合并。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "实现信息",
							source: "样式看板维护规则",
							detail: "新增或修改样本时，至少记录页面区域、所属模块、挂载位置、尺寸约束、状态触发、源码依据和是否为局部例外。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-traceability-table",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-head",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "样本标识" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "所属模块" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "挂载位置 / DOM 根" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "尺寸约束" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "状态 / 源码" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "shell.frame" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-layout + ui-sidebar" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "root → sidebar | conversation | details | shell.overlay" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "280 / 56 / 300–520 / hit 8" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "宽屏、收起栏、详情打开 · AppFrame.tsx" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "conversation.header" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-conversation" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "conversation.session.header → actions | utilities | conversation.view" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "top 12 / left 20 / right 28 / active 2" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "路径、能力、页签 · ConversationSession.tsx" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "conversation.chat" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-conversation/chat + ui-tool" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "conversation.view → conversation.chat.node → tool.call.toolview" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "748 / gap 16 / bubble 525" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "流式、错误、重试、历史 · ChatView.tsx" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "conversation.composer" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-conversation" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "conversation.composer.bar → card[data-composer-card]" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "748 / 780 / r22 / 34" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "初始、活动、运行 · InputBar.tsx" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "settings.panel" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-settings-general" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "settings → nav + section + item" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "800 / 188 / header 54 / r24" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "打开、切换、关闭 · SettingsRoot.tsx" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "settings.input" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-primitives + ui-settings-general" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "Input.wrap → settings options" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "32 / r8 / 16 icon slot" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "焦点、禁用 · Input.module.css" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "trajectory.view" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-trajectory" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "conversation.view → toolbar + timeline + table + inspector" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "32 / 50 / 122 / 320–440" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "搜索、折叠、选中、调整 · TrajectoryView.tsx" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "tool.row" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-tool" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "tool.call.toolview → DisclosureRow" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "24 / 16 leading" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "进行中、错误、展开 · ToolRow" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dsh-board-table-row",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "workspace.row" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "ui-workspace" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "sidebar.workspaces → treeitem" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "34 / 32 / r8" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "选中、拖拽、菜单 · Rows" })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "资源采用状态",
							detail: "只把已验证且实际消费的资源称为规范；源码声明、受控例外和禁止采用项必须保持不同状态。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-theme-table",
							children: IMPLEMENTATION_AUDIT_ROWS.map(([title, status, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: status }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })
							] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "变更验收门槛",
							detail: "新增或改动样本必须同时通过下面七项；缺少任何一项时继续查源码或回到所属产品页，不能靠相似外观补齐。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dsh-foundation-rule-grid",
							children: IMPLEMENTATION_GATES.map(([title, detail]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: detail })] }, title))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "模块归属",
							detail: "每个页面样本都必须能回答由哪个模块拥有、挂载到哪里、有哪些状态，以及哪份源码是依据。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-board-module-table",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-board-table-head",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "模块层" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "所属模块" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "挂载位置" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "DOM 结构" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "状态 / 源码" })
								]
							}), MODULE_ROWS.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dsh-board-table-row",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: row.layer }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: row.owner }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: row.slot }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: row.dom }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("code", { children: [
										row.states,
										" · ",
										row.source
									] })
								]
							}, row.layer))]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "dsh-specimen-band",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
							title: "特殊情况",
							source: "当前组件样式中的局部例外",
							detail: "这些特殊处理只保留在实际使用它们的页面中，不提升为全局颜色或组件。"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-exception-list",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "悬浮卡" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "固定深色背景与白色文字，为复制路径的对比度例外。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-primitives/HoverCard.module.css" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "引用标签" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "用户引用标签使用局部 rgba 蓝色，属于 MessageItem 产品特例。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-conversation/MessageItem.module.css" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "发送图标" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "发送箭头为白色 currentColor，配合信息按钮填充，不是普通文字变量。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-conversation/InputBar.module.css" })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "未定义变量" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "模型设置中的历史未定义变量不得复制进基础页。" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "ui-settings-models/ModelsSection.module.css" })
								] })
							]
						})]
					})
				]
			});
		}
		function DesignBoardSidebar({ instance, updateConfig }) {
			const active = sectionFor(instance.config.section);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
				className: "dsh-specimen-sidebar",
				"aria-label": "DSH UI 样式看板导航",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-specimen-sidebar-title",
						children: "DSH UI"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "从基础资源与规范进入产品页面" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-specimen-sidebar-nav",
						children: SECTION_GROUPS.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dsh-specimen-sidebar-group",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dsh-specimen-sidebar-group-label",
								children: group.label
							}), group.sections.map((section) => {
								const Icon = section.icon;
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "dsh-specimen-sidebar-link",
									"data-active": active === section.id,
									onClick: () => {
										updateConfig({ section: section.id });
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { size: 16 }), section.label]
								}, section.id);
							})]
						}, group.label))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dsh-specimen-sidebar-footer",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "系统范围" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "DSH Web UI" })]
					})
				]
			});
		}
		function DesignBoard({ instance }) {
			const section = sectionFor(instance.config.section);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-specimen-board",
				children: [
					section === "overview" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Overview, {}),
					section === "shell" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Shell, {}),
					section === "sidebar" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Sidebar, {}),
					section === "settings" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Settings, {}),
					section === "session" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Session, {}),
					section === "chat" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Conversation, {}),
					section === "composer" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Composer, {}),
					section === "trajectory" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Trajectory, {}),
					section === "overlays" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Overlays, {}),
					section === "foundations" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Foundations, {}),
					section === "icons" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icons, {}),
					section === "primitives" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitives, {}),
					section === "states" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(States, {}),
					section === "accessibility" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Accessibility, {}),
					section === "governance" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Governance, {})
				]
			});
		}
		//#endregion
		//#region src/client/styles.ts
		const DESIGN_BOARD_STYLE = `
.dsh-specimen-board { min-height: 100%; container-type: inline-size; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); }
.dsh-specimen-board *, .dsh-specimen-board *::before, .dsh-specimen-board *::after { box-sizing: border-box; }
.dsh-specimen-sidebar { display: flex; flex-direction: column; min-height: 100%; padding: 18px 12px 12px; background: var(--dsw-specific-sidebar-fill); color: var(--dsw-alias-label-primary); }
.dsh-specimen-sidebar-title { padding: 0 8px; font: var(--dsw-font-s-strong-14); }
.dsh-specimen-sidebar > p { margin: 4px 8px 18px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-sidebar-nav { display: grid; gap: 14px; }
.dsh-specimen-sidebar-group { display: grid; gap: 2px; min-width: 0; }
.dsh-specimen-sidebar-group-label { padding: 0 8px 4px; color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); text-transform: uppercase; }
.dsh-specimen-sidebar-link { display: flex; align-items: center; gap: 8px; width: 100%; height: 32px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; cursor: pointer; text-align: left; font: var(--dsw-font-xs-13); }
.dsh-specimen-sidebar-link > svg { flex: none; width: 16px; color: var(--dsw-alias-label-tertiary); }
.dsh-specimen-sidebar-link:hover, .dsh-specimen-sidebar-link[data-active="true"] { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-specimen-sidebar-link[data-active="true"] { font: var(--dsw-font-xs-strong-13); }
.dsh-specimen-sidebar-footer { display: flex; justify-content: space-between; gap: 8px; margin-top: auto; padding: 14px 8px 0; border-top: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-11); }
.dsh-specimen-sidebar-footer strong { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxxs-strong-11); }
.dsh-specimen-content { width: min(100%, 1080px); margin: 0 auto; padding: 40px 48px 64px; }
.dsh-specimen-intro { padding-bottom: 28px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-intro > span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-strong-11); letter-spacing: .08em; }
.dsh-specimen-intro h1 { margin: 8px 0; color: var(--dsw-alias-label-primary); font: var(--dsw-font-xl-24); }
.dsh-specimen-intro p { max-width: 760px; margin: 0; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-specimen-band { padding: 28px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
.dsh-specimen-heading h2 { margin: 0; font: var(--dsw-font-base-strong-16); }
.dsh-specimen-heading p { max-width: 660px; margin: 4px 0 0; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-specimen-source { flex: none; max-width: 42%; overflow: hidden; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-layer-table, .dsh-foundation-theme-table, .dsh-foundation-font-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-layer-table > div { display: grid; grid-template-columns: 150px 220px minmax(0, 1fr); grid-template-rows: auto auto; gap: 4px 16px; align-items: center; min-height: 68px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-layer-table strong { grid-row: span 2; font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-layer-table code, .dsh-foundation-theme-table code, .dsh-foundation-font-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-layer-table span, .dsh-foundation-layer-table small, .dsh-foundation-font-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-foundation-layer-table small { grid-column: 3; color: var(--dsw-alias-label-tertiary); }
.dsh-foundation-rule-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-foundation-rule-grid > div { display: grid; gap: 6px; min-height: 92px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-foundation-rule-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-rule-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-foundation-theme-table > div, .dsh-foundation-font-table > div { display: grid; grid-template-columns: 150px minmax(280px, 1fr) minmax(0, 1fr); gap: 16px; align-items: center; min-height: 62px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-theme-table strong, .dsh-foundation-font-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-theme-table code, .dsh-foundation-font-table code { min-width: 0; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-theme-table span, .dsh-foundation-font-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-static-family-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; }
.dsh-static-family { min-width: 0; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-static-family-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; min-height: 42px; padding-top: 12px; }
.dsh-static-family-heading strong { font: var(--dsw-font-xs-strong-13); }
.dsh-static-family-heading span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-static-token-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: var(--dsw-alias-border-l1); }
.dsh-static-token { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: center; min-height: 38px; padding: 6px 8px; background: var(--dsw-alias-bg-base); }
.dsh-static-token .dsh-specimen-swatch { width: 22px; height: 22px; border-radius: 4px; }
.dsh-static-token code { min-width: 0; overflow-wrap: anywhere; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-static-token small { grid-column: 2; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-xxxs-11); }
.dsh-specimen-token-table, .dsh-specimen-type-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-token-row { display: grid; grid-template-columns: 28px minmax(180px, 1fr) minmax(130px, .7fr); align-items: center; gap: 12px; min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-swatch { width: 28px; height: 28px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; }
.dsh-specimen-token-copy { display: grid; gap: 2px; min-width: 0; }
.dsh-specimen-token-copy strong { font: var(--dsw-font-xs-strong-13); }
.dsh-specimen-token-copy code, .dsh-specimen-token-row > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-type-head, .dsh-specimen-type-row { display: grid; grid-template-columns: 150px minmax(0, 1fr) 130px 250px 58px; align-items: center; gap: 12px; }
.dsh-specimen-type-head { min-height: 34px; border-bottom: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); }
.dsh-specimen-type-row { min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-type-row > span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-specimen-type-row strong, .dsh-specimen-type-row code { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-specimen-type-row strong { color: var(--dsw-alias-label-primary); }
.dsh-specimen-type-row small { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-type-row code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-specimen-type-row em { color: var(--dsw-alias-label-caption); font: normal var(--dsw-font-xxxs-11); }
.dsh-specimen-type-row em[data-status="已消费"] { color: var(--dsw-alias-state-success-primary); }
.dsh-specimen-type-row em[data-status="仅声明"] { color: var(--dsw-alias-label-tertiary); }
.dsh-foundation-metric-table, .dsh-foundation-motion-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-metric-table > div, .dsh-foundation-motion-table > div { display: grid; grid-template-columns: 180px 340px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-foundation-metric-table strong, .dsh-foundation-motion-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-foundation-metric-table code, .dsh-foundation-motion-table code { min-width: 0; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-foundation-metric-table span, .dsh-foundation-motion-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-board-layer-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-layer-strip > div { display: grid; grid-template-columns: 32px 1fr; grid-template-rows: auto auto; column-gap: 10px; min-height: 82px; padding: 16px 14px; border-right: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-layer-strip > div:last-child { border-right: 0; }
.dsh-board-layer-strip span { grid-row: span 2; color: var(--dsw-alias-state-business-primary); font: var(--dsw-font-s-strong-14); }
.dsh-board-layer-strip strong { font: var(--dsw-font-s-strong-14); }
.dsh-board-layer-strip small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-board-module-table, .dsh-traceability-table { border-top: 1px solid var(--dsw-alias-border-l1); overflow: hidden; }
.dsh-board-table-head, .dsh-board-table-row { display: grid; grid-template-columns: 110px minmax(150px, 1fr) minmax(150px, 1.1fr) minmax(125px, .9fr) minmax(150px, 1fr); gap: 12px; align-items: start; padding: 12px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-table-head { color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); }
.dsh-board-table-row { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-board-table-row strong { color: var(--dsw-alias-label-primary); font: var(--dsw-font-xs-strong-13); }
.dsh-board-table-row code, .dsh-board-geometry-table code, .dsh-settings-recipe-grid code, .dsh-traceability-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-board-geometry-table > div { display: grid; grid-template-columns: minmax(160px, 1fr) 210px minmax(180px, 1.2fr); gap: 16px; align-items: center; min-height: 48px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-geometry-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-board-geometry-table span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-board-callouts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.dsh-board-callouts > div, .dsh-board-note { display: grid; grid-template-columns: 16px minmax(0, 1fr); column-gap: 8px; row-gap: 3px; color: var(--dsw-alias-label-secondary); }
.dsh-board-callouts svg, .dsh-board-note svg { grid-row: span 2; color: var(--dsw-alias-state-business-primary); }
.dsh-board-callouts strong { font: var(--dsw-font-xs-strong-13); }
.dsh-board-callouts span, .dsh-board-note span { font: var(--dsw-font-xs-13); }
.dsh-settings-recipe-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-recipe-grid > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 3px; min-height: 86px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-recipe-grid > div:nth-child(odd) { padding-right: 18px; }
.dsh-settings-recipe-grid > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-recipe-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-settings-recipe-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-settings-recipe-grid code { grid-column: 2; }
.dsh-icon-rule-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-icon-rule-grid > div { display: grid; gap: 5px; min-height: 94px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-icon-rule-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-icon-rule-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-icon-rule-grid small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-icon-geometry-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-icon-geometry-grid > div { display: grid; grid-template-columns: 42px minmax(0, 1fr); grid-template-rows: auto auto; gap: 3px 10px; align-items: center; min-height: 86px; padding: 16px; background: var(--dsw-alias-bg-layer-1); }
.dsh-icon-geometry-grid > div > button, .dsh-icon-status-14 { grid-row: span 2; display: inline-flex; align-items: center; justify-content: center; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-icon-button-28 { width: 28px; height: 28px; border: 0; border-radius: 50%; }
.dsh-icon-button-36 { width: 36px; height: 36px; border: 0; border-radius: 50%; }
.dsh-icon-button-28:hover, .dsh-icon-button-36:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-icon-button-28:focus-visible, .dsh-icon-button-36:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dsh-icon-status-14 { width: 28px; height: 28px; color: var(--dsw-alias-state-business-primary); }
.dsh-icon-geometry-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-icon-geometry-grid code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-specimen-icon-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-icon-item { display: grid; grid-template-columns: 36px minmax(0, 1fr); gap: 10px; align-items: center; min-height: 70px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-icon-item:nth-child(odd) { padding-right: 18px; }
.dsh-specimen-icon-item:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-specimen-icon-box { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border-radius: 8px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); }
.dsh-specimen-icon-item > div { display: grid; min-width: 0; gap: 1px; }
.dsh-specimen-icon-item strong { font: var(--dsw-font-xs-strong-13); }
.dsh-specimen-icon-item code, .dsh-specimen-icon-item span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-specimen-icon-states { display: flex; flex-wrap: wrap; gap: 8px; }
.dsh-specimen-icon-states button { display: inline-flex; align-items: center; gap: 6px; height: 28px; border: 0; border-radius: 14px; padding: 0 10px; color: var(--dsw-alias-label-secondary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-specimen-icon-states button[data-state="hover"], .dsh-specimen-icon-states button[data-state="selected"] { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-interactive-bg-hover); }
.dsh-specimen-icon-states button[data-state="selected"] { background: var(--dsw-alias-interactive-bg-active); }
.dsh-specimen-icon-states button:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dsh-specimen-icon-states button:disabled { cursor: not-allowed; opacity: .4; }
.dsh-primitive-rule-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-primitive-rule-grid > div { display: grid; gap: 5px; min-height: 94px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-primitive-rule-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-primitive-rule-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-primitive-rule-grid small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-primitive-button-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.dsh-primitive-button { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 36px; border: 0; border-radius: 18px; padding: 0 14px; color: var(--dsw-alias-label-primary); background: transparent; cursor: pointer; font: var(--dsw-font-s-14); }
.dsh-primitive-button:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-primitive-button:disabled { cursor: not-allowed; opacity: .4; }
.dsh-primitive-button.is-primary { color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-primary-fill); }
.dsh-primitive-button.is-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }
.dsh-primitive-button.is-outline { border: 1px solid var(--dsw-alias-border-l2); }
.dsh-primitive-button.is-toolbar { color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-tool-bar-fill); }
.dsh-primitive-button.is-small { height: 28px; border-radius: 14px; padding: 0 10px; font: var(--dsw-font-xxs-12); }
.dsh-board-spec-grid { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 16px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-primitive-input-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.dsh-primitive-input-row label, .dsh-module-settings-options label { display: grid; gap: 6px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-primitive-input { width: 100%; }
.dsh-primitive-input-row .dsh-primitive-input input { min-width: 0; }
.dsh-board-note { margin-top: 18px; padding: 10px 12px; border-top: 1px solid var(--dsw-alias-border-l1); border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-board-note svg { color: var(--dsw-alias-state-error-primary); }
.dsh-primitive-disclosure { display: grid; gap: 2px; }
.dsh-primitive-disclosure > div { display: flex; align-items: center; min-width: 0; height: 24px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-primitive-disclosure > div > span:not(.dsh-primitive-leading):not(.dsh-primitive-separator) { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-primitive-disclosure > div > svg { flex: none; margin-left: auto; color: var(--dsw-alias-label-tertiary); }
.dsh-primitive-leading { display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; margin-right: 6px; color: var(--dsw-alias-label-tertiary); }
.dsh-primitive-separator { width: 3px; height: 3px; margin: 0 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary); }
.dsh-primitive-catalog { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-primitive-catalog > div { display: grid; gap: 5px; min-height: 82px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-primitive-catalog > div:nth-child(odd) { padding-right: 18px; }
.dsh-primitive-catalog > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-primitive-catalog strong { font: var(--dsw-font-xs-strong-13); }
.dsh-primitive-catalog span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-shell-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-shell-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-shell-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-shell-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-shell-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-shell-diagram { position: relative; display: grid; grid-template-columns: 180px minmax(0, 1fr) 8px 138px; min-height: 248px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; overflow: hidden; background: var(--dsw-alias-bg-layer-1); }
.dsh-shell-diagram > aside { display: grid; align-content: start; gap: 6px; padding: 18px 16px; background: var(--dsw-specific-sidebar-fill); color: var(--dsw-alias-label-primary); }
.dsh-shell-diagram > aside strong, .dsh-shell-diagram > aside small { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-shell-diagram > aside small { color: var(--dsw-alias-label-tertiary); }
.dsh-shell-diagram > main { display: grid; grid-template-rows: 42px 1fr 52px; min-width: 0; background: var(--dsw-alias-bg-base); }
.dsh-shell-diagram header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 18px; border-bottom: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-shell-chat-lines { display: grid; align-content: center; gap: 10px; padding: 22px 14%; }
.dsh-shell-chat-lines span { display: block; height: 10px; border-radius: 5px; background: var(--dsw-alias-interactive-bg-hover); }
.dsh-shell-chat-lines span:nth-child(2) { width: 75%; }
.dsh-shell-chat-lines span:nth-child(3) { width: 58%; }
.dsh-shell-composer-line { width: 74%; height: 32px; align-self: center; justify-self: center; border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; background: var(--dsw-specific-input-major); }
.dsh-shell-resize-handle { position: relative; z-index: 1; cursor: col-resize; background: transparent; }
.dsh-shell-resize-handle::after { position: absolute; inset-block: 0; left: 3px; width: 1px; content: ''; background: var(--dsw-alias-border-l2); }
.dsh-shell-resize-handle:hover::after { background: var(--dsw-alias-state-business-primary); }
.dsh-shell-details { background: var(--dsw-alias-bg-layer-2) !important; color: var(--dsw-alias-label-primary) !important; }
.dsh-shell-details strong { color: var(--dsw-alias-label-secondary) !important; }
.dsh-shell-overlay { position: absolute; right: 18px; bottom: 12px; display: inline-flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px dashed var(--dsw-alias-border-l3); border-radius: 8px; color: var(--dsw-alias-label-tertiary); background: var(--dsw-alias-bg-layer-2); font: var(--dsw-font-xxs-12); }
.dsh-shell-state-grid, .dsh-settings-recipe-grid, .dsh-state-matrix { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-shell-state-grid > div, .dsh-state-matrix > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 3px; min-height: 82px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-shell-state-grid svg { grid-row: span 2; color: var(--dsw-alias-label-tertiary); }
.dsh-shell-state-grid strong, .dsh-state-matrix strong { font: var(--dsw-font-xs-strong-13); }
.dsh-shell-state-grid span, .dsh-state-matrix span, .dsh-state-matrix small { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
@keyframes dsh-board-thinking-sweep { 0% { left: -300px; } 90%, 100% { left: 100%; } }
.dsh-module-message-actions { display: flex; gap: 12px; margin-top: 16px; }
.dsh-module-message-actions button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-module-message-actions button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-responsive-table > div { display: grid; grid-template-columns: 120px minmax(0, 1fr) 190px; gap: 14px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-responsive-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-responsive-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overlay-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-overlay-rule-table > div { display: grid; grid-template-columns: 190px 330px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-overlay-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overlay-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-overlay-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overlay-menu-specimen { display: flex; align-items: flex-start; gap: 28px; }
.dsh-overlay-menu-card { width: min(280px, 100%); padding: 4px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; box-shadow: var(--dsw-shadow-lv3); background: var(--dsw-specific-menu); }
.dsh-overlay-menu-label { padding: 8px 12px 6px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-overlay-menu-card button { display: flex; align-items: center; gap: 8px; width: 100%; height: 40px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; text-align: left; font: var(--dsw-font-s-14); }
.dsh-overlay-menu-card button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-overlay-menu-card button.is-danger { color: var(--dsw-alias-state-error-primary); }
.dsh-overlay-menu-separator { height: 1px; margin: 4px 8px; background: var(--dsw-alias-border-l1); }
.dsh-overlay-facts { display: grid; align-content: center; gap: 8px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-overlay-feedback-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 16px; }
.dsh-overlay-feedback-strip > div { display: grid; gap: 6px; min-height: 78px; padding: 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-base); }
.dsh-overlay-feedback-strip strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overlay-feedback-strip span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-overlay-feedback-strip code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-overlay-feedback-strip .is-toast { margin-top: 10px; border-radius: 14px; color: var(--dsw-alias-label-primary-inverted); background: var(--dsw-alias-button-contrast-fill); }
.dsh-overlay-feedback-strip .is-banner { border-top: 3px solid var(--dsw-alias-state-error-primary); }
.dsh-overlay-feedback-strip .is-onboarding { border-radius: 0; background: var(--dsw-alias-bg-layer-1); }
.dsh-overlay-duo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.dsh-overlay-modal, .dsh-overlay-hovercard { position: relative; min-height: 210px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; overflow: hidden; background: var(--dsw-alias-bg-layer-1); }
.dsh-overlay-modal-mask { position: absolute; inset: 0; background: var(--dsw-alias-bg-mask-1); }
.dsh-overlay-modal-card { position: absolute; inset: 28px 24px; display: grid; align-content: center; gap: 10px; padding: 24px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 24px; box-shadow: var(--dsw-shadow-lv3); background: var(--dsw-alias-bg-layer-2); }
.dsh-overlay-modal-card strong, .dsh-overlay-hovercard strong { font: var(--dsw-font-s-strong-14); }
.dsh-overlay-modal-card p { margin: 0; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overlay-modal-card > div { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.dsh-overlay-hovercard { display: grid; align-content: start; gap: 6px; padding: 18px; background: var(--dsw-alias-tooltip-bg); color: var(--dsw-alias-label-primary-foreground); }
.dsh-overlay-hovercard strong, .dsh-overlay-hovercard span, .dsh-overlay-hovercard small { color: var(--dsw-alias-label-primary-foreground); }
.dsh-overlay-hovercard span, .dsh-overlay-hovercard small { font: var(--dsw-font-xxs-12); overflow-wrap: anywhere; }
.dsh-overlay-hovercard button { display: inline-flex; width: fit-content; align-items: center; gap: 6px; margin-top: 8px; border: 0; border-radius: 14px; padding: 0 8px; height: 28px; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-tool-bar-fill); font: var(--dsw-font-xxs-12); }
.dsh-settings-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-settings-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-settings-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-module-settings-panel { display: grid; grid-template-columns: 188px minmax(0, 1fr); width: min(800px, 100%); min-height: 420px; overflow: hidden; border-radius: 24px; box-shadow: var(--dsw-shadow-lv3); background: var(--dsw-alias-bg-layer-2); }
.dsh-module-settings-nav { display: grid; align-content: start; gap: 2px; padding: 20px 12px; background: var(--dsw-specific-sidebar-fill); }
.dsh-module-settings-nav > strong { padding: 0 12px 12px; color: var(--dsw-alias-label-primary); font: var(--dsw-font-s-strong-14); }
.dsh-module-settings-nav button { display: flex; align-items: center; gap: 8px; height: 40px; border: 0; border-radius: 12px; padding: 9px 16px 9px 12px; color: var(--dsw-alias-label-secondary); background: transparent; cursor: pointer; text-align: left; font-size: 14px; line-height: 22px; }
.dsh-module-settings-nav button[data-active="true"], .dsh-module-settings-nav button:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-specific-sidebar-nav-item-active); }
.dsh-module-settings-content { display: grid; grid-template-rows: 54px minmax(0, 1fr); min-width: 0; }
.dsh-module-settings-content > header { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid var(--dsw-alias-border-l1); font: var(--dsw-font-s-strong-14); }
.dsh-module-settings-content > header button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-module-settings-options { display: grid; align-content: start; gap: 18px; overflow: auto; padding: 24px; }
.dsh-module-settings-input { width: 100%; }
.dsh-module-settings-input input { min-width: 0; }
.dsh-module-settings-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 4px; }
.dsh-module-settings-row > div { display: grid; gap: 3px; }
.dsh-module-settings-row strong { font: var(--dsw-font-xs-strong-13); }
.dsh-module-settings-row span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-module-switch { position: relative; width: 36px; height: 22px; flex: none; border: 0; border-radius: 11px; padding: 0; background: var(--dsw-alias-border-l3); }
.dsh-module-switch span { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--dsw-alias-bg-layer-1); }
.dsh-module-switch[data-on="true"] { background: var(--dsw-alias-state-business-primary); }
.dsh-module-switch[data-on="true"] span { left: 17px; }
.dsh-settings-recipe-grid { border: 0; background: transparent; }
.dsh-settings-recipe-grid > div { min-height: 92px; padding: 16px 0; background: transparent; }
.dsh-settings-comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-comparison > div { display: grid; gap: 6px; min-height: 110px; padding: 18px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-comparison > div + div { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-settings-comparison strong { font: var(--dsw-font-s-strong-14); }
.dsh-settings-comparison span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-settings-comparison code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-primitive-button.is-danger { color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-state-error-primary); }
.dsh-a11y-keyboard-list { display: grid; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-keyboard-list > div { display: grid; grid-template-columns: 74px 120px minmax(0, 1fr); gap: 14px; align-items: center; min-height: 52px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-keyboard-list kbd, .dsh-a11y-role { display: inline-flex; width: fit-content; min-width: 40px; height: 24px; align-items: center; justify-content: center; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; padding: 0 7px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1); font: var(--dsw-font-markdown-code-block-small); }
.dsh-a11y-keyboard-list strong { font: var(--dsw-font-xs-strong-13); }
.dsh-a11y-keyboard-list span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-a11y-role-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-a11y-role-grid > div { display: grid; grid-template-columns: 90px minmax(0, 1fr); grid-template-rows: auto auto; gap: 3px 12px; align-items: center; min-height: 72px; padding: 12px 14px; background: var(--dsw-alias-bg-layer-1); }
.dsh-a11y-role-grid .dsh-a11y-role { grid-row: span 2; color: var(--dsw-alias-state-business-primary); border-color: var(--dsw-alias-state-business-primary); background: transparent; }
.dsh-a11y-role-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-a11y-role-grid small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-a11y-focus-demo { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 16px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); }
.dsh-a11y-focus-demo button { display: inline-flex; align-items: center; gap: 6px; height: 32px; border: 0; border-radius: 16px; padding: 0 12px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); font: var(--dsw-font-xs-13); }
.dsh-a11y-focus-demo button[data-focus-demo="true"] { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dsh-a11y-focus-demo label { display: inline-flex; align-items: center; gap: 6px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-a11y-focus-demo > span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-running-state-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-running-state-grid > div { display: grid; grid-template-columns: 20px minmax(0, 1fr); grid-template-rows: auto auto; column-gap: 10px; row-gap: 3px; align-items: center; min-height: 84px; padding: 16px; background: var(--dsw-alias-bg-layer-1); }
.dsh-running-state-grid > div > svg { grid-row: span 2; color: var(--dsw-alias-state-business-primary); }
.dsh-running-state-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-running-state-grid span { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-running-reasoning { position: relative; overflow: hidden; }
.dsh-running-reasoning::after { content: ''; position: absolute; inset-block: 0; left: 0; width: 300px; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent), transparent); animation: dsh-board-thinking-sweep 2.6s ease-out infinite; pointer-events: none; }
.dsh-running-shimmer { color: var(--dsw-alias-state-business-primary); background: linear-gradient(90deg, var(--dsw-alias-state-business-primary) 0%, var(--dsw-alias-label-primary-foreground) 48%, var(--dsw-alias-state-business-primary) 100%); background-size: 220% 100%; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: dsh-board-text-shimmer 1.8s linear infinite; }
@keyframes dsh-board-text-shimmer { from { background-position: 200% 0; } to { background-position: -20% 0; } }
.dsh-running-button button { display: inline-flex; grid-row: span 2; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-info-fill); }
.dsh-state-matrix { border: 0; background: transparent; }
.dsh-state-matrix > div { min-height: 88px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); background: transparent; }
.dsh-state-matrix > div:nth-child(odd) { padding-right: 18px; }
.dsh-state-matrix > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-state-matrix small { grid-column: 2; color: var(--dsw-alias-label-tertiary); }
.dsh-responsive-table > div { grid-template-columns: 150px minmax(0, 1fr) 190px; }
.dsh-responsive-table code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-checklist { border: 0; background: transparent; }
.dsh-checklist > div { min-height: 50px; padding: 12px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); background: transparent; }
.dsh-checklist svg { color: var(--dsw-alias-state-business-primary); }
.dsh-a11y-checklist { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-checklist > div { display: grid; grid-template-columns: 18px 130px minmax(0, 1fr) 260px; gap: 12px; align-items: center; min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-a11y-checklist svg { color: var(--dsw-alias-state-business-primary); }
.dsh-a11y-checklist strong { font: var(--dsw-font-xs-strong-13); }
.dsh-a11y-checklist span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-a11y-checklist small { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-exception-list > div {  display: grid; grid-template-columns: 18px 150px minmax(0, 1fr) 250px; gap: 12px; align-items: center; min-height: 58px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-exception-list svg { color: var(--dsw-alias-state-error-primary); }
.dsh-exception-list strong { font: var(--dsw-font-xs-strong-13); }
.dsh-exception-list span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-exception-list code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-chat-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-chat-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-chat-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-chat-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-chat-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-chat-flow-specimen { position: relative; min-height: 560px; padding: 16px calc(var(--dsw-board-gutter, 32px) + 16px); overflow: hidden; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); }
.dsh-chat-flow-column { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 748px; margin: 0 auto; }
.dsh-chat-load-older { display: flex; justify-content: center; }
.dsh-chat-load-older button { border: 0; border-radius: 14px; padding: 4px 12px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover-solid); font: var(--dsw-font-xxs-12); }
.dsh-chat-context-row { display: flex; align-items: center; min-width: 0; height: 24px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-s-14); }
.dsh-chat-context-row svg { flex: none; margin-right: 6px; color: var(--dsw-alias-label-secondary); }
.dsh-chat-context-row i, .dsh-chat-stats i { flex: none; width: 2px; height: 2px; margin: 0 8px; border-radius: 1px; background: var(--dsw-alias-label-caption); }
.dsh-chat-context-row span { flex: none; color: var(--dsw-alias-label-primary-dimmed); }
.dsh-chat-context-row small { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); font: inherit; text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-user-row { display: flex; justify-content: flex-end; }
.dsh-chat-user-bubble { max-width: min(525px, 82%); border-radius: 22px; padding: 10px 16px; color: var(--dsw-alias-label-primary); background: var(--dsw-specific-bubble); font: var(--dsw-font-base-16); }
.dsh-chat-assistant { max-width: 748px; color: var(--dsw-alias-label-primary); font: var(--dsw-font-markdown-base); }
.dsh-chat-assistant p { margin: 0; }
.dsh-chat-reasoning { position: relative; display: flex; align-items: center; min-width: 0; height: 24px; overflow: hidden; gap: 6px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-chat-reasoning[data-running="true"]::after { position: absolute; inset-block: 0; left: 0; width: 300px; content: ''; background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent) 55%, transparent 100%); animation: dsh-board-chat-reasoning-sweep 2.6s ease-out infinite; pointer-events: none; }
.dsh-chat-reasoning > svg:first-child { flex: none; color: var(--dsw-alias-state-business-primary); }
.dsh-chat-reasoning strong { font: var(--dsw-font-s-14); }
.dsh-chat-reasoning i { flex: none; width: 2px; height: 2px; margin: 0 2px; border-radius: 1px; background: var(--dsw-alias-label-caption); }
.dsh-chat-reasoning span { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-reasoning > svg:last-child { flex: none; color: var(--dsw-alias-label-secondary); }
@keyframes dsh-board-chat-reasoning-sweep { 0% { left: -300px; } 90%, 100% { left: 100%; } }
.dsh-chat-tool { display: grid; grid-template-columns: 18px auto 2px minmax(0, 1fr) 14px; gap: 8px; align-items: center; min-height: 24px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-s-14); }
.dsh-chat-tool > svg { color: var(--dsw-alias-label-secondary); }
.dsh-chat-tool strong { font: var(--dsw-font-s-14); }
.dsh-chat-tool i { width: 2px; height: 2px; border-radius: 1px; background: var(--dsw-alias-label-caption); }
.dsh-chat-tool span { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-error { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; gap: 8px; align-items: start; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-chat-error > span { width: 8px; height: 8px; margin-top: 6px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); }
.dsh-chat-error > div { display: flex; flex-wrap: wrap; gap: 0 6px; min-width: 0; }
.dsh-chat-error strong { color: var(--dsw-alias-state-error-primary); font: var(--dsw-font-xs-strong-13); }
.dsh-chat-error code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); }
.dsh-chat-error button { height: 28px; border: 0; border-radius: 14px; padding: 0 10px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); font: var(--dsw-font-xxs-12); }
.dsh-chat-turn-status { display: inline-flex; align-self: flex-start; align-items: center; height: 26px; color: transparent; background: linear-gradient(90deg, var(--dsw-static-deepseek-500) 0%, var(--dsw-static-deepseek-500) 40%, var(--dsw-static-deepseek-200) 50%, var(--dsw-static-deepseek-500) 60%, var(--dsw-static-deepseek-500) 100%); background-position: 100% 0; background-size: 250% 100%; background-clip: text; font: var(--dsw-font-s-strong-14); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: dsh-board-chat-shimmer 1.8s linear infinite; }
.dsh-chat-turn-status span { margin-left: 8px; color: var(--dsw-alias-label-caption); font: var(--dsw-font-xs-13); font-weight: 400; -webkit-text-fill-color: var(--dsw-alias-label-caption); }
@keyframes dsh-board-chat-shimmer { to { background-position: 0 0; } }
.dsh-chat-pending { align-self: flex-end; max-width: min(525px, 82%); border-radius: 22px; padding: 10px 16px; color: var(--dsw-alias-label-primary); background: var(--dsw-specific-bubble); font: var(--dsw-font-base-16); }
.dsh-chat-stats { display: block; width: 100%; overflow: hidden; padding-top: 4px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); line-height: 20px; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.dsh-chat-stats i { display: inline-block; vertical-align: middle; }
.dsh-chat-to-bottom { position: absolute; right: max(16px, calc((100% - 748px) / 2)); bottom: 16px; display: flex; width: 34px; height: 34px; align-items: center; justify-content: center; border: 1px solid var(--dsw-alias-border-l2); border-radius: 50%; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-button-floating-fill); box-shadow: var(--dsw-shadow-lv2); }
.dsh-chat-dock-order { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-chat-dock-order > div { display: grid; gap: 5px; min-height: 92px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-chat-dock-order strong { font: var(--dsw-font-xs-strong-13); }
.dsh-chat-dock-order code { color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-chat-dock-order span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-sidebar-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-sidebar-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-sidebar-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-sidebar-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-specimen { display: grid; align-content: start; gap: 4px; width: min(320px, 100%); min-height: 468px; padding: 10px 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; overflow: hidden; background: var(--dsw-specific-sidebar-fill); }
.dsh-sidebar-specimen > * { min-width: 0; }
.dsh-sidebar-brand { display: flex; align-items: center; gap: 6px; height: 42px; padding: 0 10px; color: var(--dsw-alias-label-primary); font: var(--dsw-font-s-strong-14); }
.dsh-sidebar-brand span { color: var(--dsw-alias-label-tertiary); font-weight: 400; }
.dsh-sidebar-brand button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; margin-left: auto; border: 0; border-radius: 50%; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-sidebar-new { display: flex; align-items: center; justify-content: center; gap: 6px; height: 38px; margin: 0 2px 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; padding: 0 16px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-button-elevated-fill); text-align: left; font: var(--dsw-font-s-14); }
.dsh-sidebar-new:hover { background: var(--dsw-alias-button-floating-hover); }
.dsh-sidebar-section-title { display: flex; align-items: center; justify-content: space-between; height: 36px; padding: 0 4px; margin-top: 6px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-section-title > div { display: flex; gap: 2px; }
.dsh-sidebar-section-title button, .dsh-sidebar-workbench > svg:last-child, .dsh-sidebar-project > svg:last-child { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-sidebar-section-title button:hover, .dsh-sidebar-workbench:hover, .dsh-sidebar-project:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-sidebar-workbench, .dsh-sidebar-project { display: flex; align-items: center; gap: 7px; min-width: 0; min-height: 34px; padding: 0 8px; border-radius: 8px; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-sidebar-workbench > strong, .dsh-sidebar-project > strong { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: var(--dsw-font-xs-strong-13); }
.dsh-sidebar-rename { width: 218px; margin: 0 0 4px 20px; padding: 4px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-specific-menu); box-shadow: var(--dsw-shadow-lv3); }
.dsh-sidebar-rename button { display: flex; align-items: center; gap: 8px; width: 100%; height: 40px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; text-align: left; font: var(--dsw-font-s-14); }
.dsh-sidebar-rename button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-sidebar-rename .is-danger { color: var(--dsw-alias-state-error-primary); }
.dsh-sidebar-rename hr { height: 1px; margin: 4px 8px; border: 0; background: var(--dsw-alias-border-l1); }
.dsh-sidebar-session { display: flex; align-items: center; gap: 6px; min-width: 0; height: 32px; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; text-align: left; font: var(--dsw-font-xs-13); }
.dsh-sidebar-session[data-selected="true"], .dsh-sidebar-session:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-sidebar-session > span:nth-child(2) { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-sidebar-session time { margin-left: auto; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-sidebar-session-empty { width: 6px; height: 6px; margin: 0 5px; border-radius: 50%; background: var(--dsw-alias-label-caption); }
.dsh-sidebar-state-grid, .dsh-session-action-grid, .dsh-composer-state-grid, .dsh-trajectory-state-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-border-l1); }
.dsh-sidebar-state-grid > div, .dsh-session-action-grid > div, .dsh-composer-state-grid > div, .dsh-trajectory-state-grid > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 4px; min-height: 84px; padding: 16px; background: var(--dsw-alias-bg-base); }
.dsh-sidebar-state-grid svg, .dsh-session-action-grid svg { grid-row: span 2; color: var(--dsw-alias-label-tertiary); }
.dsh-sidebar-state-grid strong, .dsh-session-action-grid strong, .dsh-composer-state-grid strong, .dsh-trajectory-state-grid strong { font: var(--dsw-font-xs-strong-13); }
.dsh-sidebar-state-grid span, .dsh-session-action-grid span, .dsh-composer-state-grid span, .dsh-trajectory-state-grid span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-session-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-session-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-session-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-session-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-session-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-session-header-specimen { border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); }
.dsh-session-title-row { display: flex; align-items: center; gap: 0; min-height: 32px; padding: 12px 28px 0 20px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-session-title-row > nav { display: flex; align-items: center; gap: 5px; min-width: 0; margin-right: auto; white-space: nowrap; font: var(--dsw-font-xs-13); }
.dsh-session-title-row nav button { max-width: 160px; overflow: hidden; border: 0; border-radius: 12px; padding: 4px 8px; color: var(--dsw-alias-label-tertiary); background: transparent; text-overflow: ellipsis; white-space: nowrap; font: inherit; }
.dsh-session-title-row nav strong { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-primary); text-overflow: ellipsis; font: var(--dsw-font-xs-strong-13); }
.dsh-session-header-actions, .dsh-session-header-tools { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dsh-session-header-tools { margin-left: 20px; }
.dsh-session-preset, .dsh-session-subagents, .dsh-session-jobs { display: inline-flex; align-items: center; gap: 3px; min-height: 28px; max-width: 190px; overflow: hidden; border: 0; border-radius: 6px; padding: 3px 2px; color: var(--dsw-alias-label-tertiary); background: transparent; text-overflow: ellipsis; white-space: nowrap; font: var(--dsw-font-xxs-12); }
.dsh-session-subagents span:not(.dsh-session-running-dot), .dsh-session-jobs span:not(.dsh-session-running-dot) { margin: 0 5px; }
.dsh-session-subagents:hover, .dsh-session-jobs:hover { color: var(--dsw-alias-label-secondary); }
.dsh-session-preset svg, .dsh-session-subagents svg, .dsh-session-jobs svg { flex: none; }
.dsh-session-log { display: inline-flex; align-items: center; gap: 6px; height: 32px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; padding: 0 10px; color: var(--dsw-alias-label-secondary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-session-tabs { position: relative; display: flex; gap: 36px; min-height: 35px; margin-top: 4px; padding-left: 8px; }
.dsh-session-tabs button { position: relative; border: 0; padding: 0 0 11px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); line-height: 16px; font-weight: 500; }
.dsh-session-tabs button[aria-selected="true"] { color: var(--dsw-alias-label-primary); }
.dsh-session-tabs button[aria-selected="true"]::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 2px; border-radius: 2px 2px 0 0; background: var(--dsw-alias-label-primary); }
.dsh-composer-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-composer-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-composer-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-composer-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-composer-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-composer-surface { width: min(780px, 100%); margin: 0 auto; }
.dsh-composer-dock-stack { display: grid; gap: 4px; margin: 0 16px 4px; }
.dsh-composer-dock-stack > div { display: grid; grid-template-columns: 18px auto minmax(0, 1fr) auto; gap: 7px; align-items: center; min-height: 36px; padding: 0 10px; border-radius: 12px; color: var(--dsw-alias-label-secondary); background: var(--dsh-board-specific-tip, var(--dsw-specific-tip)); font: var(--dsw-font-xs-13); }
.dsh-composer-dock-stack > div > span { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary); text-overflow: ellipsis; white-space: nowrap; }
.dsh-composer-dock-stack > div > svg { color: var(--dsw-alias-label-tertiary); }
.dsh-composer-dock-stack button { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-secondary); background: transparent; }
.dsh-composer-notice { width: calc(100% - 32px); margin: 0 16px 6px; padding: 4px 8px; border-radius: 8px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); font: var(--dsw-font-xxs-12); }
.dsh-composer-real-card { overflow: hidden; border: 1px solid var(--dsw-alias-border-l2-darkmode-thin); border-radius: 22px; box-shadow: var(--dsw-shadow-lv2); background: var(--dsw-specific-input-major); }
.dsh-composer-real-attachments { display: flex; align-items: center; gap: 10px; min-height: 76px; padding: 10px 16px 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-composer-real-attachments > div { position: relative; display: inline-flex; width: 64px; height: 64px; align-items: center; justify-content: center; border-radius: 16px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1); }
.dsh-composer-real-attachments button { position: absolute; top: -4px; right: -4px; display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-state-error-primary); }
.dsh-composer-real-text { position: relative; min-height: 104px; padding: 12px 16px 0; }
.dsh-composer-real-text textarea, .dsh-composer-real-text > div { display: block; width: 100%; min-height: 78px; margin: 0; border: 0; outline: 0; resize: none; color: var(--dsw-alias-label-primary); background: transparent; font: var(--dsw-font-base-16); line-height: 24px; }
.dsh-composer-real-text > div { position: absolute; inset: 12px 16px 0; color: transparent; pointer-events: none; }
.dsh-composer-real-text mark { color: transparent; border-radius: 6px; background: rgba(97, 135, 216, 0.22); }
.dsh-composer-real-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0; padding: 2px 8px 6px; }
.dsh-composer-real-tools, .dsh-composer-real-trailing { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dsh-composer-real-tools { gap: 16px; }
.dsh-composer-real-row select { max-width: 180px; height: 28px; min-width: 0; overflow: hidden; border: 0; border-radius: 8px; padding: 0 8px; color: var(--dsw-alias-label-secondary); background: transparent; font: var(--dsw-font-xs-13); }
.dsh-composer-real-row select:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-composer-real-add, .dsh-composer-real-send { display: inline-flex; flex: none; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; padding: 0; color: var(--dsw-alias-label-secondary); }
.dsh-composer-real-add { background: var(--dsw-specific-selector); }
.dsh-composer-real-meter { height: 28px; border: 0; border-radius: 14px; padding: 0 8px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-composer-real-send { width: 34px; height: 34px; color: var(--dsw-alias-label-primary-foreground); background: var(--dsw-alias-button-info-fill); transform: translateY(-2px); }
.dsh-composer-real-stats { overflow: hidden; padding: 4px 16px 0; color: var(--dsw-alias-label-tertiary); text-align: center; text-overflow: ellipsis; white-space: nowrap; font: var(--dsw-font-xxs-12); }
.dsh-composer-real-stats i { display: inline-block; width: 2px; height: 2px; margin: 0 8px; border-radius: 1px; background: var(--dsw-alias-label-caption); vertical-align: middle; }
.dsh-composer-state-grid > div { grid-template-columns: minmax(0, 1fr); min-height: 76px; }
.dsh-trajectory-rule-table { border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-trajectory-rule-table > div { display: grid; grid-template-columns: 170px 300px minmax(0, 1fr); gap: 16px; align-items: center; min-height: 54px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-trajectory-rule-table strong { font: var(--dsw-font-xs-strong-13); }
.dsh-trajectory-rule-table code { min-width: 0; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-markdown-code-block-small); overflow-wrap: anywhere; }
.dsh-trajectory-rule-table span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-trajectory-frame { min-width: 0; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); }
.dsh-trajectory-toolbar { display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 6px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-trajectory-toolbar > button { display: inline-flex; align-items: center; gap: 4px; height: 20px; border: 0; border-radius: 3px; padding: 0 7px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-trajectory-toolbar > button[data-active="true"], .dsh-trajectory-toolbar > button:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dsh-trajectory-toolbar label { display: flex; align-items: center; gap: 5px; width: 164px; min-width: 84px; height: 20px; margin-left: auto; padding: 0 8px; border-radius: 3px; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-trajectory-toolbar input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--dsw-alias-label-primary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-trajectory-timeline { display: grid; grid-template-columns: 44px minmax(0, 1fr); height: 50px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.dsh-trajectory-lanes { display: grid; grid-template-rows: repeat(3, 1fr); padding: 8px 4px; color: var(--dsw-alias-label-caption); font: var(--dsw-font-xxxs-strong-11); }
.dsh-trajectory-lanes span { display: flex; align-items: center; }
.dsh-trajectory-bars { position: relative; display: grid; grid-template-rows: repeat(3, 1fr); gap: 3px; padding: 8px 12px; overflow: hidden; }
.dsh-trajectory-bars i { display: block; height: 12px; border-radius: 3px; background: var(--dsw-alias-state-business-tertiary); }
.dsh-trajectory-bars .is-input { width: 35%; }
.dsh-trajectory-bars .is-model { width: 68%; background: var(--dsw-alias-state-business-primary); }
.dsh-trajectory-bars .is-tool { width: 48%; background: var(--dsw-alias-label-caption); }
.dsh-trajectory-bars .is-error { position: absolute; top: 37px; left: 51%; width: 12%; height: 12px; background: var(--dsw-alias-state-error-primary); }
.dsh-trajectory-bars small { position: absolute; right: 12px; bottom: 2px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxxs-11); }
.dsh-trajectory-body { display: grid; grid-template-columns: minmax(0, 1fr) 280px; min-height: 330px; }
.dsh-trajectory-ledger { min-width: 0; padding: 8px 0 12px; overflow: hidden; }
.dsh-trajectory-load-earlier { height: 30px; padding: 7px 12px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-row { display: grid; grid-template-columns: 122px minmax(0, 1fr) 46px; gap: 8px; align-items: center; min-height: 30px; padding: 0 10px; border-left: 3px solid transparent; color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-row:hover, .dsh-trajectory-row.is-selected { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-trajectory-row.is-selected { border-left-color: var(--dsw-alias-state-business-primary); }
.dsh-trajectory-event { display: flex; align-items: center; gap: 7px; min-width: 0; }
.dsh-trajectory-event b { color: var(--dsw-alias-label-caption); font: var(--dsw-font-markdown-code-block-small); }
.dsh-trajectory-event em { min-width: 0; overflow: hidden; color: var(--dsw-alias-state-business-primary); font-style: normal; font: var(--dsw-font-xxxs-strong-11); text-overflow: ellipsis; }
.dsh-trajectory-content { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-trajectory-row time { color: var(--dsw-alias-label-tertiary); text-align: right; font: var(--dsw-font-xxxs-11); }
.dsh-trajectory-row.kind-tool .dsh-trajectory-event em, .dsh-trajectory-row.kind-subtool .dsh-trajectory-event em { color: var(--dsw-alias-label-secondary); }
.dsh-trajectory-row.kind-compacted .dsh-trajectory-event em, .dsh-trajectory-row.kind-context .dsh-trajectory-event em { color: var(--dsw-alias-label-tertiary); }
.dsh-trajectory-turn-break { display: flex; align-items: center; gap: 8px; min-height: 28px; padding: 8px 12px 4px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-turn-break i { flex: 1; height: 2px; background: var(--dsw-alias-border-l2); }
.dsh-trajectory-turn-break small { font: var(--dsw-font-xxxs-11); }
.dsh-trajectory-inspector { min-width: 0; border-left: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); }
.dsh-trajectory-inspector header { display: flex; align-items: center; justify-content: space-between; height: 42px; padding: 0 10px 0 14px; border-bottom: 1px solid var(--dsw-alias-border-l1); font: var(--dsw-font-xs-strong-13); }
.dsh-trajectory-inspector header button { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border: 0; border-radius: 50%; color: var(--dsw-alias-label-tertiary); background: transparent; }
.dsh-trajectory-inspector nav { display: flex; gap: 14px; height: 34px; overflow: auto; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-trajectory-inspector nav button { flex: none; height: 34px; border: 0; padding: 0 5px; color: var(--dsw-alias-label-tertiary); background: transparent; font: var(--dsw-font-xxs-12); }
.dsh-trajectory-inspector nav button[data-active="true"] { color: var(--dsw-alias-label-primary); border-bottom: 2px solid var(--dsw-alias-state-business-primary); }
.dsh-trajectory-inspector-body { display: grid; gap: 12px; padding: 14px; overflow: auto; }
.dsh-trajectory-inspector-body dl { display: grid; gap: 7px; margin: 0; }
.dsh-trajectory-inspector-body dl > div { display: flex; justify-content: space-between; gap: 10px; color: var(--dsw-alias-label-tertiary); font: var(--dsw-font-xxs-12); }
.dsh-trajectory-inspector-body dd { margin: 0; color: var(--dsw-alias-label-secondary); text-align: right; }
.dsh-trajectory-inspector-body .is-success { color: var(--dsw-alias-state-success-primary); }
.dsh-trajectory-inspector-body h4 { margin: 0; font: var(--dsw-font-xs-strong-13); }
.dsh-trajectory-inspector-body pre { max-height: 132px; margin: 0; overflow: auto; padding: 10px; border-radius: 8px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-markdown-code-block); font: var(--dsw-font-markdown-code-block-small); white-space: pre-wrap; }
.dsh-overview-page-map { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-overview-page-map > div { display: grid; grid-template-columns: 18px minmax(0, 1fr); column-gap: 10px; row-gap: 4px; min-height: 98px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-overview-page-map > div:nth-child(odd) { padding-right: 18px; }
.dsh-overview-page-map > div:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh-overview-page-map svg { grid-row: span 2; color: var(--dsw-alias-label-tertiary); }
.dsh-overview-page-map strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overview-page-map span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-overview-workflow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 20px; padding-top: 4px; }
.dsh-overview-workflow > div { display: grid; grid-template-columns: 24px minmax(0, 1fr); column-gap: 10px; row-gap: 5px; min-width: 0; }
.dsh-overview-workflow b { display: inline-flex; grid-row: span 2; width: 24px; height: 24px; align-items: center; justify-content: center; border-radius: 50%; color: var(--dsw-alias-state-business-primary); background: var(--dsw-alias-state-business-tertiary); font: var(--dsw-font-xxs-strong-12); }
.dsh-overview-workflow strong { font: var(--dsw-font-xs-strong-13); }
.dsh-overview-workflow span { color: var(--dsw-alias-label-secondary); font: var(--dsw-font-xs-13); }
.dsh-session-running-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-business-primary); }
@container (max-width: 900px) {
  .dsh-specimen-content { padding: 32px 28px 52px; }
  .dsh-board-table-head, .dsh-board-table-row { grid-template-columns: 100px minmax(130px, 1fr) minmax(130px, 1fr); }
  .dsh-board-table-head span:nth-child(n+4), .dsh-board-table-row > :nth-child(n+4) { display: none; }
  .dsh-exception-list > div { grid-template-columns: 18px 120px minmax(0, 1fr); }
  .dsh-exception-list code { grid-column: 3; }
}
@container (max-width: 720px) {
  .dsh-specimen-content { padding: 24px 18px 42px; }
  .dsh-foundation-layer-table > div, .dsh-foundation-theme-table > div, .dsh-foundation-font-table > div, .dsh-chat-rule-table > div, .dsh-composer-rule-table > div, .dsh-trajectory-rule-table > div, .dsh-overlay-rule-table > div, .dsh-settings-rule-table > div, .dsh-sidebar-rule-table > div, .dsh-session-rule-table > div, .dsh-shell-rule-table > div, .dsh-board-table-head, .dsh-board-table-row { grid-template-columns: 1fr; gap: 4px; align-items: start; min-height: 0; padding: 12px 0; }
  .dsh-foundation-layer-table small { grid-column: auto; }
  .dsh-foundation-layer-table strong { grid-row: auto; }
  .dsh-foundation-layer-table code, .dsh-foundation-theme-table code, .dsh-foundation-font-table code, .dsh-chat-rule-table code, .dsh-composer-rule-table code, .dsh-trajectory-rule-table code, .dsh-overlay-rule-table code, .dsh-settings-rule-table code, .dsh-sidebar-rule-table code, .dsh-session-rule-table code, .dsh-shell-rule-table code, .dsh-a11y-checklist > div { white-space: normal; overflow-wrap: anywhere; }
  .dsh-a11y-checklist > div { grid-template-columns: 18px minmax(0, 1fr); gap: 4px; align-items: start; min-height: 0; padding: 12px 0; }
  .dsh-a11y-checklist strong, .dsh-a11y-checklist span, .dsh-a11y-checklist small { grid-column: 2; }
  .dsh-chat-reasoning, .dsh-chat-tool, .dsh-chat-error, .dsh-chat-turn-status, .dsh-chat-stats { min-width: 0; max-width: 100%; }
  .dsh-chat-reasoning span, .dsh-chat-tool span, .dsh-chat-error span, .dsh-chat-turn-status span, .dsh-chat-stats span, .dsh-chat-rule-table span { min-width: 0; overflow-wrap: anywhere; white-space: normal; }
  .dsh-chat-reasoning i { flex: 0 1 24px; min-width: 8px; }
  .dsh-specimen-heading { display: block; }
  .dsh-specimen-source { display: block; max-width: 100%; margin-top: 8px; }
  .dsh-board-layer-strip, .dsh-board-callouts, .dsh-specimen-icon-grid, .dsh-primitive-input-row, .dsh-shell-state-grid, .dsh-overlay-duo, .dsh-settings-comparison, .dsh-state-matrix, .dsh-a11y-role-grid, .dsh-running-state-grid, .dsh-sidebar-state-grid, .dsh-session-action-grid, .dsh-composer-state-grid, .dsh-trajectory-state-grid, .dsh-foundation-rule-grid { grid-template-columns: 1fr; }
  .dsh-overview-page-map, .dsh-overview-workflow { grid-template-columns: 1fr; }
  .dsh-overview-page-map > div:nth-child(odd), .dsh-overview-page-map > div:nth-child(even) { padding-right: 0; padding-left: 0; border-left: 0; }
  .dsh-sidebar-specimen { grid-template-columns: 1fr; }
  .dsh-sidebar-specimen > div:last-child { min-height: 120px; }
  .dsh-session-title-row { align-items: flex-start; flex-wrap: wrap; gap: 8px; }
  .dsh-session-title-row > nav { flex-basis: 100%; }
  .dsh-session-header-tools { margin-left: auto; }
  .dsh-trajectory-body { grid-template-columns: 1fr; }
  .dsh-trajectory-inspector { border-top: 1px solid var(--dsw-alias-border-l2); border-left: 0; }
  .dsh-trajectory-row { grid-template-columns: 50px minmax(0, 1fr) 40px; }
  .dsh-trajectory-event em { font-size: 0; }
  .dsh-trajectory-event em::first-letter { font-size: 10px; }
  .dsh-board-layer-strip > div { border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
  .dsh-board-layer-strip > div:last-child { border-bottom: 0; }
  .dsh-board-callouts { gap: 14px; }
  .dsh-specimen-token-row { grid-template-columns: 28px minmax(0, 1fr); padding: 10px 0; }
  .dsh-specimen-token-row > span:last-child { grid-column: 2; white-space: normal; }
  .dsh-specimen-type-head { display: none; }
  .dsh-specimen-type-row { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
  .dsh-specimen-type-row code { white-space: normal; }
  .dsh-foundation-metric-table > div, .dsh-foundation-motion-table > div { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
  .dsh-specimen-icon-item:nth-child(even), .dsh-settings-recipe-grid > div:nth-child(even), .dsh-state-matrix > div:nth-child(even), .dsh-primitive-catalog > div:nth-child(even) { padding-left: 0; border-left: 0; }
  .dsh-specimen-icon-item:nth-child(odd), .dsh-settings-recipe-grid > div:nth-child(odd), .dsh-state-matrix > div:nth-child(odd), .dsh-primitive-catalog > div:nth-child(odd) { padding-right: 0; }
  .dsh-settings-recipe-grid, .dsh-primitive-catalog { grid-template-columns: 1fr; }
  .dsh-board-table-head, .dsh-board-table-row { grid-template-columns: 1fr; gap: 4px; }
  .dsh-board-table-head span, .dsh-board-table-row > * { display: block; }
  .dsh-board-geometry-table > div { grid-template-columns: 1fr; gap: 3px; padding: 12px 0; }
  .dsh-shell-diagram { grid-template-columns: 1fr; }
  .dsh-shell-details { min-height: 110px; }
  .dsh-responsive-table > div { grid-template-columns: 1fr; gap: 4px; align-items: start; padding: 12px 0; }
  .dsh-overlay-menu-specimen { display: grid; grid-template-columns: 1fr; }
  .dsh-overlay-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh-overlay-modal-card { inset: 18px 12px; padding: 16px; }
  .dsh-module-settings-panel { grid-template-columns: 1fr; min-height: 0; border-radius: 16px; }
  .dsh-module-settings-nav { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 12px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
  .dsh-module-settings-nav > strong { grid-column: 1 / -1; margin-bottom: 4px; padding: 0; }
  .dsh-module-settings-nav button { justify-content: center; padding: 8px; font-size: 0; }
  .dsh-module-settings-nav button svg { width: 16px; height: 16px; }
  .dsh-module-settings-options { padding: 18px; }
  .dsh-running-state-grid > div { min-height: 72px; padding: 12px 0; }
  .dsh-a11y-keyboard-list > div { grid-template-columns: 60px 1fr; gap: 8px; padding: 10px 0; }
  .dsh-a11y-keyboard-list span { grid-column: 2; }
  .dsh-a11y-role-grid > div { grid-template-columns: 78px minmax(0, 1fr); }
  .dsh-exception-list > div { grid-template-columns: 18px minmax(0, 1fr); gap: 8px; padding: 10px 0; }
  .dsh-exception-list strong, .dsh-exception-list span, .dsh-exception-list code { grid-column: 2; }
  .dsh-exception-list svg { grid-row: span 3; }
}
@container (max-width: 260px) {
  .dsh-specimen-content { padding-inline: 12px; }
  .dsh-icon-geometry-grid { grid-template-columns: 1fr; }
  .dsh-icon-geometry-grid > div { grid-template-columns: 42px minmax(0, 1fr); padding: 12px; }
  .dsh-specimen-icon-item code, .dsh-specimen-icon-item span { text-overflow: clip; white-space: normal; overflow-wrap: anywhere; }
  .dsh-primitive-input-row label, .dsh-primitive-input-row .dsh-primitive-input { width: 100%; min-width: 0; }
  .dsh-primitive-input-row .dsh-primitive-input input { width: 100%; }
  .dsh-trajectory-toolbar { height: auto; min-height: 32px; flex-wrap: wrap; padding-block: 6px; }
  .dsh-trajectory-toolbar label { flex-basis: 100%; width: 100%; min-width: 0; margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-specimen-board *, .dsh-specimen-board *::before, .dsh-specimen-board *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
}
`;
		//#endregion
		//#region src/client/index.ts
		const inject = ["workbench"];
		/** Registers the reference DSH frontend design board with the workbench host. */
		function apply(ctx) {
			const workbench = ctx.workbench;
			ctx.effect(() => {
				const style = document.createElement("style");
				style.setAttribute("data-dsh-workbench-design-board-style", "");
				style.textContent = DESIGN_BOARD_STYLE;
				document.head.appendChild(style);
				return () => {
					style.remove();
				};
			}, "dsh-workbench-design-board: styles");
			const legacyDefault = workbench.getSnapshot().instances.find((instance) => instance.instanceId === "dsh-design-board-default");
			if (legacyDefault?.title === "DSH 设计看板") workbench.renameInstance(legacyDefault.instanceId, "DSH UI 样式看板");
			ctx.effect(() => workbench.registerApp({
				protocolVersion: 1,
				appId: "dsh-design-board",
				title: "DSH UI 样式看板",
				description: "按基础系统与真实产品模块组织的 DSH Web 样式看板",
				allowMultiple: true,
				presentations: [{
					kind: "page",
					conversation: "exclusive"
				}],
				defaultPresentation: "page",
				defaultInstance: {
					instanceId: "dsh-design-board-default",
					title: "DSH UI 样式看板",
					config: { section: "overview" }
				},
				renderMain: DesignBoard,
				renderSecondary: DesignBoardSidebar
			}), "dsh-workbench-design-board: app registration");
			ctx.effect(() => workbench.registerTemplate({
				templateId: "dsh-design-board:reference",
				title: "DSH UI 样式看板",
				description: "创建一份从系统总览开始的 DSH 设计规范参考实例",
				kind: "instance",
				appId: "dsh-design-board",
				defaultTitle: "DSH UI 样式看板",
				defaultConfig: { section: "overview" }
			}), "dsh-workbench-design-board: template registration");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map