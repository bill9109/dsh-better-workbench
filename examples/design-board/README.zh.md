# dsh-workbench-design-board — DSH Web 设计参考

[![Example v0.2.0](https://img.shields.io/badge/example-v0.2.0-5B4CF0?style=flat-square)](https://github.com/bill9109/dsh-workbench/tree/main/examples/design-board)
[![License: BSD-3-Clause](https://img.shields.io/badge/license-BSD--3--Clause-0B7285?style=flat-square)](LICENSE)
[![DSH Workbench](https://img.shields.io/badge/requires-dsh--workbench-5B4CF0?style=flat-square)](../..)

**在基座安装后添加：** `dsh plugin --profile web add /path/to/dsh-workbench/examples/design-board`

**符合 Workbench 协议的 DSH 参考应用：将真实 DSH 组件源码整理为固定信息架构的设计系统看板，覆盖 token、基础组件、产品布局、状态、无障碍和实现溯源。**

[English](README.md) | 中文

## 为什么需要它

组件截图或泛化画廊无法说明 DSH 界面如何真正组合。权威信息分布在语义 token、基础组件几何、产品专属组合、响应式约束、无障碍状态，以及每项贡献所属的 Cordis Slot 中。

本应用将这些关系记录在一张 Workbench 页面中。它是参考应用，不是替代组件库，也不是脱离当前 DSH 源码的视觉仿制品。

## 它注册了什么

- `appId`：`dsh-design-board`
- `protocolVersion`：`1`
- 呈现：`page + conversation: exclusive`
- 默认实例：`dsh-design-board-default`
- 实例模板：`dsh-design-board:reference`
- 主 renderer：看板页面
- 辅助 renderer：固定信息架构导航

贡献通过 `ctx.effect()` 注册。停止示例时，应用、模板、样式和 renderer 贡献会一起撤销；持久化实例仍会保留，之后同一 `appId` 回归时可以恢复。

## 信息架构

看板始终使用以下顺序：

1. **总览**：系统地图和阅读顺序
2. **基础资源**：颜色与字体、图标、基础组件
3. **规范**：状态与响应式、无障碍、实现记录
4. **产品页面**：应用框架、侧边栏、设置弹窗、会话标题栏、对话流、输入区、轨迹、浮层与全局反馈

基础资源提供语义资源；基础组件负责自身几何和命名后的交互变体；产品页面负责放置、组合和可用空间约束。同一语义角色使用同一个命名变体时，跨产品区域保持同样的样式。区域差异必须由功能、交互或密度约束证明，并命名为独立变体。

## 产品页面参考

看板记录真实的 `748px` 对话阅读列、`780px` Composer 上限、`22px` Composer 圆角、附件 rail、选择控件、上下文占用和 `34px` 发送/停止动作。Composer 是专用多行产品组合，不是放大的基础 Input。

它也记录应用 Shell、侧边栏、设置、会话标题栏、消息流、思考和状态行为、轨迹工具栏与检查器，以及 Menu、Tooltip、HoverCard、Modal、Toast、ConnectionBanner 和 onboarding 层。每个规范标本标明 owner、源码路径或 DOM root、语义 token、状态、几何和相关组合规则。

## 安装

先安装 Workbench 基座，再安装本示例：

```sh
git clone https://github.com/bill9109/dsh-workbench.git
cd dsh-workbench
dsh plugin --profile web add "$PWD"
dsh plugin --profile web add "$PWD/examples/design-board"
```

重启 DSH Web 并硬刷新浏览器。随后侧边栏中会出现 **DSH UI 样式看板**，Workbench 首页的 **创建工作台** 中也会出现同一参考模板。

### 升级和卸载

先更新根仓库，再重新添加本地示例路径。卸载：

```sh
dsh plugin --profile web remove dsh-workbench-design-board
```

Workbench 基座会将参考实例保留为不可用状态，直至重新安装此示例。

## 维护规则

- 每个标本必须依据当前 DSH 源码得出；不能把未使用的 token 或资源提升为标准。
- 视觉相似不足以合并组件。产品专属几何、状态和无障碍行为必须保留在所属产品中。
- 保持固定信息架构，并使用中文产品文案。
- 上游 token 或几何变化后，重新验证桌面 `1440px` 与窄屏 `390px`。
- 源码变更后重新构建 `lib/`；该目录可独立作为 DSH bundle 安装。

## 模型体验

本示例不提供模型工具、不增加 Prompt，也不写入 Session 日志。它是纯浏览器端参考 UI。

## 开发与验证

仓库自带 build helper，不需要 DSH checkout 或 `DSH_CHECKOUT`。构建工具要求 Node `^22.18.0 || >=24.11.0`。在仓库根目录运行以下命令验证，不覆盖已提交的 `lib` 产物：

```sh
pnpm install
pnpm run check
pnpm run check:example
pnpm run build:verify
pnpm --dir examples/design-board run build:verify
```

示例构建会在临时目录编译当前根 Workbench 声明，不修改 node_modules，也不依赖预先构建的根声明产物。设计板仍是仓库内参考；独立复制的应用包应使用[独立 starter](../starter)，通过公开 build helper 构建。

发布或安装变更源码前，必须显式重建基座与示例产物：

```sh
pnpm run build
pnpm run build:example
```

仅修改源码或运行临时验证不会安装本次未发布协议变更。DSH Web 重启并刷新后，在实际应用中验证；只有对应 DSH Client watcher 正在重建 client bundle 时，纯浏览器源码才支持自动替换。

## License

BSD-3-Clause
