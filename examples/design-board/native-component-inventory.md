# DSH 原生组件盘点：第一批

## 范围

设计来源仅为 DSH 原生 `ui-settings-models` 与 `ui-agent-preset`。工作台首页、金融账户及其他第三方页面不参与设计规范反向抽取。看板只是公共组件的消费者，不是另一份生产实现。本文记录首批决策，不表示全部原生界面已经盘点完成。

## 组件族与决策

| 编号 | 原生位置 | 用户意图 / 结构 | 决策 | 实现状态 |
| --- | --- | --- | --- | --- |
| ACT-01 | ModelsSection 提供方列表末尾 | 新增集合实体；图标与标签；两个等宽入口 | 独立 CollectionAddButton，不作为 AddButton 大号变体 | 已抽取，两个原生入口回用 |
| ACT-02 | ModelListEditor / DeepSeekModelsEditor | 在编辑列表内添加一行；文字或图标与文字 | 保留 AddButton 紧凑命令 | 已公共化，两个原生入口回用 |
| ENT-01 | AgentPresetSection 内置与自定义预设组 | 选择默认实体；标题、标记、描述、标识、独立底部动作 | 抽取 SelectableCard；不是导航卡片 | 已抽取，原生列表回用 |
| ENT-02 | ModelsSection 已配置提供方 | 展示配置身份与凭据状态，通过操作进入编辑；可展开编辑区域 | 与预设选择卡片语义和结构不同，不强制合并 | 保留业务模式，后续单独分析可复用编辑行 |
| ENT-03 | AgentPresetSection trust / inUse / broken 标记与复制、删除、文件路径动作 | 业务状态与操作权限 | 保留在 owner，通过公共结构的槽插入 | 未伪装为通用样式资产 |

## ACT-01 集合扩展入口

- 来源：`packages/client/ui-settings-models/src/client/ModelsSection.tsx` 的原 addButton / addActions；原 CSS 全部相关层叠和状态规则。
- 公共入口：`@deepseek-ai/dsh-client-ui-primitives` 的 `CollectionAddButton`。
- 固定规格：44px 高、16px 圆角、1px 虚线边框、6px 图文间距、14px / 22px 文字。
- 状态：默认、hover、focus-visible、native disabled；无选中语义。
- 组件负责按钮本体；页面负责等宽分组、180px 最小列宽、10px 间距与换行。
- API：原生 ButtonHTMLAttributes；children 提供图标和文案；默认 type=button；onClick、disabled 的业务条件由页面提供。
- 不合并 ACT-02：集合中的空位入口与列表内紧凑命令不同，不能仅用 size 参数表达。

## ACT-02 列表内添加命令

- 公共入口：`AddButton`，28px 高、14px 圆角、实线边框、内容宽度。
- ModelListEditor 保留纯文字；DeepSeekModelsEditor 保留14px加号。
- 组件负责本体状态；新增模型的数据、去重和校验仍由各编辑器负责。

## ENT-01 实体选择结构

- 来源：`packages/client/ui-agent-preset/src/client/AgentPresetSection.tsx` 及其 CSS；不参考第三方工作台卡片。
- 公共入口：`SelectableCard`。保留原生20px圆角、主区间距、选中填充与边框、损坏红边、描述四行截断及溢出提示。
- 结构：主选择按钮包含 title / badges / description / metadata；footer 是主按钮的兄弟节点；children 供 owner 附加错误或路径信息。
- pressed、disabled、broken 分开：已选不等于禁用；disabled 仅禁用主按钮；broken 阻止选择但不自动移除键盘焦点。
- badges、title、description、metadata 槽中的内容不能嵌套交互控件；交互操作放 footer。
- 默认预设、信任来源、删除权限、复制行为和配置错误文案留在原生 owner。
- ModelsSection provider row 不采用本结构：它不是选择一个默认实体，aria-pressed 也不适合它。

## 看板陈列

- 按钮与入口：CollectionAddButton、通用 Button、AddButton，同族可检索，默认即呈现添加提供方。
- 选择与实体：SelectableCard 与 Pill；真实选择、独立底部操作、disabled、broken、长描述。
- 其他现有组件保留在输入与表单、菜单与浮层、状态与反馈、结构化内容。
- 搜索跨组件族匹配中文用途及导出名；缺少宿主公共导出时明确标记不可用，不渲染本地仿制品。
- 示例数据不调用原生设置服务，不写入真实模型或默认预设。

## 验证边界

公共组件与原生消费者均有定向行为测试。运行验证检查原3080页面所加载的公共样式、组件交互、窄容器、明暗主题及切页几何。截图仅用于回归核验，不作为看板资产。后续原生组件盘点仍需覆盖通用设置、插件设置、导航、输入与结果区域。
