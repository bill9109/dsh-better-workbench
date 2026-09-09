# dsh-workbench — Extensible workspaces for DeepSeek Harness

[![Version v0.2.0](https://img.shields.io/badge/version-v0.2.0-5B4CF0?style=flat-square)](https://github.com/omdsh-dev/dsh-workbench/releases)
[![License: BSD-3-Clause](https://img.shields.io/badge/license-BSD--3--Clause-0B7285?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%5E20%20%7C%20%3E%3D22-339933?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)
[![DSH profile](https://img.shields.io/badge/DSH-Web-5B4CF0?style=flat-square)](cordis.patch.yml)

**Install:** `dsh plugin --profile web add github:omdsh-dev/dsh-workbench`

**A DeepSeek Harness Web UI plugin that provides a permanent Workbench home, durable application instances, templates, and reusable `page`, `panel`, and `capsule` presentation hosts for third-party DSH applications.**

[English](README.md) | [中文](README.zh.md)

## Why this exists

DSH plugins can contribute tools, services, and small UI entries, but a complete browser application needs more than a component mount. It needs a stable place in navigation, persistent instances, a route that survives reloads, explicit coexistence rules with Conversation, and recovery when an application is temporarily unavailable.

`dsh-workbench` owns that shared infrastructure. Applications register a definition with the Workbench Client Service; Workbench renders their instances, stores only stable JSON state, and removes each contribution with its Cordis fiber. Applications remain responsible for their own UI, resources, and asynchronous teardown.

The built-in home is always available, even when no Workbench application is installed.

## Features

- Permanent Workbench home integrated with the DSH sidebar
- Responsive card grid for installed Workbench instances
- Explicit `conversation`, `workbench-home`, and `workbench-instance` routes
- Application registry with stable `appId` values
- Durable instance creation, ordering, renaming, configuration, and deletion
- Instance templates and optional Agent Creator templates
- `page` presentation for an exclusive center application
- Right or bottom `panel` presentations with `push` or `overlay` behavior
- Conversation-adjacent floating `capsule` presentations
- Unavailable-instance recovery when an application is removed and later restored
- IndexedDB atomic state transactions, revision conflict checks, versioned configuration and legacy-data import
- Cordis fiber disposal and reactivation for applications, templates, and creators
- Application-authoring Skill and bilingual protocol reference under `docs/`
- A complete DSH design-system reference application under `examples/design-board/`

## Usage

Open **首页** in the Workbench section of the expanded DSH sidebar. The home shows every stored instance as a card.

Use **创建工作台** to reveal templates and installed applications. Selecting a template or application creates an instance and opens its default presentation. Existing cards reopen their instance directly.

The sidebar also provides Workbench search, view options, creation, renaming, deletion, and ordering. The compact sidebar does not insert a separate Workbench-home icon.

## Install

This repository's root package is a DSH **bundle** (`package.json` declares `dsh.bundle` and `dsh.client`). Install it into the `web` profile with the standard plugin command. No DSH source changes or `config.yaml` entries are required:

```sh
dsh plugin --profile web add github:omdsh-dev/dsh-workbench
# or from a local checkout:
dsh plugin --profile web add /path/to/dsh-workbench
```

Released revisions include committed `lib/` artifacts. This working tree contains an unreleased protocol redesign: before publishing it or installing changed source, rebuild both the base and example artifacts as described below. A source-only change does not update an installed GUI.

dsh-workbench installs as a user plugin row in the profile's `cordis.patch.yml` and is live-applied by the DSH `watchUserPatches` watcher, so **no `dsh web` restart is needed**: a browser refresh (or dev-mode HMR) loads the Client bundle. Restart is only required if you change the package's bundle manifest, its dependencies, or the profile's `dsh.profile.bundles` set.

### Install the design-board example

The reference application is intentionally not enabled by the base bundle. Clone the repository, install the base first, then install the example package:

```sh
git clone https://github.com/omdsh-dev/dsh-workbench.git
cd dsh-workbench
dsh plugin --profile web add "$PWD"
dsh plugin --profile web add "$PWD/examples/design-board"
```

No `dsh web` restart is needed: refresh the browser and **DSH UI 样式看板** appears as a default Workbench instance and as a creation template.

### Upgrade

```sh
dsh plugin --profile web update github:omdsh-dev/dsh-workbench
```

For a local-path installation, pull the replacement checkout and run `add` again for the root and any installed example packages. The change is live-applied: refresh the browser afterward (restart only if you changed the bundle manifest or dependencies).

### Uninstall

Remove applications before removing their Workbench host:

```sh
dsh plugin --profile web remove dsh-workbench-design-board
dsh plugin --profile web remove dsh-workbench
```

Removing an application preserves its stored instances as unavailable records. Reinstalling an application with the same `appId` restores those instances.

## Application model

A Workbench application is a DSH Client plugin that declares a hard dependency on the `workbench` Client Service and registers its contributions inside Cordis effects:

```ts
import type { WorkbenchClientContext } from 'dsh-workbench/client'
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
    title: 'Example Workbench',
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    renderMain: MyWorkbench,
  }), 'example-workbench: app registration')
}
```

Applications declare only presentations they can render:

| Presentation | Conversation | Required renderer | Purpose |
| --- | --- | --- | --- |
| `page` | `exclusive` | `renderMain` | Full center application; optional `renderSecondary` |
| `panel` | `resident` | `renderPanel` | Right or bottom panel using `push` or `overlay` |
| `capsule` | `resident` | `renderCapsule` | Lightweight floating surface only |

Read the [Workbench application-authoring Skill](docs/application-authoring/SKILL.md) and the [complete English reference](docs/application-authoring.md) before publishing an application. A Chinese reference is available in [docs/application-authoring.zh.md](docs/application-authoring.zh.md).

## Persistence and lifecycle

IndexedDB persists instance metadata and plain acyclic JSON configuration in atomic full-state transactions, with revision checks for conflicting writes. Routes and remembered per-instance presentations live separately in per-tab sessionStorage. Initial import reads the old localStorage keys without deleting them. Ordinary instance creation uses UUIDs; explicit default IDs and imported IDs retain their meaning. Business files are not hosted or backed up by Workbench.

The unreleased redesign keeps one application protocol, `protocolVersion: 1`, with mandatory `config.version/defaults/validate`, optional async `config.migrate`, and asynchronous creation/save/rename/delete/reorder. It does not support the old synchronous application API. Optional `source` is self-reported metadata, not authenticated provenance. A new activation generation prevents stale app callbacks from writing after replacement.

Every application, template, and Agent Creator registration returns a disposer owned by the contributing Cordis Client fiber. When the fiber stops, Workbench removes the contribution but keeps its durable instances. Re-registering the same stable ID restores availability without duplicating entries.

Client HMR replaces the complete Client plugin fiber; React local state is not preserved. Installing a new package or changing a package manifest, bundle ID, or dependency graph still requires a rebuild plus a page refresh or DSH Web restart.

The instance Surface offers JSON export of instance metadata/config and recorded config backups. `restoreBackup` is available only as a service API, requiring matching active configVersion, validation and revision CAS; it also backs up the current config. No automatic downgrade, JSON import or backup-restore UI is provided.

## Integration limits

The DOM compatibility layer requires no DSH source changes. It preserves the Conversation React tree, mounting Workbench separately and restoring its owned styles on unload. It observes the optional real `sessions.list` selection plus narrow bubbling session-row clicks. A New Session action that reuses the already selected blank session may not close Workbench; this is not a universal navigation-intent API. Session menus and nested controls are excluded.

Right panels use `min(360, container width)`, bottom panels `min(280, container height * .55)`. Push falls back to overlay below width 720 (right) or height 560 (bottom). Applications receive effective presentation. Capsules are floating-only. Creator cancellation signals `AbortSignal`; it does not guarantee remote Agent termination or roll back committed work.

## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| The Workbench section or **首页** does not appear | Verify the bundle is present with `dsh --profile web --dump-config | grep workbench`, restart DSH Web, and hard-refresh the browser |
| The design board does not appear | Install the root package before `examples/design-board`, verify both packages are in the `web` profile, then restart and hard-refresh |
| A stored card says the application is unavailable | Reinstall or reactivate the package that owns the same `appId`; the record is preserved intentionally |
| Changes to Client source do not appear | Rebuild `lib/client.js`. HMR only works while the matching DSH Client watcher is running; otherwise refresh or restart |
| A page covers Conversation instead of unmounting it | This is the current DSH 0.1.x compatibility adapter. It suppresses Conversation interaction but does not unmount the Conversation React tree |
| An application disappears after a plugin update | Check that its `registerApp`, `registerTemplate`, styles, listeners, and other registrations are returned from `ctx.effect()` and that it still injects `workbench` |

## Design-board example

[`examples/design-board`](examples/design-board) is the first reference application for the protocol. It is a browser-only `page + conversation: exclusive` Workbench application and registers a default instance plus an instance template.

Its information architecture is fixed:

1. `总览`
2. `基础资源`
3. `规范`
4. `产品页面`

The board is derived from current DSH component source. It documents semantic tokens, typography, icons, primitives, shell regions, settings, session UI, conversation flow, the real Composer, trajectory, overlays, states, and accessibility. It is a design reference, not a generic component gallery.

## Model experience

The base and design-board example add no model tools, prompts, or Session-log events. Workbench UI state is not model-visible. An optional Agent Creator is a separate application contribution and must record every new model-visible request and result through an auditable Session/Agent path.

## Development and verification

Builds use repository-local helpers; no DSH checkout or `DSH_CHECKOUT` is required. Build tooling supports Node `^22.18.0 || >=24.11.0`. Source tests use Node 22.18+ TypeScript stripping and must also satisfy dependency engine requirements; this is separate from the published runtime engine badge above. Verification builds use temporary directories without replacing `lib`:

```sh
pnpm install
pnpm run build:verify
pnpm run check
pnpm test
pnpm --dir examples/design-board run build:verify
pnpm run check:example
pnpm run verify:i18n
```

Before release or a source-based installation, explicitly regenerate both sets of committed artifacts:

```sh
pnpm run build
pnpm run build:example
```

`--dry-run` prints the plan without writes; `--check` and `--verify` use temporary output. [examples/starter](examples/starter) demonstrates the public `dsh-workbench/build/client-bundle` helper in a standalone package layout; it is distinct from the design-board repository example. Copied standalone-layout validation is not a fresh registry-install test; registry use requires publication of the new helper and protocol artifacts.

Repository layout:

- `src/` — Workbench Client Service, persistence controller, sidebar, home, and presentation hosts
- `tests/` — service lifecycle, routing, migration, templates, and unavailable-instance recovery
- `docs/` — Workbench application-authoring Skill and bilingual protocol references
- `examples/design-board/` — complete reference Workbench application with its own bundle manifest
- `lib/` — committed base-plugin build output

## Community and about

- Use [GitHub Issues](https://github.com/omdsh-dev/dsh-workbench/issues) for reproducible bugs, focused feature requests, and usage questions.
- Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes; report vulnerabilities privately through [SECURITY.md](SECURITY.md).
- See [CHANGELOG.md](CHANGELOG.md) for release and compatibility notes.

## License

BSD-3-Clause
