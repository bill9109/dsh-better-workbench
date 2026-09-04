---
name: dsh-workbench-application-authoring
description: "创建、迁移或审查注册到 dsh-workbench 的 DSH Workbench 应用，覆盖 page/panel/capsule 呈现、实例与模板、Agent Creator、Cordis disposer、持久化降级、Client HMR 和真实 GUI 验收。"
whenToUse: "当开发者需要把 DSH Client 插件注册到 dsh-workbench、添加 Workbench 模板、接入 Agent Creator、迁移旧 Workbench 应用，或审查 Workbench 应用是否真正支持热插拔时使用。"
---

# Workbench 应用开发 Skill

本文是 `dsh-workbench` 应用专属 Skill。它定义第三方 DSH Client 插件如何注册到基座，并继承实例持久化、导航、缺失降级和 Cordis Client fiber 重激活能力。

## 适用范围

使用本 Skill 处理：

- 新建或迁移注册到 `dsh-workbench` 的 DSH Client Workbench 应用；
- 为应用增加 `page`、`panel` 或 `capsule` 呈现；
- 注册实例模板、Agent 模板或 Creator 能力；
- 审查应用的 disposer、持久化、卸载残留和 Client HMR；
- 在真实 3080 GUI 中验证 Workbench 的创建、打开、返回和窄宽度行为。

不要用本 Skill：

- 替代通用 DSH/Cordis 插件开发规范；先遵守 `dsh-cordis-plugin-authoring`；
- 把 Workbench 应用实现成独立页面路由、全局 React Root 或第二套实例存储；
- 从 Client 点击事件直接调用模型而不经过可追踪的 Session/Agent 流程。

## 开始前检查

1. 阅读当前版本的 `dsh-workbench` `package.json`、`src/client/types.ts` 和本 Skill；不要从旧版本猜协议。
2. 确认目标 DSH 版本、当前 `dsh-workbench` bundle、`dsh.client.inject` 和运行中的 3080 GUI。
3. 确认应用需要的呈现模式、是否需要实例模板、是否需要 Agent Creator，以及每个注册的 disposer 所属 fiber。
4. 如果使用 DSH 原生 Slot 或其他服务，先查询当前版本的真实 Slot、Service 和方法签名。

## 角色与边界

- `dsh-workbench` 是领域基础设施插件，拥有应用、模板和 Creator Registry，以及首页、实例和呈现路由。
- Workbench 应用插件贡献运行时 UI 和 JSON 默认配置，不创建自己的页面路由、全局 React Root 或 Workbench 实例存储。
- Creator 插件负责把 Agent 模板接入真实 Session/Agent 流程。所有送入模型的需求必须进入 Session log。
- 应用注册表中的组件只在当前 activation 内存在；持久化层只保存稳定 ID、路由和 JSON 配置。

## 最小应用

```ts
import type { WorkbenchClientContext } from 'dsh-workbench/client'
import { MyWorkbench } from './MyWorkbench.tsx'

export const inject = ['workbench']

export function apply(ctx: WorkbenchClientContext): void {
  ctx.effect(() => ctx.workbench.registerApp({
    protocolVersion: 1,
    appId: '@example/my-workbench',
    title: '示例工作台',
    description: '应用用途',
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    renderMain: MyWorkbench,
  }), 'my-workbench: app registration')
}
```

`workbench` 是硬依赖。必须同时声明 `inject = ['workbench']` 并使用 `WorkbenchClientContext`；不能通过 patch 行顺序或计时器等待基座。

## 稳定标识

- `protocolVersion` 当前只能是 `1`。
- `appId`、`templateId` 和 `creatorId` 是公开、可持久化标识。使用包名命名空间，发布后不改语义。
- 重复注册立即报错。注册函数返回幂等 disposer，必须交给当前 Cordis fiber 的 `ctx.effect()`。
- 临时卸载应用不会删除实例。实例显示为不可用，同一 `appId` 重新注册后恢复。

## 呈现模式

应用必须声明至少一种呈现模式，并把默认模式设为其中之一。

```ts
presentations: [
  { kind: 'page', conversation: 'exclusive' },
  {
    kind: 'panel',
    placement: 'right',
    behavior: 'push',
    conversation: 'resident',
  },
  {
    kind: 'capsule',
    placement: 'floating',
    conversation: 'resident',
  },
]
```

| 模式 | Conversation | 应用渲染入口 | 用途 |
| --- | --- | --- | --- |
| `page` | `exclusive` | `renderMain`，可选 `renderSecondary` | 设计规范、数据看板、管理页面 |
| `panel` | `resident` | `renderPanel` | 文件、终端、检查器等持续协作面板 |
| `capsule` | `resident` | `renderCapsule` | 摘要、状态、轻量入口 |

声明 `panel` 必须提供 `renderPanel`；声明 `capsule` 必须提供 `renderCapsule`。组件通过 `WorkbenchRenderProps.presentation` 获得已经解析的具体模式。

DSH 0.1.x 尚无正式中心页面 Slot。当前 `page` 由基座兼容宿主覆盖中心区域并屏蔽 Conversation 交互，尚不等价于卸载 Conversation React 子树；未来切换到正式 Shell 页面出口时，应用协议和组件不需要改变。

## 组件契约

```ts
interface WorkbenchRenderProps {
  instance: WorkbenchInstance
  presentation: WorkbenchPresentation
  updateConfig(patch: WorkbenchConfig): void
  close(): void
  openHome(): void
  openConversation(): void
}
```

应用组件：

- 只从 props、应用自己的 store 和 React hooks 获得数据，不读取 Cordis `ctx`。
- 使用 `updateConfig()` 持久化 JSON 配置。它执行浅层合并；嵌套对象应提交完整的新值。
- 不修改 `#root`、Conversation DOM、Workbench 路由或基座的 CSS 变量。
- 不创建额外页面级 React Root。面板和胶囊的宿主由基座提供。
- 使用 DSH 语义 token，样式节点归属应用 fiber，并在卸载时移除。

## SVG 图标制作

1. 先检查当前版本 `@deepseek-ai/dsh-client-ui-primitives` 的 icon exports 和相邻 DSH 组件。有语义匹配的现成图标就复用；只有缺少目标 glyph 时才手绘 SVG，不为一个简单图标引入另一套图标系统。
2. 图标使用 `currentColor`，由容器的语义 token 控制默认、hover、active 和 disabled 颜色；不在 SVG 内写死产品颜色。
3. 沿用已有 DSH 构造。紧凑 Figma glyph 通常使用 `16 16` 或 `14 14` viewBox 与 `fill="currentColor"`；手绘 outline 通常使用 `fill="none"`、`stroke="currentColor"`、`strokeWidth="1.3"` 到 `strokeWidth="1.5"`，并设置圆角 line cap 和 line join。
4. 按视觉墨迹而不是 CSS 盒子校准尺寸。`width`、`height` 和 `viewBox` 不代表实际可见像素占用；应比较路径 `getBBox()`、stroke 外扩、实际渲染尺寸和相邻图标截图，差异不明确时把 SVG 栅格化并检查 alpha 像素边界。同标称尺寸下，outline 往往需要比 fill 更大的路径范围。
5. stroke 必须保留在 viewBox 内，并在实际渲染尺寸和设备缩放下检查斜线、对称轴、半像素落点、裁切和模糊。视觉重量不足时优先外扩路径，不任意加粗 stroke。
6. 有文本或已有可访问名称的控件内，装饰 SVG 使用 `aria-hidden="true"` 和 `focusable="false"`；纯图标按钮由按钮承担 `aria-label` 和 tooltip，SVG 不成为第二个焦点。
7. 在展开/紧凑容器、默认/hover/active/disabled、桌面/窄宽度和产品支持的主题中验收。图标不能改变控件尺寸、溢出或裁切，并应与相邻 DSH 图标保持接近的视觉重量。

## 实例模板

实例模板创建已经安装应用的新实例。模板本身是纯 JSON contribution：

```ts
ctx.effect(() => ctx.workbench.registerTemplate({
  templateId: '@example/my-workbench:blank',
  title: '空白工作台',
  description: '从默认布局开始',
  kind: 'instance',
  appId: '@example/my-workbench',
  defaultTitle: '未命名工作台',
  defaultConfig: { section: 'overview' },
}), 'my-workbench: template registration')
```

应用卸载后模板保留在其模板插件的 activation 中，但显示为不可用；应用重新注册后自动恢复可用。

## Agent 模板与 Creator

Agent 模板只描述用户可见入口和创建 brief，不直接调用模型：

```ts
ctx.effect(() => ctx.workbench.registerTemplate({
  templateId: '@example/dashboard-agent',
  title: '数据看板',
  description: '由 Agent 创建一个数据展示工作台',
  kind: 'agent',
  creatorId: '@example/workbench-agent-creator',
  brief: '创建符合 DSH 设计规范的数据看板工作台。',
}), 'dashboard: agent template')
```

独立 Creator 插件注册运行时处理器：

```ts
ctx.effect(() => ctx.workbench.registerCreator({
  creatorId: '@example/workbench-agent-creator',
  start(template) {
    // 将 template.brief 转换成可追踪的 Session/Agent 请求。
  },
}), 'workbench-agent-creator: registration')
```

Creator 缺失时 Agent 模板显示为不可用。Creator 必须通过正式 Host/Client 协议调用 Agent，并让用户需求、执行结果和错误都能从 Session log 重建；不能从 Client 点击事件直接注入不可追踪的模型输入。

## 热插拔责任

基座自动保证：

1. 应用、模板和 Creator 注册撤销后立即离开 Registry snapshot。
2. Workbench 实例、顺序、JSON 配置和当前路由跨应用短暂卸载保留。
3. 当前应用缺失时渲染不可用占位，不因 HMR 自动跳回 Conversation。
4. 相同稳定 ID 重新注册后恢复当前实例。
5. `dsh-workbench` provider fiber 替换时，声明硬依赖的消费者由 Cordis 重新激活。

应用开发者仍然负责：

1. 所有注册、事件、计时器、Observer、Worker、socket 和进程归属 `ctx.effect()` 或组件 effect cleanup。
2. 异步操作使用 `AbortSignal` 或 activation generation；旧响应不能写入新 activation。
3. 模块顶层不创建 store、listener、DOM、React Root 或外部资源。
4. Host/Client wire 只传 lossless JSON，并定义版本与错误响应。
5. Client HMR 会替换整个插件 fiber，不保证保留 React 局部状态。

## 最低验收

每个 Workbench 应用至少验证：

1. 挂载后应用和模板出现。
2. 创建、打开、改名和更新配置正常。
3. dispose 后贡献消失、实例保留并显示不可用。
4. 同一 ID 重新挂载后只存在一个贡献，原实例恢复。
5. 插件样式、事件、Observer、计时器和异步任务没有残留。
6. `page`、`panel` 或 `capsule` 的 Conversation 关系符合声明。
7. 真实 DSH GUI 无控制台错误，窄宽度下内容不溢出。
