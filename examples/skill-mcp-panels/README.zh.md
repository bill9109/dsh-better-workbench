# dsh-better-workbench-skill-mcp-panels — 技能 + MCP 双页面示例

[![Example v0.1.0](https://img.shields.io/badge/example-v0.1.0-5B4CF0?style=flat-square)](https://github.com/omdsh-dev/dsh-better-workbench/tree/main/examples/skill-mcp-panels)
[![License: MIT](https://img.shields.io/badge/license-MIT-0B7285?style=flat-square)](LICENSE)
[![DSH Workbench](https://img.shields.io/badge/requires-dsh--workbench-5B4CF0?style=flat-square)](../..)

**在基座之后安装：** `dsh plugin --profile web add /path/to/dsh-better-workbench/examples/skill-mcp-panels`

**从 [Fishquito7/dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel) 移植的双页面 Workbench 应用：一个页面管理磁盘上的 DSH 技能，另一个页面管理 profile `cordis.patch.yml` 受管块里的 MCP 服务器。**

[English](README.md) | [中文](README.zh.md)

## 来源与致谢

本示例是**移植，不是原创**。上游项目为：

- **[Fishquito7/dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel)** —— MIT 许可，Copyright (c) 2026 dsh-skill-viewer contributors。

其「技能 / MCP」界面、Typert 宿主服务与磁盘技能约定在这里被完整保留；原始 MIT 声明随 [LICENSE](LICENSE) 一起分发，请勿删除。阅读、提 issue 或改进这段代码时，请记得它的出处是上游项目。

### 为做成示例所做的改动

- 上游的设置分栏（`settings.section`，order 16/16.5）改为两个 Workbench `page` 应用。
- 客户端从上游的 classic-script 束重新打包成 `src/client/index.ts`，以配合本仓库的 `build/client-bundle` helper。
- 移除了 `dsh-panel` CLI、其全局命令 shim 以及 `src/global-shim.ts`：示例聚焦这两个页面，参考示例不应顺手安装全局命令。
- 两个图标是从上游 `assets/icon.png`、`assets/mcp-icon.png` 描摹出的 16x16 `currentColor` SVG 路径。
- 包名、插件名与 `appId` 改入本仓库命名空间。

## 注册了什么

两个独立应用，均为 `page + conversation: exclusive`：

| 页面 | appId | 默认实例 |
| --- | --- | --- |
| **技能** | `dsh-better-workbench-skill-mcp-panels:skills` | `dsh-better-workbench-skill-mcp-panels-skills` |
| **MCP** | `dsh-better-workbench-skill-mcp-panels:mcp` | `dsh-better-workbench-skill-mcp-panels-mcp` |

宿主半区另外注册 `skillsViewer` 与 `mcpManager` 两个 Typert 远程服务，以及一个面向「深度 >= 2」嵌套技能束的提供方。

> **请用本示例替代独立的 `dsh-better-workbench-skill-mcp` 插件安装。** 两者注册的远程服务名相同，同一 profile 同时加载会冲突。

## 技能页面

- 技能卡片/树形列表与搜索。
- 按作用域热启用/停用（把 `SKILL.md` 改名为 `SKILL.md.disabled` 或改回）、删除、查看完整正文。
- 支持 `.md` 单文件、`.zip` 压缩包、技能文件夹与拖拽导入，带校验与失败回滚。
- 工作区横栏（全局 + 全部已知工作区）与分组横栏，均可横向滚动。
- 跨作用域批量迁移（复制/移动）与分组编辑器。

技能根与 DSH 的发现规则完全一致：`~/.dsh/skills`、`~/.agents/skills`，以及每个工作区的 `.dsh/skills`、`.agents/skills`；根内嵌套更深的技能束同样会被发现。放在这些根之外任意路径的技能目录，这里看不到——DSH 也看不到。

## MCP 页面

- 列出 profile `cordis.patch.yml` 中本包受管块内的每一行。
- 新增/编辑 `stdio`（command/args/env/cwd）与 `streamable-http`（url/headers）服务器；密钥脱敏，未填写的 key 保留旧值。
- 启用/停用、删除，以及列出已发现工具的实时连接测试。
- 受管块之外的行以 **外部管理** 只读展示；受管块之外的内容逐字节保留。

保存即写入受管块，由 DSH HMR 热加载，无需重启网关。

## 安装

先安装 Workbench 基座：

```sh
git clone https://github.com/omdsh-dev/dsh-better-workbench.git
cd dsh-better-workbench
dsh plugin --profile web add "$PWD"
dsh plugin --profile web add "$PWD/examples/skill-mcp-panels"
```

重启 DSH Web 并硬刷新浏览器，Workbench 侧栏与首页就会出现 **技能** 和 **MCP**，点开即为整页应用。

### 卸载

```sh
dsh plugin --profile web remove dsh-better-workbench-skill-mcp-panels
```

实例数据会保留为不可用状态，直到同名 `appId` 回归；卸载不会改动磁盘上的任何技能文件。

## 维护约定

- `src/skill-files.ts` 是技能磁盘约定的唯一事实源，必须与 `@deepseek-ai/dsh-skill-filesystem` 的发现行为保持一致。
- 受管 MCP 块之外的内容一律不写；`src/patch-editor.ts` 是唯一的写入方。
- 改完源码要重建 `lib/`；本目录可作为独立 DSH bundle 安装。

## 模型体验

本示例不贡献任何模型工具、prompt 或 Session 日志事件。它改动的只是 DSH 本就在监听的技能文件与 profile patch 层。

## 开发与验证

仓库内构建 helper 不依赖 DSH checkout 或 `DSH_CHECKOUT`。在仓库根目录：

```sh
pnpm install
pnpm --dir examples/skill-mcp-panels run check
pnpm --dir examples/skill-mcp-panels run build:verify
```

提交产物前显式重建：

```sh
pnpm --dir examples/skill-mcp-panels run build
```

## License

移植代码沿用上游的 MIT；原始版权声明见 [LICENSE](LICENSE)。本仓库其余部分为 BSD-3-Clause。
