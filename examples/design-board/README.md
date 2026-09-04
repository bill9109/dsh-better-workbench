# dsh-workbench-design-board — DSH Web design reference

[![Example v0.2.0](https://img.shields.io/badge/example-v0.2.0-5B4CF0?style=flat-square)](https://github.com/bill9109/dsh-workbench/tree/main/examples/design-board)
[![License: BSD-3-Clause](https://img.shields.io/badge/license-BSD--3--Clause-0B7285?style=flat-square)](LICENSE)
[![DSH Workbench](https://img.shields.io/badge/requires-dsh--workbench-5B4CF0?style=flat-square)](../..)

**Install after the base:** `dsh plugin --profile web add /path/to/dsh-workbench/examples/design-board`

**A protocol-compliant DSH Workbench reference application that turns real DSH component source into a fixed design-system board for tokens, primitives, product layouts, states, accessibility, and implementation traceability.**

[English](README.md) | [中文](README.zh.md)

## Why this exists

A component screenshot or a generic gallery does not explain how DSH interfaces are assembled. The source of truth is distributed across semantic tokens, primitive geometry, product-specific composition, responsive constraints, accessibility states, and the Cordis slots that own each contribution.

This application records those relationships in one Workbench page. It is intentionally a reference application, not a component-library replacement or a visual approximation disconnected from current DSH source.

## What it registers

- `appId`: `dsh-design-board`
- `protocolVersion`: `1`
- Presentation: `page + conversation: exclusive`
- Default instance: `dsh-design-board-default`
- Instance template: `dsh-design-board:reference`
- Main renderer: the board
- Secondary renderer: the fixed-information-architecture navigation

The contribution is registered through `ctx.effect()`. Stopping the example removes its app, template, styles, and render contribution; durable instances remain available for restoration when the same `appId` returns.

## Information architecture

The board always uses this order:

1. **总览** — system map and reading order
2. **基础资源** — colors and typography, icons, and base primitives
3. **规范** — states and responsive behavior, accessibility, and implementation records
4. **产品页面** — application frame, sidebar, settings modal, session header, conversation flow, Composer, trajectory, and overlays/global feedback

Foundations provide semantic resources. Primitives own their geometry and named interaction variants. Product pages own placement, composition, and available-space constraints. The same semantic role with the same named variant keeps the same style across product regions; a regional difference requires a named variant justified by function, interaction, or density.

## Product references

The board documents the real `748px` conversation reading column, a `780px` Composer cap, `22px` Composer radius, attachment rail, selection controls, context meter, and `34px` send/stop action. The Composer is a dedicated multi-line product combination, not a larger primitive Input.

It also records the application shell, sidebar, settings, session header, message flow, reasoning and status behavior, trajectory toolbar and inspector, Menu, Tooltip, HoverCard, Modal, Toast, ConnectionBanner, and onboarding layers. Each normative specimen identifies its owner, source path or DOM root, semantic tokens, states, geometry, and relevant composition rule.

## Install

Install the base Workbench package before this example:

```sh
git clone https://github.com/bill9109/dsh-workbench.git
cd dsh-workbench
dsh plugin --profile web add "$PWD"
dsh plugin --profile web add "$PWD/examples/design-board"
```

Restart DSH Web and hard-refresh the browser. The sidebar then shows **DSH UI 样式看板**, and Workbench home offers the same reference template under **创建工作台**.

### Upgrade and uninstall

Update the root repository first, then re-add this local example path. To remove it:

```sh
dsh plugin --profile web remove dsh-workbench-design-board
```

The Workbench base keeps the reference instance as unavailable state until the example is installed again.

## Maintenance rules

- Derive each specimen from current DSH source; do not promote unused tokens or resources into a standard.
- Visual similarity is not enough to merge two components. Keep product-specific geometry, states, and accessibility behavior with the product that owns them.
- Preserve the fixed information architecture and keep Chinese product-facing copy.
- Re-run desktop (`1440px`) and narrow (`390px`) GUI checks after upstream token or geometry changes.
- Rebuild `lib/` after source changes; this directory is independently installable as a DSH bundle.

## Model experience

The example contributes no model tools, prompts, or Session-log events. It is browser-only reference UI.

## Development and verification

From the repository root:

```sh
pnpm install
DSH_CHECKOUT=/path/to/dsh pnpm run build
DSH_CHECKOUT=/path/to/dsh pnpm run build:example
pnpm run check:example
```

The example build links the root Workbench package locally for type-checking and bundling. Verify the assembled application in DSH Web after restart and browser refresh; browser-only source changes support automatic replacement only while the matching DSH Client watcher is rebuilding the client bundle.

## License

BSD-3-Clause
