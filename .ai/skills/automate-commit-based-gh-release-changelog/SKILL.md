---
name: automate-commit-based-gh-release-changelog
description: Automate GitHub release creation and changelog generation from Conventional Commits using changelogithub — includes GitHub release mechanics, tag-based triggers, required permissions, and fetch-depth gotcha. Use when setting up GitHub releases, generating changelogs from commits, using changelogithub, or configuring v* tag triggers and contents:write permissions.
disable-model-invocation: true
---

# Automate Commit-Based GitHub Release Changelog

Uses [`changelogithub`](https://github.com/antfu/changelogithub) to read Conventional Commits between tags and create (or update) a GitHub release with a formatted changelog.

## Workflow setup

### Trigger and permissions

```yaml
on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write   # required — default contents:read cannot create releases
```

### Changelog step

Run changelogithub as the **last step** — after `npm publish` (if any) — so a failed publish doesn't create a dangling GitHub release:

```yaml
- uses: actions/checkout@v6
  with:
    fetch-depth: 0  # full tag history required; shallow clone produces empty changelog

- name: Generate changelog
  run: npx changelogithub
  env:
    GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

## Conventional Commits

changelogithub groups entries by type and surfaces breaking changes at the top:

| Commit prefix | Changelog section |
|---|---|
| `feat:` | Features |
| `fix:` | Bug Fixes |
| `chore:` | Chores |
| `feat!:` / `chore!:` | Breaking Changes (top) |

Commits that don't follow the convention are omitted from the changelog.

## Preview before pushing a tag

```bash
npx changelogithub --dry
```

## Reference

- For a complete end-to-end workflow combining npm publish + changelog generation, see `automate-npm-release/EXAMPLE_WORKFLOW.yml` if that skill is installed locally.
