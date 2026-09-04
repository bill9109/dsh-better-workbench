# Changelog

All notable user-facing changes to dsh-workbench and its bundled examples are documented in this file. The project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses semantic version tags.

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
