---
name: to-prd
description: Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context.
---

This skill takes the current conversation context and codebase understanding and produces a PRD. Do NOT interview the user — just synthesize what you already know.

A PRD is a **Parent Target Issue** whose body is a product and implementation plan: krutrimbox discovers it (when it is labeled `ready-for-agent` and has no parent) and walks the Implementation Issues that the follow-up `to-issues` workflow creates as its native sub-issues.

Invoke the `github-labels` skill before publishing so the PRD issue gets the correct GitHub labels.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write the PRD using the template below, then publish it to the project issue tracker. Apply `needs-triage`. Do not apply `ready-for-agent` yet; a Parent Target Issue becomes ready only after the follow-up `to-issues` workflow has created and linked all its Implementation Issues, at which point `to-issues` applies `ready-for-agent` to the PRD.

**Issue title format** — follow Conventional Commits:

```
type(scope): short imperative description
```

- **type**: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `ci`, `style`, `build`
- **scope**: the module, package, or domain area (e.g. `auth`, `cli`, `api`, `ui`, `db`) — keep it short and lowercase
- **`!`** after type/scope signals a breaking change: `feat!(auth): …` or `refactor(api)!: …`
- **description**: lowercase, imperative mood, no trailing period

Examples: `feat(auth): add OAuth2 login`, `fix(cli): handle missing config`, `refactor!(api): remove legacy endpoints`

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>
