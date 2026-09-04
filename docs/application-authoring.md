---
name: dsh-workbench-application-authoring
description: "Create, migrate, or review a DSH Workbench application registered with dsh-workbench, including page/panel/capsule presentation, instances and templates, Agent Creator, Cordis disposal, persistence fallback, Client HMR, and assembled GUI verification."
whenToUse: "Use when a developer needs to register a DSH Client plugin with dsh-workbench, add a Workbench template, connect an Agent Creator, migrate an older Workbench application, or review its hot-swap lifecycle."
---

# Workbench Application Authoring Skill

This document is the Workbench-specific Skill for `dsh-workbench`. It defines how a third-party DSH Client plugin registers with the base and inherits instance persistence, navigation, unavailable-state recovery, and Cordis Client fiber reactivation.

## When To Use

Use this Skill to:

- create or migrate a DSH Client Workbench application;
- add `page`, `panel`, or `capsule` presentation;
- register instance templates, Agent templates, or creator capabilities;
- review disposers, persistence, unload residue, or Client HMR;
- verify create, open, return, and narrow-width behavior in the real 3080 GUI.

Do not use it instead of the general `dsh-cordis-plugin-authoring` Skill. Do not turn an application into its own route, page-level React root, or instance store.

## Before Coding

1. Read the current `dsh-workbench` `package.json`, `src/client/types.ts`, and this Skill. Do not infer the protocol from an older version.
2. Confirm the target DSH version, active `dsh-workbench` bundle, `dsh.client.inject`, and the running 3080 GUI.
3. Record the required presentation modes, template and creator needs, and the fiber that owns each disposer.
4. Query the current DSH Slot and Service contracts before using native DSH capabilities.

## Roles

- `dsh-workbench` is the domain infrastructure plugin. It owns application, template, and creator registries plus the built-in home, instances, and presentation routes.
- A Workbench application contributes runtime UI and JSON defaults. It does not create a page-level React root, its own route, or a second instance store.
- A creator plugin connects Agent templates to an auditable Session/Agent flow. Every new model input must enter the Session log.
- Runtime components and callbacks live only in the current activation. Persistence contains stable IDs, routes, and JSON configuration only.

## Minimal Application

```ts
import type { WorkbenchClientContext } from 'dsh-workbench/client'
import { MyWorkbench } from './MyWorkbench.tsx'

export const inject = ['workbench']

export function apply(ctx: WorkbenchClientContext): void {
  ctx.effect(() => ctx.workbench.registerApp({
    protocolVersion: 1,
    appId: '@example/my-workbench',
    title: 'Example workbench',
    presentations: [{ kind: 'page', conversation: 'exclusive' }],
    defaultPresentation: 'page',
    renderMain: MyWorkbench,
  }), 'my-workbench: app registration')
}
```

`workbench` is a hard dependency. Declare `inject = ['workbench']`, use `WorkbenchClientContext`, and return every registration disposer through `ctx.effect()`. Do not rely on patch order or timers.

## Presentation Contract

| Kind | Conversation | Renderer | Intended use |
| --- | --- | --- | --- |
| `page` | `exclusive` | `renderMain`, optional `renderSecondary` | Design systems, dashboards, administration |
| `panel` | `resident` | `renderPanel` | Files, terminals, inspectors |
| `capsule` | `resident` | `renderCapsule` | Summaries, status, lightweight launchers |

An app must declare at least one presentation and select one of them as `defaultPresentation`. A panel declaration requires `renderPanel`; a capsule declaration requires `renderCapsule`.

DSH 0.1.x has no formal center-page Slot. The current page adapter covers the center and suppresses Conversation interaction, but it does not unmount the Conversation React tree. A future formal Shell outlet can replace that adapter without changing application definitions or components.

## SVG Icon Construction

1. Inspect the current `@deepseek-ai/dsh-client-ui-primitives` icon exports and neighboring DSH components first. Reuse a semantically matching icon; hand-author an SVG only when the required glyph is absent, and do not add another icon system for one simple glyph.
2. Use `currentColor` so semantic container tokens own default, hover, active, and disabled colors. Do not hardcode product colors inside the SVG.
3. Match an established DSH construction. Compact Figma glyphs commonly use a `16 16` or `14 14` viewBox with `fill="currentColor"`. Hand-authored outlines commonly use `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.3"` to `strokeWidth="1.5"`, and round line caps and joins.
4. Calibrate optical ink, not only the CSS box. `width`, `height`, and `viewBox` do not describe visible pixel occupancy. Compare path `getBBox()`, stroke expansion, rendered dimensions, and screenshots against adjacent icons; rasterize the SVG and inspect alpha-pixel bounds when the difference is ambiguous. An outline often needs wider path extents than a filled glyph of the same nominal size.
5. Keep strokes inside the viewBox and verify diagonals, symmetry, half-pixel placement, clipping, and blur at the actual rendered size and device scale. Prefer expanding path geometry over arbitrarily increasing stroke weight.
6. Mark decorative SVGs inside labelled controls with `aria-hidden="true"` and `focusable="false"`. An icon-only button owns its accessible name and tooltip; the SVG must not become a second focus target.
7. Verify expanded and compact surfaces, default/hover/active/disabled states, desktop and narrow layouts, and supported themes. The icon must not resize its control, overflow, clip, or look materially lighter or heavier than neighboring DSH icons.

## Stable Data

- `protocolVersion` is currently `1`.
- `appId`, `templateId`, and `creatorId` are public durable identifiers. Namespace them with the package name and do not change their meaning after release.
- `WorkbenchConfig` must be a plain, acyclic JSON object. Functions, components, services, DOM nodes, class instances, sockets, and other live objects are rejected.
- App removal preserves instances as unavailable records. Re-registering the same `appId` restores them.

## Templates

An instance template creates a configured instance of an installed app:

```ts
ctx.effect(() => ctx.workbench.registerTemplate({
  templateId: '@example/my-workbench:blank',
  title: 'Blank workbench',
  kind: 'instance',
  appId: '@example/my-workbench',
  defaultConfig: { section: 'overview' },
}), 'my-workbench: template registration')
```

An Agent template is JSON metadata that names a creator capability:

```ts
ctx.effect(() => ctx.workbench.registerTemplate({
  templateId: '@example/dashboard-agent',
  title: 'Data dashboard',
  kind: 'agent',
  creatorId: '@example/workbench-agent-creator',
  brief: 'Create a DSH-consistent data dashboard workbench.',
}), 'dashboard: agent template')
```

The independent creator plugin supplies the runtime callback:

```ts
ctx.effect(() => ctx.workbench.registerCreator({
  creatorId: '@example/workbench-agent-creator',
  start(template) {
    // Turn template.brief into an auditable Session/Agent request.
  },
}), 'workbench-agent-creator: registration')
```

An Agent template is unavailable while its creator is absent. The creator must use a formal Host/Client protocol and record the request, result, and errors in the Session log.

## Hot-swap Responsibilities

The base guarantees that contributions leave the registry when disposed, persisted instances and routes survive temporary application absence, the active unavailable app shows a placeholder instead of redirecting during HMR, and the same ID restores the instance when it returns.

The application still owns cleanup of its styles, subscriptions, timers, observers, workers, sockets, processes, and asynchronous work. Use `ctx.effect()` or React effect cleanup, abort asynchronous work, and prevent responses from an old activation from updating a new one. DSH Client HMR replaces the complete Client plugin fiber and does not preserve React local state.

## Minimum Acceptance

1. Mounting publishes the app and its templates.
2. Create, open, rename, and config updates work.
3. Disposing removes contributions while preserving unavailable instances.
4. Re-registering the same IDs produces one contribution and restores the instance.
5. No styles, listeners, observers, timers, or asynchronous writes remain after disposal.
6. Conversation presence matches the declared presentation.
7. The assembled DSH GUI has no console errors or narrow-width overflow.
