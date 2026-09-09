# dsh-better-workbench — DeepSeek Harness 可扩展工作台

[![Version v0.3.0](https://img.shields.io/badge/version-v0.3.0-5B4CF0?style=flat-square)](https://github.com/omdsh-dev/dsh-better-workbench/releases)
[![License: BSD-3-Clause](https://img.shields.io/badge/license-BSD--3--Clause-0B7285?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%5E20%20%7C%20%3E%3D22-339933?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)
[![DSH profile](https://img.shields.io/badge/DSH-Web-5B4CF0?style=flat-square)](cordis.patch.yml)

**安装：** `dsh plugin --profile web add github:omdsh-dev/dsh-better-workbench`

**DeepSeek Harness Web UI 插件：提供常驻工作台首页、可持久化的应用实例、模板，以及可供第三方 DSH 应用复用的 `page`、`panel`、`capsule` 呈现宿主。**

[English](README.md) | 中文

## 为什么需要它

DSH 插件可以贡献工具、服务和小型 UI 入口，但完整的浏览器应用仅有组件挂载点还不够。它还需要稳定的导航位置、可持久化实例、刷新后可恢复的路由、与 Conversation 共存的明确规则，以及应用暂时不可用时的恢复机制。

`dsh-better-workbench` 统一负责这些基础设施。应用向 Workbench Client Service 注册定义；Workbench 渲染其实例，只保存稳定 JSON 状态，并让每项贡献随对应 Cordis fiber 一起撤销。应用仍然负责自己的界面、资源和异步收束。

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
- 仅 `floating` 位置的 `capsule` 呈现
- 应用卸载后保留实例、重新安装后自动恢复
- IndexedDB 全状态原子事务、revision 冲突检查、版本化配置与旧数据导入
- 应用、模板和 Creator 随 Cordis fiber 撤销与重新激活
- `docs/` 中的 Workbench 应用开发 Skill 与中英文协议参考
- `examples/design-board/` 中完整的 DSH 设计系统参考应用

## 使用

在展开的 DSH 侧边栏工作台区域打开 **首页**。首页会以卡片展示所有已保存实例。

点击 **创建工作台** 展开模板和已安装应用。选择模板或应用后会创建实例，并按其默认呈现方式打开。已有卡片可以直接重新打开对应实例。

侧边栏还提供工作台搜索、视图选项、创建、重命名、删除和排序。侧边栏收起时不会额外插入工作台首页图标。

## 安装

仓库根包是 DSH **bundle**（`package.json` 声明 `dsh.bundle` 与 `dsh.client`），已发布到 **npm，包名 `dsh-better-workbench`**。无需修改 DSH 源码，也无需配置 `config.yaml`。存在两种受支持的激活方式，请二选一——切勿把同一包同时注册为 bundle 与插件行：否则该插件行的 `id` 会被插入两次，启动时因 duplicate loader entry 失败。

**作为 profile bundle（标准方式，面向使用者）：**

```sh
dsh plugin --profile web add dsh-better-workbench
# 或从 GitHub（源码/预发布）：
dsh plugin --profile web add github:omdsh-dev/dsh-better-workbench
# 或使用本地 checkout：
dsh plugin --profile web add /path/to/dsh-better-workbench
```

因为包声明了 `dsh.bundle`，`dsh plugin add` 会把它记入 profile 的 `dsh.profile.bundles` 并以 bundle 层激活。增删 bundle、或修改包清单/依赖时，需要**重启 `dsh web`**，随后硬刷新浏览器以加载 Client bundle。

**作为用户插件行（热加载，本地开发）：**

```sh
dsh plugin --profile web add /path/to/dsh-better-workbench
# 然后在 ~/.dsh/profiles/web/cordis.patch.yml 中加入：
#   - insert:
#     - id: workbench       name: 'dsh-better-workbench'
#     - id: design-board    name: 'dsh-better-workbench-design-board'
```

用户插件行由 `watchUserPatches` watcher 持续热应用，所以源码/bundle 内容改动**无需重启 `dsh web`**——刷新浏览器（或 dev 模式 HMR）即可加载 Client bundle。仅当修改 bundle 清单/依赖时才需要重启。使用本方式时，请保持该包**不在** profile 的 `dsh.profile.bundles` 中（运行 `dsh plugin` 时 CLI 可能把声明了 `dsh.bundle` 的包重新加回去）。

已发布版本包含提交的 `lib/` 产物，并已发布到 npm（`dsh-better-workbench`）。发布或从源码安装前，请重建基座与示例产物：仅修改源码不会更新已安装 GUI。

### 安装设计板示例

基础 bundle 不会默认启用参考应用。克隆仓库后，先安装基座，再安装示例包：

```sh
git clone https://github.com/omdsh-dev/dsh-better-workbench.git
cd dsh-better-workbench
dsh plugin --profile web add "$PWD"
dsh plugin --profile web add "$PWD/examples/design-board"
```

无需重启 `dsh web`：刷新浏览器后，**DSH UI 样式看板**会作为默认 Workbench 实例出现，同时提供创建模板。

### 升级

```sh
dsh plugin --profile web update dsh-better-workbench
# 或从 GitHub：
dsh plugin --profile web update github:omdsh-dev/dsh-better-workbench
```

本地路径安装时，拉取新的 checkout 后，对根包和已安装的示例包重新执行 `add`。改动会被热应用，随后刷新浏览器即可（仅当修改了包清单或依赖时才需重启）。

### 卸载

先移除应用，再移除其 Workbench 宿主：

```sh
dsh plugin --profile web remove dsh-better-workbench-design-board
dsh plugin --profile web remove dsh-better-workbench
```

移除应用后，其实例会保留为不可用记录。重新安装具有同一 `appId` 的应用后，这些实例会恢复。

## 应用模型

Workbench 应用是一个 DSH Client 插件：它把 `workbench` Client Service 声明为硬依赖，并在 Cordis effect 内注册贡献：

```ts
import type { WorkbenchClientContext } from 'dsh-better-workbench/client'
import { MyWorkbench } from './MyWorkbench.tsx'

export const inject = ['workbench']

export function apply(ctx: WorkbenchClientContext): void {
  ctx.effect(() => ctx.workbench.registerApp({
    protocolVersion: 1,
    config: {
      version: 1,
      defaults: () => ({ section: 'overview' }),
      validate(config) {
        if (typeof config.section !== 'string') throw new Error('Invalid section')
      },
    },
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
| `capsule` | `resident` | `renderCapsule` | 仅浮动的轻量界面 |

发布应用前请阅读 [Workbench 应用开发 Skill](docs/application-authoring/SKILL.md) 和[完整中文规范](docs/application-authoring.zh.md)。英文参考位于 [docs/application-authoring.md](docs/application-authoring.md)。

## 持久化与生命周期

IndexedDB 用全状态原子事务持久化实例元数据与无环普通 JSON 配置，并通过 revision 检查写入冲突。路由与每实例呈现偏好单独放在每标签页 sessionStorage。首次导入读取旧 localStorage key，但不删除源数据。普通实例创建使用 UUID，显式默认 ID 与导入 ID 保留。Workbench 不托管或备份应用业务文件。

本次未发布重设计仍只有 `protocolVersion: 1`，必填 `config.version/defaults/validate`，可选异步 `config.migrate`，创建、保存、重命名、删除与排序均异步。它不兼容旧同步应用 API。可选 `source` 是自报元数据，不是认证来源；每次注册的新 generation 防止替换后旧应用回调写入。

每个应用、模板和 Agent Creator 注册都会返回 disposer，并由贡献方的 Cordis Client fiber 持有。fiber 停止时，Workbench 移除贡献但保留持久化实例。使用相同稳定 ID 重新注册后，实例恢复可用且不会重复。

Client HMR 会替换完整 Client 插件 fiber，不保留 React 局部状态。安装新包，或修改 package manifest、bundle ID、依赖图时，仍然需要重建，并刷新页面或重启 DSH Web。

实例 Surface 可导出元数据、配置与已记录的配置备份 JSON。`restoreBackup` 仅为服务 API，要求备份匹配当前应用 configVersion、通过验证与 revision CAS，并备份替换前配置。没有自动降级、JSON 导入或备份恢复 UI。

## 接入限制

DOM 兼容层不需要修改 DSH 源码。Conversation React 子树仍然存在，Workbench 单独挂载，卸载时恢复接管的 style。它观察真实可选 `sessions.list` 选择状态和窄化的会话行冒泡点击。“新建会话”复用当前已选空会话时可能不会关闭 Workbench；这不是通用导航意图 API。会话菜单与嵌套控件已排除。

右侧 panel 大小为 `min(360, 容器宽度)`，底部为 `min(280, 容器高度 * .55)`；右侧宽度小于 720、底部高度小于 560 时 push 降为 overlay。应用收到实际 presentation。capsule 仅支持 floating。Creator 取消只发送 `AbortSignal`，不保证远端 Agent 停止，也不回滚已提交工作。

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

构建使用仓库自带 helper，不需要 DSH checkout 或 `DSH_CHECKOUT`。构建工具支持 Node `^22.18.0 || >=24.11.0`。source 测试使用 Node 22.18+ TypeScript stripping，同时需满足依赖 engine 要求；这与上方已发布产物 runtime engine 徽章是不同约束。验证构建放在临时目录，不覆盖 `lib`：

```sh
pnpm install
pnpm run build:verify
pnpm run check
pnpm test
pnpm --dir examples/design-board run build:verify
pnpm run check:example
pnpm run verify:i18n
```

发布或按源码安装之前，必须显式重建两组已提交产物：

```sh
pnpm run build
pnpm run build:example
```

`--dry-run` 只打印计划，不写入；`--check` 和 `--verify` 使用临时产物。[examples/starter](examples/starter) 演示独立包布局如何使用公开的 `dsh-better-workbench/build/client-bundle` helper，与仓库内设计板示例不同。复制后的独立布局验证不等于全新 registry 安装测试；从 registry 使用前需发布新的 helper 与协议产物。

仓库结构：

- `src/` — Workbench Client Service、持久化 Controller、侧边栏、首页和呈现宿主
- `tests/` — Service 生命周期、路由、迁移、模板和不可用实例恢复测试
- `docs/` — Workbench 应用开发 Skill 与中英文协议参考
- `examples/design-board/` — 拥有独立 bundle manifest 的完整参考应用
- `lib/` — 已提交的基座插件构建产物

## 社区与关于

- 可复现 bug、聚焦的功能请求和使用问题，请走 [GitHub Issues](https://github.com/omdsh-dev/dsh-better-workbench/issues)。
- 提交变更前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)；安全问题按照 [SECURITY.md](SECURITY.md) 私下报告。
- 版本与兼容性说明见 [CHANGELOG.md](CHANGELOG.md)。

## License

BSD-3-Clause
