---
name: dsh-better-workbench-application-authoring
description: "开发或审查 DSH Workbench 应用，覆盖配置版本、异步持久化、呈现与 activation 资源所有权。"
whenToUse: "注册 Workbench 应用、模板或 Creator；迁移配置；验证持久化与卸载。"
---

# Workbench 应用开发规范

本文描述当前尚未发布的单一应用协议：`protocolVersion: 1`。本次重设计不引入协议 v2，也不保留旧同步 API。接入前阅读当前 [types.ts](../src/client/types.ts)、[service.ts](../src/client/service.ts)、[storage.ts](../src/client/storage.ts) 与安装包 manifest。

## 所有权

基座负责应用、模板、Creator 注册表，实例元数据、导航、配置持久化与呈现宿主。应用负责组件、业务文件、外部数据、订阅与异步资源。不要另建 Workbench 实例数据库、全局 React Root 或竞争的页面路由。业务文档放在应用自己的存储或 Host 服务中；配置中的路径不代表 Workbench 会管理、备份或删除该文件。

声明 `inject = ['workbench']` 并使用 `WorkbenchClientContext`。在 `apply` 内同步注册，通过 `ctx.effect()` 返回每个 disposer；注册不必等待存储初始化。需要读取已有实例的命令式初始化应等待 `workbench.ready`，处理失败并提供 `retry()`，不要静默降级为内存成功。

## 完整 Client 示例

将下面的编译型 Client 模块放在 `src/client/index.tsx`。示例直接提交小型 JSON 更新；带编辑草稿的应用还需遵守下文 dirty 规则。

```tsx
import { useState } from 'react'
import type { WorkbenchClientContext, WorkbenchRenderProps } from 'dsh-better-workbench/client'

export const inject = ['workbench']

function Counter({ instance, updateConfig, reportError }: WorkbenchRenderProps) {
  const [saving, setSaving] = useState(false)
  const increment = async () => {
    setSaving(true)
    reportError(null)
    try {
      await updateConfig({ count: Number(instance.config.count) + 1 })
    } catch (error) {
      reportError(error instanceof Error ? error.message : String(error))
    } finally {
      setSaving(false)
    }
  }
  return <button disabled={saving} onClick={() => { void increment() }}>
    {String(instance.config.count)} + 1
  </button>
}

export function apply(ctx: WorkbenchClientContext): void {
  ctx.effect(() => ctx.workbench.registerApp({
    protocolVersion: 1,
    appId: '@example/counter',
    title: 'Counter',
    source: { packageName: '@example/counter', version: '0.1.0' },
    config: {
      version: 1,
      defaults: () => ({ count: 0 }),
      validate(config) {
        if (!Number.isSafeInteger(config.count) || Number(config.count) < 0) {
          throw new Error('count must be a non-negative safe integer')
        }
      },
    },
    allowMultiple: true,
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    renderMain: Counter,
  }), 'counter: application')
  ctx.effect(() => ctx.workbench.registerTemplate({
    templateId: '@example/counter:blank',
    title: 'Blank counter',
    kind: 'instance',
    appId: '@example/counter',
    defaultConfig: { count: 0 },
  }), 'counter: template')
}
```

应用包必须声明 DSH Client 元数据、构建 Client closure bundle，并与基座一起安装到 Web profile。独立包请参考 [examples/starter](../examples/starter)，使用公开 `dsh-better-workbench/build/client-bundle` helper。它已在复制出的独立布局测试，但未经过全新 registry 安装；从 registry 使用需要先发布本次重设计与 helper。[设计板 package](../examples/design-board/package.json) 是仓库内参考，不是独立 starter。`dsh-better-workbench/client` 的 type-only import 不产生运行时 import 需求。不要把 TSX 粘贴进未经转换的动态插件函数体。

## 标识与配置

- 为 `appId`、`templateId`、`creatorId` 使用稳定命名空间；同时重复注册会报错。`source?: { packageName, version, repository? }` 是发布者自报元数据，不是经过认证的身份或权限。
- 普通 `createInstance` 用 `crypto.randomUUID()` 分配 ID；将 ID 当作不透明值，不解析应用名前缀。显式 `defaultInstance.instanceId` 仍受支持，旧数据导入保留原 ID，未指定默认 ID 时才生成 UUID。`allowMultiple` 默认为 false，已有实例会被复用。
- 所有应用必填 `config: { version, defaults, validate, migrate? }`。`version` 是正安全整数，`defaults()` 返回新 JSON 对象；同步 `validate(config): void` 用抛错表示非法配置。验证不是归一化步骤，修改验证参数不会被保存。
- 配置必须是无环普通 JSON，数字必须有限。不能包含函数、Context、Service、DOM、类实例、undefined、socket 或凭据。更新是浅合并 patch，嵌套对象需提供完整目标值。
- `migrate(config, fromVersion, { signal })` 可返回配置或 Promise；结果必须是当前 schema 并通过验证。配置迁移不应修改业务文件或执行不可逆操作。

升级到配置版本 2 时，同时替换 defaults、validator 并提供迁移，例如：

```ts
config: {
  version: 2,
  defaults: () => ({ count: 0, step: 1 }),
  validate(config) {
    if (!Number.isSafeInteger(config.count) || Number(config.count) < 0
      || !Number.isSafeInteger(config.step) || Number(config.step) < 1) {
      throw new Error('Invalid counter configuration')
    }
  },
  async migrate(config, fromVersion, { signal }) {
    if (fromVersion !== 1) throw new Error('Unsupported source configuration')
    return { ...config, step: 1 }
  },
}
```

旧配置没有迁移函数时进入 `migration-error`；配置版本高于应用支持版本时为 `incompatible`。应用缺失时实例保留。宿主在渲染前准备、验证实例；判断可渲染性要看 `status`，不能只看 `available`。`prepareInstance()` 结束后仍可能是错误状态，应读取最新快照。

## 持久化与冲突

IndexedDB 用一个完整 repository-state 记录保存实例、已撤销默认实例的应用 ID 和迁移前配置备份。readwrite 事务读最新状态，在同步 update 回调内检查 revision 后原子提交。异步迁移在事务外执行；提交前再次核对应用 generation 与 revision，在同一事务中保存备份和新配置。验证失败、冲突或事务中止不会替换原配置。`exportInstance(id)` 返回 `Promise<WorkbenchInstanceExport>`，含 JSON 实例和配置备份；Surface 提供 JSON 下载。`restoreBackup(id, backupRevision, expectedRevision)` 仅提供 API：备份 configVersion 必须等于当前应用支持版本，通过验证且当前 revision 匹配，才会原子备份当前配置并替换。没有自动降级、JSON 导入或备份恢复 UI。

同源标签页共享实例数据；通知只使缓存失效，再读取已提交数据。配置写入采用 revision compare-and-swap，不是盲覆盖或自动合并。`updateConfig(patch, expectedRevision?)` 返回提交后的 revision。草稿必须保留开始编辑时的 revision，不能因收到远端 snapshot 自动更新基准；省略 revision 时，宿主使用首次 setDirty(true) 捕获的基准，否则使用当前渲染 revision。成功后可用返回值推进草稿基准。冲突后先重新读取并协调最新状态，不要循环用旧数据覆盖。重命名、删除也检查 revision；排序是原子的列表更新。保存成功意味着事务完成，而非仅乐观更新了界面。

当前标签页路由单独放在 `sessionStorage` 的 `dsh-better-workbench.navigation.v1`。每实例呈现偏好放在 `dsh-better-workbench.presentations.v1`；`open(id)` 优先使用仍被应用支持的已记忆 kind，再回退到默认模式。仓库首次初始化会从 `dsh-better-workbench.state.v3`、`dsh-better-workbench.state.v2` 或 `dsh-better-workbench.instances.v1` 导入可识别记录；保留原 localStorage key，并在 IndexedDB 留存源字符串与导入标记。这是数据导入，不是兼容旧应用 API。浏览器存储受 origin 限制，可能被清理或不可用，不是托管备份服务。

## 服务与渲染契约

| 操作 | 返回 |
| --- | --- |
| `registerApp / registerCreator` | 同步注册；disposer 返回 `Promise<void>` |
| `registerTemplate` | 同步 disposer |
| `updateInstanceConfig` | `Promise<number>` 提交后的 revision |
| `ready`、`retry()`、`prepareInstance(id)` | `Promise<void>` |
| `createInstance(appId, title?, config?)` | `Promise<WorkbenchInstance>` |
| `startCreation(templateId)` | `Promise<{ instanceId } \| { sessionId }>` |
| `renameInstance / deleteInstance / reorderInstances` | `Promise<void>` |
| `open / openHome / openConversation / close` | 同步导航，dirty 确认可能拒绝离开 |
| `getSnapshot / subscribe` | 快照 / 订阅 disposer |

`createInstance` 与 `startCreation` 返回结果；命令式调用方应明确用 `open(result.instanceId)` 打开实例，内置创建 UI 自行完成导航。应用不能 dispose 共享服务，服务生命周期归基座。

Renderer 得到 `instance`、实际 `presentation`、`updateConfig(patch, expectedRevision?): Promise<number>`、`setDirty(boolean)`、`reportError(string | null)`、`setPresentation(kind)`、`close`、`openHome` 与 `openConversation`。编辑草稿时标记 dirty，仅在保存成功或明确丢弃后清除，并显示异步错误。dirty 仅在运行时存在，Workbench 不自动保存组件状态。离开确认覆盖 Workbench 路由，不保证阻止 DSH 导航或关闭浏览器。

每次应用注册获得新的 generation。卸载撤销运行时贡献、使旧代次写入失效，但保留持久化实例；相同 appId 重新注册后经过验证或迁移再恢复可用。Client fiber 替换不保留 React 局部状态；应用仍需在 cleanup 取消请求，并在外部写入前拒绝迟到响应。

保存成功不会自动清除 dirty。应用只在保存对应的编辑代次仍是最新代次时调用 setDirty(false)，或在用户明确放弃草稿后清除。保存期间继续输入的草稿必须保持 dirty。

异步迁移接收 `{ signal }`，应用注销及基座 dispose 会 abort 并等待已启动的迁移/Creator 任务，默认 5 秒后仍未静止则记录并拒绝 teardown。超时不是清理成功；宿主不能强制终止忽略 signal 的第三方代码。注册 disposer 必须交给 Cordis 等待，迁移与 Creator 必须自行收束外部资源。

损坏的旧 JSON 和非法实例被隔离，不阻止合法实例导入；原始源字符串保存在 recovery 与独立 legacy-backup 中，首页展示原因并提供原始备份下载。不会自动回退到较旧 key 或删除原数据；尚无修复 JSON 后重新导入的界面。

## 呈现与 DOM 限制

| 模式 | 声明 | Renderer |
| --- | --- | --- |
| `page` | `conversation: 'exclusive'` | `renderMain`，可选 `renderSecondary` |
| `panel` | `placement: 'right' \| 'bottom'`、`behavior: 'push' \| 'overlay'`、`conversation: 'resident'` | `renderPanel` |
| `capsule` | `placement: 'floating'`、`conversation: 'resident'` | `renderCapsule` |

每种 kind 最多声明一次，默认值必须已声明。未实现插入 conversation 内部的 capsule。`resolvePresentationLayout(presentation, width, height)` 返回 `{ presentation, panelSize, rightInset, bottomInset }`。右侧大小为 `min(360, width)`，底部为 `min(280, height * .55)`；容器 width < 720 时右侧 push 降为 overlay，height < 560 时底部 push 降为 overlay。宿主与 adapter 共享 `--workbench-panel-size`，传给应用的是实际行为，不一定是请求的 push。

基座保留面向 `sidebar.workspaces` 与 `conversation` 的 DOM 兼容层，不修改 DSH 源码。page 成功挂载后隐藏 Conversation 内容并屏蔽交互，不卸载 DSH React 子树。侧栏、中心独立挂载和重试，卸载恢复所接管的 style 与 root；应用不要在该层上叠加自己的选择器。

导航使用核实过的可选 `sessions.list.getSnapshot().current` / `subscribe`，并保留窄化的叶子会话行冒泡 click 适配。嵌套菜单和按钮、preventDefault、修饰键点击不会关闭 Workbench。这不是通用 DSH 导航意图 API：可观察切换到另一会话，但“新建会话”复用当前已选空会话时可能不会关闭 Workbench。sessions 服务缺失时仅有 DOM fallback。未来 DSH DOM 结构变化可能要求更新 adapter。

## 模板与 Agent Creator

实例模板是已安装应用的 JSON 元数据，提供的 `defaultConfig` 必须通过应用验证。Agent 模板引用独立 Creator，其方法签名为：

```ts
start(template, context: { signal: AbortSignal; requestId: string }):
  Promise<{ instanceId: string } | { sessionId: string }>
```

用 `ctx.effect(() => workbench.registerCreator(definition))` 注册。只能连接已经核实的真实 Host/Session API，Workbench 不自动创建 Agent。模型可见的请求、结果、错误必须进入可审计的 Session 流程。返回已经提交且存在的 Workbench instanceId 或真实 sessionId。`cancelCreation()` 会 abort signal 并忽略旧结果，不保证远端 Host/Agent 停止，也不回滚已提交工作。Creator 必须自行实现协作取消与资源清理。

## 构建与验收

仓库自带 build helper，不依赖 DSH checkout 或 `DSH_CHECKOUT`。构建工具支持 Node `^22.18.0 || >=24.11.0`；source 测试需要 Node 22.18+ 的 TypeScript stripping，同时还需满足所安装依赖的 engine 要求。package.json 的已发布产物 runtime engine 范围是另一项约束。

按任务运行 `pnpm run check`、`pnpm test`、`pnpm run build:verify`、`pnpm --dir examples/design-board run build:verify` 与 `pnpm run verify:i18n`。build 脚本支持 `--dry-run`（不写入）、`--check`（临时声明产物）和 `--verify`（临时完整构建）；普通 `pnpm run build` 写入 `lib`。发布或更新提交产物前，必须显式运行 `pnpm run build` 与 `pnpm run build:example` 重建基座及示例。

至少覆盖创建、保存、刷新、非法配置、迁移成功/失败/新版本不兼容、revision 冲突、初始化失败与 retry、卸载重注册、旧 generation、Creator 取消与真实窄容器尺寸。另行验证组装后的 DSH GUI、会话菜单与卸载恢复；source 测试或隔离构建通过不等于正在运行的 GUI 已验证。Client HMR 需要匹配 watcher，manifest 或依赖图变化仍需构建加刷新或重启。

复用已安装 DSH primitive 图标和语义色 token。图标按钮应有可访问名称、键盘焦点和稳定尺寸；与相邻 DSH 控件比较视觉重量、裁切和窄屏布局。
