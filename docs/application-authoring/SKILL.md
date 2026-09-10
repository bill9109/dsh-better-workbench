---
name: dsh-better-workbench-application-authoring
description: "Build and review activation-owned Workbench applications with versioned configuration, async persistence, templates and presentation."
whenToUse: "Register a Workbench application or creator, migrate configuration, or verify disposal and storage conflicts."
---

# Workbench Application Authoring

Read the complete [English reference](../application-authoring.md) or [Chinese reference](../application-authoring.zh.md) before writing code. The references include a complete compiled TSX Client module. Inspect the current package.json, src/client/types.ts, src/client/service.ts and src/client/storage.ts; source contracts override older examples.

## Required Contract

1. Use the single current protocol, `protocolVersion: 1`. Do not add protocol v2 or a synchronous legacy-API adapter.
2. Declare `inject = ['workbench']` and use `WorkbenchClientContext`. Register inside `ctx.effect(() => workbench.registerApp(definition))`; own template/creator disposers the same way. Registration is synchronous; loaded-state initialization awaits `workbench.ready` and handles failure/retry.
3. Require `config.version`, fresh `config.defaults()` and synchronous throwing `config.validate(config)`. Supply `migrate(config, fromVersion, { signal })` when upgrading stored config; it may be async. Validation does not normalize by mutation. Config and patches are plain acyclic JSON, never live objects or credentials.
4. Namespace app/template/creator IDs. Ordinary instances receive UUIDs; explicit default IDs and imported IDs remain valid. Optional `source` is self-reported publisher metadata, not authenticated ownership.
5. Declare only implemented presentation kinds, once each, and select a declared default. Page requires `renderMain`, panel requires `renderPanel`, capsule requires `renderCapsule`. Capsule placement is only `floating`. Optional `renderIcon?: ComponentType<WorkbenchIconProps>` is runtime-only and accepts `size?` and `className?`; keep it out of serializable snapshots and follow DSH 16px currentColor outline conventions.
6. Await create/save/rename/delete/reorder/template creation. Handle errors and revision conflicts; do not treat queued work as committed. Renderer `updateConfig(patch, expectedRevision?)` returns the committed revision. Preserve the draft editing revision across remote snapshots; the host also pins the baseline on first setDirty(true). A save does not clear dirty; only clear it if no newer edit occurred.
7. Use `setDirty` for editor drafts, clear only after save/discard, expose failures through `reportError`, and use provided navigation callbacks. Dirty state is not durable autosave or a guarantee that DSH/browser navigation can be cancelled.

## Boundaries

- Workbench owns instance metadata/config, not application business files. Applications own their own business data, Host APIs and resource cleanup. Do not create competing Workbench instance storage or a global page React root.
- IndexedDB commits the complete state through readwrite transactions. Revision checks occur inside synchronous transaction callbacks. Async migrations recheck revision and generation before atomically committing a pre-migration backup plus new config. `exportInstance(id)` and the Surface JSON download export the instance plus backups. `restoreBackup(id, backupRevision, expectedRevision)` is API-only: require the active app's exact configVersion, validation, current revision CAS and generation; back up current config in the same transaction. No automatic downgrade, JSON import or restore UI.
- Shared instance data is origin-local; routes are per-tab sessionStorage. Initial legacy localStorage import retains source keys. This data import does not preserve the old application API.
- Every activation gets a generation; old async results must not write after unload/re-registration. App removal preserves unavailable instances. Migration receives an AbortSignal; app/creator disposers return promises and base disposal waits for started tasks. The default five-second timeout logs and rejects, not successful cleanup. Return disposers to Cordis and implement cooperative cancellation. React local state does not survive Client fiber replacement.
- Creator `start(template, { signal, requestId })` returns `Promise<{ instanceId } | { sessionId }>`. Use only real inspected Session/Host APIs and record model-visible work in an auditable Session flow. AbortSignal cancellation cannot guarantee remote termination or rollback of committed work.
- The DOM adapter is an implementation compatibility layer, not a public DSH navigation API. It preserves the Conversation React tree, mounts sidebar/center independently and restores owned styles/roots on unload. Do not add app DOM selectors.
- Effective panel layout is container-dependent: right `min(360, width)`, bottom `min(280, height * .55)`; right push becomes overlay below width 720, bottom push below height 560. Use effective presentation and the shared `--workbench-panel-size`.
- Navigation observes optional `sessions.list` selection and narrow bubbling leaf-row clicks. It ignores nested controls and does not infer New Session intent when the same blank session is reused. Document this limit rather than inventing a service/event.

## Acceptance

Test valid/invalid config, async CRUD and errors, migration success/failure/newer version, cross-tab revision conflict, initialization failure/retry, unload/re-registration, stale-generation writes, Creator cancellation and narrow container layouts. Verify actual DSH menu behavior, conversation visibility and unload restoration separately from unit tests. Own listeners, observers, timers, sockets and processes with Cordis effects or component cleanup; reuse DSH icons/tokens and verify accessible, stable controls.

Use the repository build helper, not a DSH checkout or `DSH_CHECKOUT`. Build tooling supports Node `^22.18.0 || >=24.11.0`; source tests need Node 22.18+ and dependency-compatible engines. Use isolated `--verify` / `--check` or non-writing `--dry-run` when live artifacts must remain untouched. Before publishing committed artifacts, explicitly build both base and design-board. HMR requires the matching Client watcher; manifest/dependency changes require refresh or restart after building.

Report exact contracts, changed files, tests/builds actually run, lifecycle ownership, any GUI/HMR checks not performed, and remaining limitations.
