---
name: code-organisation
description: Decide where code lives — the directory tree, module and package boundaries, and the layout inside a file. Use when starting a new project or directory tree, placing a new file/class/function, grouping code into modules or packages, splitting an oversized file or module, naming directories/packages/files, separating source from generated build artifacts, or auditing an existing codebase's structure.
---

# Code organisation

One principle sits under everything here: **what changes together lives together.** Co-locate code that changes for the same reason; separate code that changes for different reasons. Apply it at three **zoom levels** — *system → module → file* — each the same rule at a different scale.

This skill is reference. Read the level you are working at.

## Placing new code

A short procedure for the recurring question "where does this go?":

1. **Name its reason to change** in domain language — the feature or concept it serves. *Done when you can finish "this changes when ___" without naming a technology.*
2. **Find the home that shares that reason** — the module whose other code changes on the same trigger. *Done when you have checked siblings at the right zoom level, not only the file you are already in.*
3. **Place it, or create a sibling.** If a home fits, add it there; if none fits, create a new sibling at that zoom level, named for the concept. *Done when the new code's neighbours are the things that change with it.*
4. **Confirm the feature did not scatter** — one logical change should not force edits across many directories. *Done when a typical change to this feature stays inside one module.*

## System level — the repository

- **Bounded context**: split the system into self-contained models, each with its own consistent language — one context's `Account` need not mean another's. Map the relationships between contexts explicitly instead of letting one model sprawl across the whole system.
- **Layered architecture**: isolate the domain from UI, application, and infrastructure. Dependencies point *inward*; the domain layer holds the model and knows nothing of frameworks or persistence.
- **Source tree is not the build tree**: version-control inputs — source, scripts, fixtures — and never commit outputs — object files, binaries, coverage, generated docs. Build out-of-source so generated artifacts never pollute the source tree.
- **Grow by component, not by accretion**: a single source directory is fine until it isn't; as the project grows, divide into component directories rather than letting one directory swell.

## Module / package / directory level

- **Package by feature, not by layer.** Group by what code is *about* — the domain concept — not by technical role. Modules should tell the story of the domain, and module names belong in the shared language the team speaks. A top-level `controllers/ models/ services/` split is the opposite: it smears every feature across the tree.
- **Avoid partitioning by technical type**: never split by `Entity`/`ValueObject`/`Service`, by persistent/transient, or by any technical distinction that ignores meaning.
- **High cohesion, low coupling.** A module has one reason to exist; keep the dependencies crossing its boundary few and pointing one way.
- **Aggregate = the consistency boundary**: cluster the objects that must stay valid together behind a single root, so a transaction touches one aggregate. Aggregate boundaries make natural module boundaries.
- **Components for build scale**: break a monolith into components with explicit interfaces so each builds and tests on its own. Granularity trades encapsulation against build and coordination cost — avoid both one giant component and a thousand tiny ones.
- **Directories mirror the module hierarchy.** The folder tree should match the package or namespace tree.

## File level

- **Newspaper layout**: a file reads top-down like an article — its name announces the subject, the highest-level concepts sit at the top, and detail deepens as you scroll.
- **Stepdown rule**: order functions so each sits just above those one level of abstraction below it (caller above callee), and keep one level of abstraction per function.
- **Vertical distance**: related things belong near each other — a variable by its first use, dependent functions adjacent, similar concepts grouped — with blank lines marking the seams between concepts.
- **One file, one concept**: a file holds a single responsibility. When many fields are each touched by only a few methods, cohesion has dropped — split the file. An oversized file is usually several concepts asking to separate; small files (a couple hundred lines is roomy) beat large ones.

## Naming — every level

Names are structure. Make them intention-revealing, pronounceable, and searchable; pick one word per concept; and draw from the **problem domain** so file, directory, and package names echo the language the team and the model already use. A directory named for a technology hides what lives in it; a directory named for a domain concept advertises it.

## Spotting trouble in existing code

The same rules read backwards — each smell is the principle being violated. On a hit, name the change-reason at stake before moving anything.

- **Shotgun surgery** — one logical change forces edits across many directories. The feature is scattered by a layer-first layout; regroup it by feature.
- **Layer-first top level** — `controllers/`, `models/`, `services/`, or `interfaces/` vs `impl/`, as the top split. Repackage by domain concept.
- **Type-partitioned modules** — packages named `entities/`, `valueobjects/`, `dtos/`. Merge by meaning.
- **Generated files in the source tree** — build outputs, coverage, compiled assets committed beside source. Move to an out-of-source output tree; ignore them in version control.
- **God file** — one file holding several unrelated concepts, or low cohesion where each field is used by only a handful of methods. Split by responsibility.
- **Domain leaking infrastructure** — domain code importing the database, framework, or UI. Invert the dependency so the domain depends on nothing outward.
- **Tech-named directories** — folder names describe mechanism, not domain. Rename to the problem-domain term.
- **Cross-context model bleed** — one class shared between two bounded contexts where it means different things. Split it per context and map the relationship explicitly.