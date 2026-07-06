# Single-Package npm Release

Use this when the repository has one public npm package and one release tag should publish that package.

## Manual first publish

npm requires the first publish to establish package name and ownership:

```bash
npm publish --access public
```

If the package is scoped and public, keep `--access public` or add:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

## Version bump with bumpp

Add a release script:

```json
{
  "scripts": {
    "release": "bumpp"
  }
}
```

Run the release script, choose the version increment, and let `bumpp` commit, tag, and push:

```bash
pnpm release
```

The default tag shape is usually `v%s`, such as `v1.2.3`.

## GitHub Actions

The workflow should trigger on `v*` tags:

```yaml
on:
  push:
    tags:
      - 'v*'
```

Use:

```yaml
permissions:
  contents: write
  id-token: write
```

`contents: write` is needed when the workflow creates GitHub releases. `id-token: write` is needed for npm provenance or trusted publishing.

See [EXAMPLE_WORKFLOW.yml](EXAMPLE_WORKFLOW.yml) for a complete example.
