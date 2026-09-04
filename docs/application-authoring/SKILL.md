---
name: dsh-workbench-application-authoring
description: "Create, migrate, or review a DSH Workbench application registered with dsh-workbench, including page/panel/capsule presentation, instances and templates, Agent Creator, Cordis disposal, persistence fallback, Client HMR, and assembled GUI verification."
whenToUse: "Use when a developer needs to register a DSH Client plugin with dsh-workbench, add a Workbench template, connect an Agent Creator, migrate an older Workbench application, or review its hot-swap lifecycle."
---

# Workbench Application Authoring

Use this Skill when building a third-party DSH Client plugin that contributes to `dsh-workbench`. The base owns the Workbench home, application/template/creator registries, instances, navigation, presentation hosts, and unavailable-state recovery. The application owns its runtime UI and its own asynchronous resources.

## Read First

Read the complete bilingual references before changing code:

- [Chinese reference](../application-authoring.zh.md)
- [English reference](../application-authoring.md)
- `dsh-cordis-plugin-authoring` for general DSH/Cordis plugin rules

Inspect the current `dsh-workbench` `package.json`, `src/client/types.ts`, and `src/client/service.ts`. Confirm the target DSH version, active bundle, `dsh.client.inject`, and running 3080 GUI. Query native DSH Slot and Service contracts before using them.

## Required Application Form

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

`workbench` is a hard dependency. Every `registerApp`, `registerTemplate`, `registerCreator`, `subscribe`, event listener, timer, observer, worker, socket, and process must be owned by `ctx.effect()`, `ctx.on()`, or component cleanup. Never rely on patch order, `setTimeout`, module-level state, or an untracked disposer.

## Presentation Rules

- `page` uses `conversation: 'exclusive'` and `renderMain`; it is the full Workbench page.
- `panel` uses `conversation: 'resident'` and `renderPanel`; it is a right or bottom panel with `push` or `overlay` behavior.
- `capsule` uses `conversation: 'resident'` and `renderCapsule`; it is a lightweight conversation-adjacent surface.
- Declare only modes the application can render. The default must be one of the declared modes.
- Application components receive `WorkbenchRenderProps`; they do not read Cordis `ctx`, change `#root`, query Conversation DOM, create another page root, or implement their own route.

DSH 0.1.x currently lacks a formal center-page Slot. The current `page` adapter suppresses Conversation interaction but does not unmount its React tree. Do not describe this compatibility behavior as true unmounting. The application protocol remains valid when a future Shell outlet replaces the adapter.

## SVG Icon Construction

1. Inspect the current `@deepseek-ai/dsh-client-ui-primitives` icon exports and neighboring DSH components first. Reuse a semantically matching icon; hand-author an SVG only when the required glyph is absent, and do not add another icon system for one simple glyph.
2. Use `currentColor` so semantic container tokens own default, hover, active, and disabled colors. Do not hardcode product colors inside the SVG.
3. Match an established DSH construction. Compact Figma glyphs commonly use a `16 16` or `14 14` viewBox with `fill="currentColor"`. Hand-authored outlines commonly use `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.3"` to `strokeWidth="1.5"`, and round line caps and joins.
4. Calibrate optical ink, not only the CSS box. `width`, `height`, and `viewBox` do not describe visible pixel occupancy. Compare path `getBBox()`, stroke expansion, rendered dimensions, and screenshots against adjacent icons; rasterize the SVG and inspect alpha-pixel bounds when the difference is ambiguous. An outline often needs wider path extents than a filled glyph of the same nominal size.
5. Keep strokes inside the viewBox and verify diagonals, symmetry, half-pixel placement, clipping, and blur at the actual rendered size and device scale. Prefer expanding path geometry over arbitrarily increasing stroke weight.
6. Mark decorative SVGs inside labelled controls with `aria-hidden="true"` and `focusable="false"`. An icon-only button owns its accessible name and tooltip; the SVG must not become a second focus target.
7. Verify expanded and compact surfaces, default/hover/active/disabled states, desktop and narrow layouts, and supported themes. The icon must not resize its control, overflow, clip, or look materially lighter or heavier than neighboring DSH icons.

## Durable Data And Templates

Persist only stable IDs, routes, and plain acyclic JSON configuration. Never persist components, React nodes, functions, services, contexts, DOM nodes, class instances, sockets, or processes.

Use `kind: 'instance'` templates for configured instances of installed apps. Use `kind: 'agent'` with a stable `creatorId` for templates handled by an Agent Creator. Creator code must submit model-visible input through a formal auditable Session/Agent path and record the request, result, and errors in the Session log.

When an application is removed, keep its instances as unavailable records. When the same `appId` returns, restore the existing records. Unknown records must not prevent startup.

## Hot-swap Acceptance

The base must remove contributions on disposal, retain instances and routes during temporary absence, show an unavailable placeholder without redirecting during HMR, and restore the same instance after re-registration. The application must cancel or close its own asynchronous resources, prevent stale responses from writing after activation disposal, and accept that Client HMR replaces the whole fiber and does not preserve React local state.

Verify at minimum:

1. Mounting publishes the app and templates.
2. Creating, opening, renaming, and updating JSON configuration works.
3. Disposing removes contributions while preserving unavailable instances.
4. Re-registering the same IDs leaves one contribution and restores the instance.
5. Styles, listeners, observers, timers, workers, sockets, processes, and stale async writes are gone after disposal.
6. Conversation presence matches the declared presentation.
7. The real 3080 GUI has no console errors or narrow-width overflow.

## Reporting

Report the files changed, Cordis extension points used, disposal and async teardown strategy, commands and real GUI checks run, Client HMR coverage, changes that still require refresh or Host reload, and remaining risks.
