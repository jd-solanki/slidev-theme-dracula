---
name: automate-npm-release
description: Automate npm package publishing via GitHub Actions for single-package repos and independent monorepo packages, including bumpp version tags, GitHub release notes, trusted publishing, provenance, and package-scoped release tags. Use when setting up or modifying npm publish workflows, npm release pipelines, version bumping, package-scoped monorepo releases, changelogithub release notes, trusted publishing, provenance badges, NPM_TOKEN, or OIDC publishing.
disable-model-invocation: true
---

# Automate npm Release

Use this skill to set up npm release automation. First identify the repository shape, then load the matching reference:

- Single publishable package: see [SINGLE_PACKAGE.md](SINGLE_PACKAGE.md).
- Workspace monorepo with independently published packages: see [MONOREPO.md](MONOREPO.md).

## Shared rules

- npm requires the first publish to be done manually for each public package:

```bash
npm publish --access public
```

- Prefer npm trusted publishing/OIDC when the project asks for it. Configure the package on npmjs.com after the first manual publish, then use `id-token: write` in GitHub Actions. Ensure `package.json` has `repository.url` exactly matching the GitHub repo URL (case-sensitive) — required for provenance validation.
- If using token-based publishing, configure `actions/setup-node` with `registry-url: https://registry.npmjs.org` so `NODE_AUTH_TOKEN` can authenticate `npm publish`.
- In pnpm workspaces, publish via `pnpm pack` followed by `npm publish <tarball> --access public`. This lets pnpm rewrite `workspace:*` dependencies while npm handles trusted publishing/OIDC. Use changelogithub only for GitHub release notes/releases.
- Always run checks, tests, and package builds before publishing.
- Keep the private workspace root unpublished; publish from the actual package directory.

## Quick choice

Use single-package release automation when one `package.json` owns the npm artifact and one `v*` tag maps to one package.

Use monorepo release automation when multiple workspace packages publish independently. In that flow, tags must encode the package, such as `cli-v0.1.0`, and GitHub release-note generation must use explicit previous same-package tag ranges.

## Workflow examples

- [EXAMPLE_WORKFLOW.yml](EXAMPLE_WORKFLOW.yml) — single-package token/provenance workflow.
- [MONOREPO_WORKFLOW.yml](MONOREPO_WORKFLOW.yml) — package-scoped monorepo workflow using trusted publishing and changelogithub.
