---
name: dsh-workbench-application-authoring
description: "Build or review a DSH Workbench application with versioned configuration, async persistence, presentation and activation-owned resources."
whenToUse: "Register a Workbench app, template or creator; migrate configuration; verify disposal and persistence."
---

# Workbench Application Authoring

This is the current, unreleased application contract. There is one protocol, `protocolVersion: 1`; this redesign does not introduce protocol v2 or retain the previous synchronous API. Read [types.ts](../src/client/types.ts), [service.ts](../src/client/service.ts), [storage.ts](../src/client/storage.ts), and the installed package manifest before integrating.

## Ownership

The base owns application/template/creator registries, instance metadata, navigation, configuration persistence and presentation hosts. Applications own their components, business files, external data, subscriptions and asynchronous resources. Do not create another Workbench instance database, global React root or competing page router. Keep business documents in your application's own storage or Host service; a file path in config does not make Workbench manage, back up or delete that file.

Declare `inject = ['workbench']` and use `WorkbenchClientContext`. Register synchronously inside `apply`, returning each disposer through `ctx.effect()`; registration need not await storage readiness. Await `workbench.ready` before imperative initialization that needs loaded instances. Handle rejection and offer `retry()`; never replace durable storage with silent in-memory success.

## Complete Client Example

Put this compiled Client module in `src/client/index.tsx`. The UI intentionally commits a small JSON change directly; a draft editor additionally needs the dirty-state rules below.

```tsx
import { useState } from 'react'
import type { WorkbenchClientContext, WorkbenchRenderProps } from 'dsh-workbench/client'

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

The package must declare DSH Client metadata, build a Client closure bundle, and be installed alongside the base in the Web profile. Use [examples/starter](../examples/starter) for a standalone package using the public `dsh-workbench/build/client-bundle` helper. It has been tested in a copied standalone layout, not through a fresh registry install; clean registry use requires publishing this redesign and helper first. The [design-board package](../examples/design-board/package.json) is a repository-local reference, not the standalone starter. Type-only imports from `dsh-workbench/client` do not create a runtime import requirement. Do not paste TSX into an untransformed dynamic-plugin body.

## Identity And Configuration

- Namespace stable `appId`, `templateId`, and `creatorId`. Duplicate live registrations are errors. `source?: { packageName, version, repository? }` is publisher-supplied metadata, not authenticated ownership or permission.
- Ordinary `createInstance` allocates `crypto.randomUUID()`. Treat the result as opaque, not as an app ID prefix. An explicit `defaultInstance.instanceId` remains supported, and legacy imports retain their IDs. An omitted default ID uses a UUID. By default `allowMultiple` is false and creation reuses an existing instance.
- Every application requires `config: { version, defaults, validate, migrate? }`. `version` is a positive safe integer; `defaults()` returns a fresh JSON object; synchronous `validate(config): void` throws on invalid data. Validation is not a normalizer: mutations of its argument are not saved.
- Config must be plain, acyclic JSON with finite numbers. No functions, contexts, services, DOM nodes, class instances, undefined values, sockets or credentials. Updates shallow-merge a patch; nested objects must be supplied in their complete desired form.
- `migrate(config, fromVersion, { signal })` may return a config or a Promise. It must produce the current schema, then pass validation. Do not mutate business files or perform irreversible operations inside a config migration.

For an upgrade to config version 2, replace the config contract with a matching validator/defaults and a migration such as:

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

Older configs without a migration remain in `migration-error`; newer-than-supported configs are `incompatible`. An unavailable app preserves its instance. The host prepares/validates instances before rendering their app; use `status`, not just `available`, to determine readiness. `prepareInstance()` can finish with an error status, so inspect the resulting snapshot.

## Persistence And Conflicts

IndexedDB stores one complete repository-state record, including instances, dismissed defaults and pre-migration config backups. A readwrite transaction reads the latest state, checks revisions inside the synchronous update callback, and commits atomically. Async migration runs outside that transaction; activation generation and revision are checked again before committing the backup and migrated config together. A failed validation, conflict or aborted transaction does not replace the original config. `exportInstance(id)` returns `Promise<WorkbenchInstanceExport>` containing a JSON instance and its config backups; the Surface exposes JSON download. `restoreBackup(id, backupRevision, expectedRevision)` is an API-only operation: the backup configVersion must equal the active application's config version, validation must pass, and the current revision must match. It atomically backs up the current config before replacing it. There is no automatic downgrade, JSON import or backup-restore UI.

Same-origin tabs share instance data; notifications invalidate caches and cause fresh reads. Config writes use revision compare-and-swap, not blind overwrite or automatic merge. `updateConfig(patch, expectedRevision?)` returns the committed revision. Drafts retain their original editing revision across remote snapshots. Without an explicit revision, the host uses the baseline captured by the first setDirty(true), otherwise the rendered revision. Advance the draft baseline using the successful result, not a later remote snapshot. After a conflict, reload/reconcile the latest snapshot before retrying; do not repeatedly overwrite with stale state. Rename/delete also check the revision; ordering is an atomic list update. A successful save means the transaction completed, not merely that an optimistic UI changed.

The current tab's route uses `sessionStorage` key `dsh-workbench.navigation.v1`, separate from shared instances. Per-instance presentation preferences use `dsh-workbench.presentations.v1`; `open(id)` reuses a still-supported remembered kind before falling back to the app default. Initial repository creation imports recognized records from `dsh-workbench.state.v3`, `dsh-workbench.state.v2`, or `dsh-workbench.instances.v1`; original localStorage keys remain, with source strings/import markers recorded in IndexedDB. This is data import, not support for older application APIs. Browser storage is origin-local and may be cleared or unavailable; it is not a hosted backup service.

## Service And Renderer Contract

| Operation | Result |
| --- | --- |
| `registerApp / registerCreator` | Registration is synchronous; disposer returns `Promise<void>` |
| `registerTemplate` | Synchronous disposer |
| `updateInstanceConfig` | `Promise<number>` committed revision |
| `ready`, `retry()`, `prepareInstance(id)` | `Promise<void>` |
| `createInstance(appId, title?, config?)` | `Promise<WorkbenchInstance>` |
| `startCreation(templateId)` | `Promise<{ instanceId } \| { sessionId }>` |
| `renameInstance / deleteInstance / reorderInstances` | `Promise<void>` |
| `open / openHome / openConversation / close` | Synchronous navigation; dirty confirmation may decline it |
| `getSnapshot / subscribe` | Snapshot / subscription disposer |

`createInstance` and `startCreation` return results; imperative callers explicitly open an instance with `open(result.instanceId)`. The built-in creation UI performs its own navigation. Do not dispose the shared service from an application; the base owns it.

Renderers receive `instance`, the effective `presentation`, `updateConfig(patch, expectedRevision?): Promise<number>`, `setDirty(boolean)`, `reportError(string | null)`, `setPresentation(kind)`, `close`, `openHome`, and `openConversation`. Mark drafts dirty on edits, clear them only after a successful save or explicit discard, and show asynchronous errors. Dirty state is runtime-only; Workbench does not autosave component state. Navigation confirmation covers Workbench routes, not guaranteed cancellation of DSH navigation or browser unload.

Every registration gets a new generation. Unload removes runtime contributions and invalidates stale-generation work while preserving durable instances. Re-registering the same app restores availability after validation/migration. React local state is not retained across Client fiber replacement; cancel component requests on cleanup and reject stale responses before external writes.

A committed save never clears dirty state automatically. Clear it only if the saved edit generation is still current, or after explicit discard. Edits made while a save is pending must remain dirty.

Async migration receives `{ signal }`. App removal and base disposal abort and await started migration/Creator tasks. The default five-second deadline logs and rejects teardown if work has not settled; timeout is not successful cleanup. JavaScript that ignores cancellation cannot be forcibly terminated. Return registration disposers to Cordis, and settle external resources cooperatively.

Malformed legacy JSON and invalid records are quarantined while valid instances import normally. Original strings remain in recovery and a separate legacy-backup. Home displays diagnostics and a raw backup download; it never silently falls back to an older key or deletes original data. Repair-and-reimport UI is not yet provided.

## Presentations And DOM Limits

| Kind | Declaration | Renderer |
| --- | --- | --- |
| `page` | `conversation: 'exclusive'` | `renderMain`; optional `renderSecondary` |
| `panel` | `placement: 'right' \| 'bottom'`, `behavior: 'push' \| 'overlay'`, `conversation: 'resident'` | `renderPanel` |
| `capsule` | `placement: 'floating'`, `conversation: 'resident'` | `renderCapsule` |

Declare each kind at most once and choose a declared default. Conversation-inline capsules are not implemented. `resolvePresentationLayout(presentation, width, height)` returns `{ presentation, panelSize, rightInset, bottomInset }`. Right panels use `min(360, width)`; bottom panels use `min(280, height * .55)`. Right push falls back to overlay below width 720; bottom push falls back below height 560. The host and adapter share `--workbench-panel-size`; applications receive the effective behavior, not necessarily the requested push mode.

The base retains a DOM compatibility adapter for `sidebar.workspaces` and `conversation`, without DSH source modifications. Page presentation hides conversation content and interaction after a successful mount; it does not unmount DSH's React tree. Sidebar/center mount independently and retry; unload restores owned styles and roots. Do not build app-specific DOM selectors on top of it.

Navigation reads the verified optional `sessions.list.getSnapshot().current` / `subscribe` contract and uses a narrow bubbling leaf-session-row click fallback. Nested menus/buttons, prevented clicks and modifier clicks do not close Workbench. This is not a general DSH navigation-intent API: selecting a different session is observed, but New Session that reuses the already selected blank session may not close Workbench. Without the sessions service only the DOM fallback applies. DOM topology changes in a future DSH build may require adapter updates.

## Templates And Agent Creators

Instance templates are JSON metadata for an installed app; `defaultConfig`, when supplied, must satisfy its validator. Agent templates name a separate creator. The creator signature is:

```ts
start(template, context: { signal: AbortSignal; requestId: string }):
  Promise<{ instanceId: string } | { sessionId: string }>
```

Register it with `ctx.effect(() => workbench.registerCreator(definition))`. Connect it only to real, inspected Host/Session APIs; Workbench does not create an Agent automatically. Model-visible requests/results/errors belong in an auditable Session flow. Return an existing committed Workbench instance ID or the actual Session ID. `cancelCreation()` aborts the signal and ignores stale results; it cannot guarantee that a remote Host/Agent stopped or that already committed work was rolled back. The creator must implement cooperative cancellation and dispose its own resources.

## Build And Acceptance

The repository-local build helper does not require a DSH checkout or `DSH_CHECKOUT`. Build tooling follows `^22.18.0 || >=24.11.0` Node support; source tests require Node 22.18+ TypeScript stripping, with installed dependencies' engine requirements also respected. The published runtime engine range in package.json is a separate constraint.

Run `pnpm run check`, `pnpm test`, `pnpm run build:verify`, `pnpm --dir examples/design-board run build:verify`, and `pnpm run verify:i18n` as applicable. The build script accepts `--dry-run` (no writes), `--check` (temporary declarations), and `--verify` (temporary full build); ordinary `pnpm run build` writes `lib`. Before publishing or updating committed artifacts, explicitly build both the base and example with `pnpm run build` and `pnpm run build:example`.

Test create/save/reload, invalid config, migration success/failure/newer schema, revision conflict, failed initialization/retry, removal/re-registration, stale generation, creator cancellation and actual narrow container geometry. Verify the assembled DSH GUI, menu behavior and unload restoration separately; passing source tests or an isolated build does not verify a running GUI. Existing Client HMR requires the matching watcher; manifest/dependency changes require rebuilding plus refresh or restart.

Reuse installed DSH primitive icons and semantic color tokens. Keep icon controls labelled, keyboard-focusable and dimensionally stable; verify optical weight, clipping and narrow layouts against adjacent DSH controls.
