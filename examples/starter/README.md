# Workbench Starter

This directory is an independent package template, unlike the repository's design-board example. It does not import parent-directory build scripts or use workspace/file dependencies.

Prerequisites: Node ^22.18 or >=24.11 for the build tools; an installed DSH Web runtime with the closure-factory module loader; a dsh-better-workbench release that exports `dsh-better-workbench/build/client-bundle` and the versioned application/config contract. These changes must be published before a clean registry install can use this template.

After copying this directory outside the repository, run `npm install`, `npm run check`, and `npm run build`. Use `npm run build:verify` to compile into a temporary directory without overwriting lib. No server or DSH checkout is needed to build. Inside this monorepo, development uses the root workspace's workbench package; registry dependencies remain normal semver ranges when the directory is copied.

Rename the package, appId, source metadata, and cordis patch row before distribution. Remove `private: true` only when ready to publish. Mount the workbench host and this app through the host composition using your deployment's supported bundle installation flow. The app registers through the injected workbench service; no host/preset configuration is changed by the build.

The published build adapter emits a single deferred `window.__ModuleLoader__.load({ id, factory })` client script. Shared React and DSH modules resolve through the loader's exact module table. It intentionally rejects CSS imports and undeclared DSH value imports; styles in this minimal template are component-owned. Runtime peers are not bundled copies.
