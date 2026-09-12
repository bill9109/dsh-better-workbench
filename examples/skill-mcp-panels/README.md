# dsh-better-workbench-skill-mcp-panels — Skills + MCP two-page example

[![Example v0.1.0](https://img.shields.io/badge/example-v0.1.0-5B4CF0?style=flat-square)](https://github.com/omdsh-dev/dsh-better-workbench/tree/main/examples/skill-mcp-panels)
[![License: MIT](https://img.shields.io/badge/license-MIT-0B7285?style=flat-square)](LICENSE)
[![DSH Workbench](https://img.shields.io/badge/requires-dsh--workbench-5B4CF0?style=flat-square)](../..)

**Install after the base:** `dsh plugin --profile web add /path/to/dsh-better-workbench/examples/skill-mcp-panels`

**A two-page Workbench application ported from [Fishquito7/dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel): one page manages the DSH skills on disk, the other manages MCP servers in the profile's managed `cordis.patch.yml` block.**

[English](README.md) | [中文](README.zh.md)

## Credit

This example is a **port, not original work**. The upstream project is:

- **[Fishquito7/dsh-skill-mcp-panel](https://github.com/Fishquito7/dsh-skill-mcp-panel)** — MIT licensed, Copyright (c) 2026 dsh-skill-viewer contributors.

Its Skills/MCP UI, Typert host services and on-disk skill conventions are preserved here; the original MIT notice ships unchanged in [LICENSE](LICENSE). Please keep the upstream project in mind when reading, filing issues about, or improving this code.

### Changes made for this example

- The upstream settings sections (`settings.section`, orders 16/16.5) became two Workbench `page` applications.
- The client was repackaged from the upstream classic-script bundle into `src/client/index.ts` for this repository's `build/client-bundle` helper.
- The `dsh-panel` CLI, its global command shim and `src/global-shim.ts` were dropped; the example is about the two pages, and a reference example should not install a global binary.
- Both icons are 16x16 `currentColor` SVG paths traced from the upstream `assets/icon.png` and `assets/mcp-icon.png`.
- Package name, plugin name and `appId`s were renamed into this repository's namespace.

## What it registers

Two independent applications, each `page + conversation: exclusive`:

| Page | appId | Default instance |
| --- | --- | --- |
| **技能** (Skills) | `dsh-better-workbench-skill-mcp-panels:skills` | `dsh-better-workbench-skill-mcp-panels-skills` |
| **MCP** | `dsh-better-workbench-skill-mcp-panels:mcp` | `dsh-better-workbench-skill-mcp-panels-mcp` |

The host half additionally registers the `skillsViewer` and `mcpManager` Typert remote services, and a nested-skill provider for depth >= 2 skill bundles.

> **Install this example INSTEAD OF the standalone `dsh-better-workbench-skill-mcp` plugin.** Both halves register the same remote service names, so loading both in one profile collides.

## Skills page

- Card/tree list of registered skills and on-disk requirements, with search.
- Per-scope hot enable/disable (renames `SKILL.md` <-> `SKILL.md.disabled`), delete, and full content preview.
- Add by `.md` file, `.zip` archive, skill folder or drag-and-drop, with validation and rollback.
- Workspace bar (global plus every known workspace) and group bar, both horizontally scrollable.
- Batch migration between scopes in copy or move mode, and a group editor.

Skill roots follow DSH discovery exactly: `~/.dsh/skills`, `~/.agents/skills`, and each workspace's `.dsh/skills` and `.agents/skills`. Skill bundles nested deeper inside a root are discovered as well. A skill directory that sits at an arbitrary path outside those roots is invisible here — and to DSH.

## MCP page

- Cards for every row inside this package's managed block of the profile `cordis.patch.yml`.
- Add and edit `stdio` (command/args/env/cwd) and `streamable-http` (url/headers) servers; secret values are masked and unchanged keys keep their previous value.
- Enable/disable, delete, and a live connection test that lists discovered tools.
- Rows defined outside the managed block are shown read-only as **外部管理** (external); the managed block's surroundings are preserved byte for byte.

Saving writes the managed block and lets DSH HMR reload it; no gateway restart is needed.

## Install

Install the base Workbench package first:

```sh
git clone https://github.com/omdsh-dev/dsh-better-workbench.git
cd dsh-better-workbench
dsh plugin --profile web add "$PWD"
dsh plugin --profile web add "$PWD/examples/skill-mcp-panels"
```

Restart DSH Web and hard-refresh the browser. The Workbench sidebar and home then list **技能** and **MCP**; both open as full pages.

### Uninstall

```sh
dsh plugin --profile web remove dsh-better-workbench-skill-mcp-panels
```

Durable instances stay in an unavailable state until the same `appId` returns, and removing the package leaves every skill file on disk untouched.

## Maintenance rules

- Keep the on-disk skill conventions in sync with `@deepseek-ai/dsh-skill-filesystem`; `src/skill-files.ts` is the single source of truth shared by the host half.
- Never write outside the managed MCP block; `src/patch-editor.ts` is the only writer.
- Rebuild `lib/` after source changes; this directory is independently installable as a DSH bundle.

## Model experience

The example contributes no model tools, prompts or Session-log events. It edits ordinary skill files and the profile patch layer, which DSH already watches.

## Development and verification

The repository-local build helper needs no DSH checkout or `DSH_CHECKOUT`. From the repository root:

```sh
pnpm install
pnpm --dir examples/skill-mcp-panels run check
pnpm --dir examples/skill-mcp-panels run build:verify
```

Then, before committing artifacts:

```sh
pnpm --dir examples/skill-mcp-panels run build
```

## License

The ported code is MIT, following the upstream project; see [LICENSE](LICENSE) for the original copyright notice. The surrounding repository is BSD-3-Clause.
