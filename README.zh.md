# dsh-workbench — DeepSeek Harness 可扩展工作台

[![Version v0.2.0](https://img.shields.io/badge/version-v0.2.0-5B4CF0?style=flat-square)](https://github.com/bill9109/dsh-workbench/releases)
[![License: BSD-3-Clause](https://img.shields.io/badge/license-BSD--3--Clause-0B7285?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%5E20%20%7C%20%3E%3D22-339933?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)
[![DSH profile](https://img.shields.io/badge/DSH-Web-5B4CF0?style=flat-square)](cordis.patch.yml)

**安装：** `dsh plugin --profile web add github:bill9109/dsh-workbench`

**DeepSeek Harness Web UI 插件：提供常驻工作台首页、可持久化的应用实例、模板，以及可供第三方 DSH 应用复用的 `page`、`panel`、`capsule` 呈现宿主。**

[English](README.md) | 中文

## 为什么需要它

DSH 插件可以贡献工具、服务和小型 UI 入口，但完整的浏览器应用仅有组件挂载点还不够。它还需要稳定的导航位置、可持久化实例、刷新后可恢复的路由、与 Conversation 共存的明确规则，以及应用暂时不可用时的恢复机制。

`dsh-workbench` 统一负责这些基础设施。应用向 Workbench Client Service 注册定义；Workbench 渲染其实例，只保存稳定 JSON 状态，并让每项贡献随对应 Cordis fiber 一起撤销。应用仍然负责自己的界面、资源和异步收束。

即使没有安装任何 Workbench 应用，内置首页也始终可用。

## 实现能力

- 集成到 DSH 侧边栏的常驻工作台首页
- 以响应式卡片宫格展示已安装的工作台实例
- 显式 `conversation`、`workbench-home`、`workbench-instance` 路由
- 使用稳定 `appId` 的应用 Registry
- 实例创建、排序、重命名、配置和删除持久化
- 实例模板和可选 Agent Creator 模板
- 独占中心区域的 `page` 呈现
- 位于右侧或底部、支持 `push` / `overlay` 的 `panel` 呈现
- 与 Conversation 相邻或浮动的 `capsule` 呈现
- 应用卸载后保留实例、重新安装后自动恢复
- 带版本的 JSON 持久化和 v1 到 v2 迁移
- 应用、模板和 Creator 随 Cordis fiber 撤销与重新激活
- `docs/` 中的 Workbench 应用开发 Skill 与中英文协议参考
- `examples/design-board/` 中完整的 DSH 设计系统参考应用

## 使用

在展开的 DSH 侧边栏工作台区域打开 **首页**。首页会以卡片展示所有已保存实例。

点击 **创建工作台** 展开模板和已安装应用。选择模板或应用后会创建实例，并按其默认呈现方式打开。已有卡片可以直接重新打开对应实例。

侧边栏还提供工作台搜索、视图选项、创建、重命名、删除和排序。侧边栏收起时不会额外插入工作台首页图标。

## 安装

仓库根包是 DSH **bundle**（`package.json` 声明 `dsh.bundle` 与 `dsh.client`）。使用标准插件命令安装到 `web` profile，**无需修改 DSH 源码，也无需配置 `config.yaml`**：

```sh
dsh plugin --profile web add github:bill9109/dsh-workbench
# 或使用本地 checkout：
dsh plugin --profile web add /path/to/dsh-workbench
```

仓库已经提交 `lib/` 构建产物，从 GitHub 安装后无需在本地重新构建。

安装后重启 DSH Web，并在浏览器中硬刷新。只有包进入浏览器 boot graph 后，Client 插件才会加载。

### 安装设计板示例

基础 bundle 不会默认启用参考应用。克隆仓库后，先安装基座，再安装示例包：

```sh
git clone https://github.com/bill9109/dsh-workbench.git
cd dsh-workbench
dsh plugin --profile web add "$PWD"
dsh plugin --profile web add "$PWD/examples/design-board"
```

重启 DSH Web 并硬刷新后，**DSH UI 样式看板**会作为默认 Workbench 实例出现，同时提供创建模板。

### 升级

```sh
dsh plugin --profile web update github:bill9109/dsh-workbench
```

本地路径安装时，拉取新的 checkout 后，对根包和已安装的示例包重新执行 `add`。随后重启 DSH Web 并硬刷新。

### 卸载

先移除应用，再移除其 Workbench 宿主：

```sh
dsh plugin --profile web remove dsh-workbench-design-board
dsh plugin --profile web remove dsh-workbench
```

移除应用后，其实例会保留为不可用记录。重新安装具有同一 `appId` 的应用后，这些实例会恢复。

## 应用模型

Workbench 应用是一个 DSH Client 插件：它把 `workbench` Client Service 声明为硬依赖，并在 Cordis effect 内注册贡献：

```ts
import type { WorkbenchClientContext } from 'dsh-workbench/client'
import { MyWorkbench } from './MyWorkbench.tsx'

export const inject = ['workbench']

export function apply(ctx: WorkbenchClientContext): void {
  ctx.effect(() => ctx.workbench.registerApp({
    protocolVersion: 1,
    appId: 'example-workbench',
    title: '示例工作台',
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    renderMain: MyWorkbench,
  }), 'example-workbench: app registration')
}
```

应用只能声明自身真正可以渲染的呈现方式：

| 呈现方式 | Conversation | 必需 renderer | 用途 |
| --- | --- | --- | --- |
| `page` | `exclusive` | `renderMain` | 完整中心应用；可选 `renderSecondary` |
| `panel` | `resident` | `renderPanel` | 位于右侧或底部，使用 `push` 或 `overlay` |
| `capsule` | `resident` | `renderCapsule` | 轻量的 Conversation 相邻或浮动界面 |

发布应用前请阅读 [Workbench 应用开发 Skill](docs/application-authoring/SKILL.md) 和[完整中文规范](docs/application-authoring.zh.md)。英文参考位于 [docs/application-authoring.md](docs/application-authoring.md)。

## 持久化与生命周期

Workbench 只持久化稳定 ID、当前路由、顺序、标题和无环普通 JSON 配置。它不会保存 React 节点、函数、Cordis Context、Service、DOM 节点、socket、进程或类实例。

每个应用、模板和 Agent Creator 注册都会返回 disposer，并由贡献方的 Cordis Client fiber 持有。fiber 停止时，Workbench 移除贡献但保留持久化实例。使用相同稳定 ID 重新注册后，实例恢复可用且不会重复。

Client HMR 会替换完整 Client 插件 fiber，不保留 React 局部状态。安装新包，或修改 package manifest、bundle ID、依赖图时，仍然需要重建，并刷新页面或重启 DSH Web。

## 故障排查

| 症状 | 解决 |
| --- | --- |
| 工作台区域或 **首页** 没有出现 | 用 `dsh --profile web --dump-config | grep workbench` 检查 bundle，重启 DSH Web，并硬刷新浏览器 |
| 设计板没有出现 | 先安装根包，再安装 `examples/design-board`；确认两个包都在 `web` profile 中，然后重启并硬刷新 |
| 已保存卡片显示应用不可用 | 重新安装或激活拥有同一 `appId` 的包；保留该记录是预期行为 |
| 修改 Client 源码后页面没有变化 | 重新构建 `lib/client.js`。只有匹配的 DSH Client watcher 正在运行时才支持 HMR，否则需要刷新或重启 |
| 页面覆盖了 Conversation，但 Conversation 没有卸载 | 这是当前 DSH 0.1.x 的兼容适配。它会屏蔽 Conversation 交互，但不会卸载 Conversation React 子树 |
| 插件更新后应用消失 | 检查 `registerApp`、`registerTemplate`、样式、监听器等是否由 `ctx.effect()` 返回，并确认应用仍然 inject `workbench` |

## 设计板示例

[`examples/design-board`](examples/design-board) 是 Workbench 协议的首个参考应用。它是仅浏览器端的 `page + conversation: exclusive` 应用，并注册一个默认实例和一个实例模板。

它使用固定信息架构：

1. `总览`
2. `基础资源`
3. `规范`
4. `产品页面`

看板基于当前 DSH 组件源码，记录语义 token、字体、图标、基础组件、Shell 区域、设置、会话界面、对话流、真实 Composer、轨迹、浮层、状态和无障碍规则。它是设计参考，不是泛化组件画廊。

## 模型体验

基座和设计板示例不提供模型工具、不增加 Prompt，也不写入 Session 日志。Workbench UI 状态对模型不可见。可选 Agent Creator 是独立应用贡献，必须通过可审计的 Session/Agent 路径记录所有模型可见请求与结果。

## 开发与验证

构建脚本需要可用的 DSH checkout。可以通过 `dsh` 命令自动定位，也可以显式指定：

```sh
pnpm install
DSH_CHECKOUT=/path/to/dsh pnpm run build
pnpm run check
pnpm test
DSH_CHECKOUT=/path/to/dsh pnpm run build:example
pnpm run check:example
pnpm run verify:i18n
```

仓库结构：

- `src/` — Workbench Client Service、持久化 Controller、侧边栏、首页和呈现宿主
- `tests/` — Service 生命周期、路由、迁移、模板和不可用实例恢复测试
- `docs/` — Workbench 应用开发 Skill 与中英文协议参考
- `examples/design-board/` — 拥有独立 bundle manifest 的完整参考应用
- `lib/` — 已提交的基座插件构建产物

## 社区与关于

- 可复现 bug、聚焦的功能请求和使用问题，请走 [GitHub Issues](https://github.com/bill9109/dsh-workbench/issues)。
- 提交变更前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)；安全问题按照 [SECURITY.md](SECURITY.md) 私下报告。
- 版本与兼容性说明见 [CHANGELOG.md](CHANGELOG.md)。

## License

BSD-3-Clause
