---
name: node-cli
description: Patterns and conventions for building Node.js CLI tools — src structure, entry point setup, Commander wiring, and update notifications. Use when creating or modifying a Node.js CLI, adding Commander commands, wiring update-notifier, or asking how to structure a CLI entry point or src directory.
disable-model-invocation: true
---

# Node CLI

## src structure

```
src/
├── index.ts              # Entry point — wires Commander, calls updateNotifier
├── update-notifier.d.ts  # Type shim for update-notifier package
├── commands/             # One file per CLI command
│   ├── add.ts
│   └── remove.ts
├── lib/                  # Pure domain logic, no Commander concerns
│   ├── github.ts         # single-file feature → stays flat
│   ├── linker.ts
│   └── push/             # 2+ files → grouped into a feature folder, prefix dropped
│       ├── index.ts      # barrel: re-exports the feature's public surface
│       ├── workflow.ts
│       └── validation.ts
└── utils/                # Generic helpers — mix flat files and nested groups freely
    ├── format.ts         # flat single-purpose helper
    └── fs/               # related helpers grouped under one folder
        ├── read.ts
        └── write.ts
tests/                    # Mirrors src/ structure, one test file per module
├── add.test.ts
└── linker.test.ts
```

**conventions:**
- `commands/` — each file exports a single `Command` instance; all CLI concerns (prompts, flags, output) live here
- `lib/` — framework-agnostic helpers imported by commands; keep them testable in isolation
- Directories don't have to be flat. Keep a feature flat by default, and group it into a folder **only once it owns 2+ files** — a folder holding one file is just noise. When you group, the folder already names the feature, so drop the redundant prefix from filenames (`lib/push/workflow.ts`, not `lib/push/push-workflow.ts`), and use `dir/index.ts` as the feature's public surface (a barrel re-exporting what commands import, or, for a provider-style seam, the interface/contract itself). Commands import the folder, not its internals: `import { planPush } from '../lib/push/index.js'`, so each feature's internal file split can change without touching call sites.

## Entry point structure

```ts
#!/usr/bin/env node
import { Command } from 'commander'
import updateNotifier from 'update-notifier'
import packageJson from '../package.json' with { type: 'json' }

// Call before parseAsync — notify() defers display to process exit so it
// never interleaves with command output.
updateNotifier({ pkg: packageJson }).notify()

const program = new Command('your-cli')
  .description('...')
  .version(packageJson.version)

program.addCommand(fooCommand)

await program.parseAsync()
```

## Testing CLI wiring

Keep executable entrypoints and test seams distinct. If `src/index.ts` calls
`parseAsync()` at top level, treat it as executable-only: tests should import
command factories from `src/commands/*`, assemble a local `Command`, and pass a
controlled argv. Do not import a top-level executable entrypoint in tests,
because it will parse the test runner's `process.argv`.

```ts
// src/commands/run.ts
import { Command } from 'commander'

export interface RunDispatch {
  runBatch(): Promise<void> | void
}

export function createRunCommand(dispatch: RunDispatch): Command {
  return new Command('run').action(async () => {
    await dispatch.runBatch()
  })
}
```

```ts
// tests/cli.test.ts
import { Command } from 'commander'
import { describe, expect, test, vi } from 'vitest'
import { createRunCommand } from '../src/commands/run'

test('dispatches run', async () => {
  const dispatch = { runBatch: vi.fn() }
  const program = new Command('your-cli')
  program.addCommand(createRunCommand(dispatch))

  await program.parseAsync(['node', 'your-cli', 'run'])

  expect(dispatch.runBatch).toHaveBeenCalledOnce()
})
```

For larger CLIs, a second common pattern is a thin bin file that imports a
testable `run(argv)` or `execute(argv)` module. Use this when the CLI has
substantial startup behavior, needs integration-style tests around exit codes,
or also exposes a public library API.

## Update notifier

Use the [`update-notifier`](https://github.com/sindresorhus/update-notifier) package. It handles background checks (24 h interval), state persistence, CI/TTY/`NO_UPDATE_NOTIFIER` opt-outs automatically.

```bash
pnpm add update-notifier
```

**Where to call it:** top of `index.ts`, before `program.parseAsync()` — not in a `postAction` hook.

**Why before parse:** `notify()` defaults to `defer: true`, registering a `process.on('exit')` listener. Placing it before `parseAsync()` ensures the listener is always registered regardless of which command runs.

**Type shim** (package ships no `.d.ts`):

```ts
// src/update-notifier.d.ts
declare module 'update-notifier' {
  interface Package { name: string; version: string }
  interface Options { pkg: Package; updateCheckInterval?: number; distTag?: string }
  interface NotifyOptions { defer?: boolean; message?: string; isGlobal?: boolean }
  interface Notifier { notify(options?: NotifyOptions): void }
  export default function updateNotifier(options: Options): Notifier
}
```

## Recommended stack

| Concern | Package |
|---|---|
| CLI framework | [`commander`](https://github.com/tj/commander.js) |
| Interactive prompts | [`@inquirer/prompts`](https://github.com/SBoudrias/Inquirer.js) |
| Update notifications | [`update-notifier`](https://github.com/sindresorhus/update-notifier) |
| Language | TypeScript |
| Test runner | [`vitest`](https://vitest.dev) |
| Version bumping | [`bumpp`](https://github.com/antfu/bumpp) — bumps `package.json`, commits, tags, and pushes in one step |
| Bundler | [`tsdown`](https://github.com/rolldown/tsdown) |
| Diagnostics (structured errors/warnings) | [`nostics`](https://nostics.dev/) — define a catalog of diagnostic codes with stable names, messages, fixes, and docs URLs |

## package.json essentials

```json
{
  "type": "module",
  "bin": { "your-cli": "./dist/index.js" },
  "engines": { "node": "^24.0.0" }
}
```

## GitHub Workflow

For a complete end-to-end workflow combining npm publish + changelog generation, see `automate-npm-release/EXAMPLE_WORKFLOW.yml` if that skill is installed locally.