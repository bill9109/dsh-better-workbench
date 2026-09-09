# Contributing to dsh-better-workbench

Focused fixes, tests, documentation changes, and protocol-compatible Workbench improvements are welcome. By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

1. Read [README.md](README.md) for installation, usage, lifecycle, and troubleshooting.
2. Read [docs/application-authoring/SKILL.md](docs/application-authoring/SKILL.md) before changing the application protocol or the reference application.
3. Search existing [issues](https://github.com/omdsh-dev/dsh-better-workbench/issues) and pull requests before opening duplicate work.
4. Open an issue before changing persistence, routes, presentation semantics, application identity, or bundle manifests.
5. Keep each change narrowly scoped; do not mix behavior changes with unrelated refactoring or generated-output churn.

## Architecture and scope

`dsh-better-workbench` is an out-of-tree DSH Web bundle. Contributions must preserve these responsibilities:

- The base owns the Workbench Client Service, registries, durable instances, routes, sidebar integration, home, and presentation hosts.
- Applications own their components, styles, observers, timers, workers, sockets, processes, and asynchronous teardown.
- Stable IDs, routes, order, titles, and plain acyclic JSON configuration are the only persisted values.
- Removing an application keeps its instances as unavailable records; registering the same `appId` restores them.
- Every application, template, creator, style, listener, and subscription must be owned by the current Cordis fiber and return a disposer.
- A `page`, `panel`, or `capsule` definition must use its named presentation semantics instead of locally changing Conversation behavior.

## Development

```sh
pnpm install
DSH_CHECKOUT=/path/to/dsh pnpm run build
pnpm run check
pnpm test
DSH_CHECKOUT=/path/to/dsh pnpm run build:example
pnpm run check:example
```

The committed `lib/` files are release artifacts. Rebuild both packages when their source changes and review the generated diff.

Keep the bilingual root README synchronized. Edit both `README.md` and `README.zh.md`, then run:

```sh
node scripts/verify-i18n.mjs --write
```

## Verification

A user-visible change should be checked in the real DSH Web UI at desktop and narrow widths. Verify navigation, creation, instance restoration, presentation coexistence, browser console output, and disposal/reactivation for the affected contribution.

## Commit and release

- Bump the relevant package version and update `CHANGELOG.md` in the same change that ships a user-visible difference.
- Tag releases with a semantic version such as `v0.2.0`.
- Keep the root package and `examples/design-board` versions compatible with their declared peer dependency.
