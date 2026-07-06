---
name: to-issues
description: Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issues, create implementation tickets, or break down work into issues.
---

# To Issues

Break a plan into independently-grabbable issues using vertical slices (tracer bullets).

Invoke the `github-labels` skill before publishing so each generated issue gets the correct GitHub labels.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes an issue reference (issue number, URL, or path) as an argument, fetch it from the issue tracker and read its full body and comments.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Issue titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the plan into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Any prefactoring should be done first
</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: conventional commit title — `type(scope): short imperative description`
  - **type**: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `ci`, `style`, `build`
  - **scope**: the module, package, or domain area (e.g. `auth`, `cli`, `api`, `ui`, `db`) — lowercase
  - **`!`** after type/scope for breaking changes: `feat!(auth): …` or `refactor(api)!: …`
  - **description**: lowercase, imperative mood, no trailing period
  - Examples: `feat(auth): add OAuth2 login`, `fix(cli): handle missing config`, `refactor!(api): remove legacy endpoints`
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories this addresses (if the source material has them)

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?

Iterate until the user approves the breakdown.

### 5. Publish the issues to the issue tracker

For each approved slice, publish a new issue to the issue tracker. Use the issue body template below. Each slice becomes an **Implementation Issue**: publish AFK slices with `ready-for-agent`; publish HITL slices with `ready-for-human` unless instructed otherwise. Do not apply a membership label — the native sub-issue link is the membership (the retired `PRD-sub-issue` label is no longer used). Invoke the `github-labels` skill if unsure which labels apply.

Publish issues in dependency order (blockers first) so you can reference real issue identifiers in the "Blocked by" field.

The source is normally a **Parent Target Issue** (a PRD), and each generated Implementation Issue MUST be attached to it using GitHub's native sub-issue feature — that link, not a label, is what makes krutrimbox treat it as a child. `gh issue create` accepts `--parent`, which creates the issue and links it as a native sub-issue in one call (GitHub CLI v2.94.0+). Pass the parent issue number (or URL):

```sh
gh issue create \
  --title "$title" \
  --body-file "$body_file" \
  --label "$readiness_label" \
  --parent PARENT_NUMBER
```

Use the child issue number or URL in later "Blocked by" references. If the create fails (e.g. `--parent` is unrecognized on an old CLI), stop and resolve it — upgrade `gh`, or fall back to creating the issue and linking it via the REST `POST /repos/{owner}/{repo}/issues/{parent}/sub_issues` endpoint — before treating the slice as published.

After all Implementation Issues for an existing Parent Target Issue have been created and linked, apply `ready-for-agent` to the parent so krutrimbox discovers it and walks its sub-issues. Do not apply `ready-for-agent` to the parent before every approved slice has a published, linked issue.

**Single-slice plans:** if the breakdown reduces to exactly one slice with no parent to attach it to, publish it as a **Standalone Target Issue** instead — one issue labeled `ready-for-agent`, with no parent link and no sub-issues. krutrimbox implements its body directly and drafts a pull request.

<issue-template>
## What to build
A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by
- A reference to the blocking ticket (if any)

Or "None - can start immediately" if no blockers.

</issue-template>

Do NOT close or otherwise modify any parent issue. The only allowed parent update in this workflow is adding `ready-for-agent` after all child issues have been created.
