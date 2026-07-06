# Monorepo npm Release

Use this for independent package releases in a workspace monorepo. Each package owns its version and release tag:

```text
packages/cli         -> @envolix/cli         -> cli-v0.1.0
packages/env-parser  -> @envolix/env-parser  -> env-parser-v0.1.0
```

## Manual first publish and trusted publishing

Publish each public package once from its package directory:

```bash
cd packages/<package>
npm publish --access public
```

Then configure npm trusted publishing separately for each package. Use GitHub Actions, the repository owner/name, the workflow filename such as `publish.yml`, and the workflow action `npm publish`.

The workflow needs:

```yaml
permissions:
  contents: write
  id-token: write
```

## Developer workflow

Write scoped Conventional Commits so changelogen can produce useful release notes:

```bash
git commit -m "feat(cli): add gen command"
git commit -m "fix(env-parser): parse empty quoted values"
```

Prefer root scripts for common patch releases:

```bash
nr release:cli
nr release:env-parser
```

Those scripts should wrap package-scoped `bumpp` commands:

```bash
cd packages/cli
bumpp patch --tag "cli-v%s" --commit "chore(cli): release v%s" --push

cd packages/env-parser
bumpp patch --tag "env-parser-v%s" --commit "chore(env-parser): release v%s" --push
```

Use `minor`, `major`, or an explicit version manually when appropriate. If multiple packages changed, release each package with its own bump and tag.

## Workflow rules

The publish workflow should:

1. Trigger on package-scoped tags, for example `cli-v*` and `env-parser-v*`.
2. Map the tag prefix to one package directory.
3. Find the previous tag with the same package prefix.
4. Validate that the tag suffix matches the selected package's `package.json` version.
5. Run checks, tests, and package builds before publishing.
6. Pack the selected package with pnpm, then publish the tarball with npm trusted publishing.
7. Create or update the GitHub release for the package tag with changelogithub using explicit `--from` and `--to`.

See [MONOREPO_WORKFLOW.yml](MONOREPO_WORKFLOW.yml) for a concrete GitHub Actions workflow.

## Critical caveat

Never rely on a release-note tool's default `from` tag in a monorepo. Defaults often resolve the latest git tag for the repository, not the latest tag for the package being released. If `cli-v0.2.0` is the latest repo tag and you are releasing `env-parser-v0.1.3`, the default range can be wrong.

Always derive the previous same-package tag and pass it explicitly to changelogithub:

```bash
npx changelogithub@latest \
  --from env-parser-v0.1.2 \
  --to env-parser-v0.1.3 \
  --github owner/repo \
  --name env-parser-v0.1.3
```

If there is no previous same-package tag, still pass an explicit base ref such as the initial commit or an intentional package introduction commit.

Publish the npm package by packing with pnpm and publishing the generated tarball with npm:

```bash
pack_output="$(pnpm --dir packages/env-parser pack --pack-destination "${RUNNER_TEMP:-/tmp}")"
tarball="$(printf '%s\n' "${pack_output}" | tail -n 1)"
npm publish "${tarball}" --access public
```

This keeps pnpm workspace dependency rewriting while still using npm for trusted publishing/OIDC.
