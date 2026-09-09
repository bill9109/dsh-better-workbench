# Changelog

All notable user-facing changes to dsh-better-workbench and its bundled examples are documented in this file. The project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses semantic version tags.

## [Unreleased]

### Changed

- Redesign the single `protocolVersion: 1` application contract without a parallel protocol or legacy synchronous API: mandatory config version/defaults/validation, optional async migration, and async instance mutations.
- Store full repository state atomically in IndexedDB, with revision compare-and-swap, migration backups, generation checks and cross-tab invalidation. Keep routes and presentation preferences in per-tab sessionStorage; retain original localStorage keys during initial legacy-data import.
- Allocate UUIDs for ordinary instances while preserving explicit default IDs and imported IDs. Treat source package/version/repository as self-reported metadata, not authenticated identity.
- Share effective, container-bounded panel geometry between Surface and conversation insets; downgrade push to overlay on small containers. Support floating capsules only.
- Use independent repository-local builds and a public `dsh-better-workbench/build/client-bundle` helper. Add a standalone starter distinct from the design-board reference. Build tooling requires Node ^22.18 or >=24.11; published runtime compatibility remains separate.

### Added

- Loading/error/retry and instance readiness states, dirty-state navigation confirmation, asynchronous creator status and cooperative AbortSignal cancellation.
- JSON instance/config-backup export and a validated, revision-checked `restoreBackup` service API that backs up the current configuration before replacement.
- Source-based storage/service/DOM/UI tests, isolated build verification, standalone-layout build coverage, and bilingual current-contract authoring examples.

### Fixed

- Isolate DOM mounting/unmounting, restore original styles and React roots, avoid self-generated observer rescans, and retry sidebar/center independently. Failed mounts do not hide Conversation.
- Ignore nested session menus/controls in the bubbling navigation fallback and remove localized-label matching; observe only the verified optional sessions list contract.

### Limitations And Release Work

- Conversation remains mounted behind exclusive pages. The DOM adapter depends on DSH slot topology; New Session reusing the selected blank session may not close Workbench.
- Configuration backups are not business-file hosting. Backup restoration is API-only, requires a matching active config version, and does not automatically downgrade schemas. There is no JSON import or restore UI.
- Creator cancellation does not guarantee remote Agent termination or rollback of committed work. Source metadata is not permission or authenticated provenance.
- Standalone-layout checks do not establish fresh registry-install readiness. Publish the redesigned helper/contracts before using the starter against registry dependencies.
- Rebuild and commit base and design-board artifacts with `pnpm run build` and `pnpm run build:example` before release. Temporary verification does not update installed GUI artifacts.

## [0.2.0] - 2026-09-04

### Added

- Always-available Workbench home with application, instance, template, and Agent Creator registries.
- Explicit `conversation`, `workbench-home`, and `workbench-instance` routes.
- `page`, `panel`, and `capsule` presentation contracts with explicit Conversation coexistence.
- Versioned JSON persistence, v1 migration, unavailable-instance recovery, ordering, renaming, and configuration updates.
- Cordis fiber-owned registration and disposal for applications, templates, creators, styles, and UI integration.
- Responsive Workbench instance and creation-card grids based on DSH Agent-preset card semantics.
- `docs/application-authoring/SKILL.md` plus complete English and Chinese application-authoring references.
- `examples/design-board`, the first protocol-compliant reference application, with the fixed `总览 → 基础资源 → 规范 → 产品页面` information architecture and specimens derived from current DSH source.

### Known limitations

- DSH 0.1.x does not expose a formal center-page Slot. The current page adapter covers the center and suppresses Conversation interaction, but it does not unmount the Conversation React tree.
