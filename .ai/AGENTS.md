- Load `/project-conventions` skill if exists

## Skill reference loading

Skills ship a main `SKILL.md` (always loaded) plus optional files in the same directory — `references/*`, `examples/*`, `SAMPLE.md`, etc. — loaded on demand. Load them deliberately: not all up-front, not blindly.

**IMPORTANT — this is a BLOCKING gate.** After invoking ANY skill, before any other tool call or task action, you MUST emit a one-line triage decision and then immediately Read the files it names:

`Triage <skill-name>: loading <files>; skipping <files> because <reason>.`

The triage line and the `Read` calls for every file listed as "loading" are ONE atomic step. Emitting the line without then Reading those files, or doing task work with a file you announced but did not Read, is a violation. If a skill lists no reference files, state `Triage <skill-name>: no reference files.` and no Reads are required.

To decide what to load:

1. **Build a menu** from the reference list in the skill's main file. If it lists none, glance at each `references/*.md` (its `load-when` line or first heading) for its topic.
2. **Classify each reference:** *core* (no condition stated) → load; *conditional* (tied to a language, task type, or context — Python vs JS, bug vs feature) → load only if this task meets the condition.
3. **Don't re-read** what's already loaded; re-evaluate only if the task changes.

When in doubt, load too few rather than too many — you can read a reference later once the task makes the condition clear.
