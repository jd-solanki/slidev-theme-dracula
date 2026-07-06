---
name: comment-code
description: Write clear, useful in-code comments and documentation that capture what the code cannot say for itself. Use this skill whenever writing or revising comments, docstrings, interface/API documentation, function or class headers, or inline explanations — and whenever reviewing code for comment quality or being asked to "document," "add comments," "explain in comments," or improve existing comments. Apply it even when the request only mentions writing the code, since fresh code is the moment to document it well.
---

# Writing Good Code Comments

Comments exist to capture information that was in the writer's mind but cannot be expressed in the code itself. Code states *what happens* mechanically; comments supply intent, contracts, rationale, units, invariants, and the higher-level picture. Good comments make a system understandable to someone reading it for the first time and let abstractions hide complexity. The cost is small — typically a fraction of development time — and it pays back every time someone (including the original author, weeks later) needs to read or change the code.

## The one rule that governs everything

**Comment things that aren't obvious from the code.** Before keeping any comment, ask: *Could someone who has never seen this code reconstruct this comment just by reading the code next to it?* If yes, the comment adds nothing — delete it or replace it with something that does add information. "Obvious" means obvious to a first-time reader, not to you.

This single test eliminates most bad comments and motivates most good ones.

## Don't repeat the code

The most common worthless comment simply restates the line below it, at the same level of detail.

```python
i = i + 1          # increment i              ← adds nothing
count = len(items) # get the number of items  ← adds nothing
```

A close cousin is the comment that just recycles the words already in the name:

```java
// Obtain a normalized resource name from the request.
String[] getNormalizedResourceName(Request req) { ... }
```

The only word here not already in the signature is "from." This tells the reader nothing they couldn't read off the declaration. The fix is to **use different words than the name**, words that explain the meaning the name only hints at: What *is* a normalized resource name? What are the elements of the returned array? When in doubt, the giveaway is one-comment-per-line at the same granularity as the code.

## Comments work at a *different* level of detail than the code

A comment at the same level as the code repeats it. Useful comments go either lower (more precise) or higher (more abstract) than the code.

### Lower-level comments add precision

Most valuable on declarations — fields, arguments, return values — where a name and type leave real questions open. Fill in what the type can't say:

- **Units** — pixels? milliseconds? bytes?
- **Boundaries** — is the range inclusive or exclusive of the endpoints?
- **Nulls** — is null allowed, and what does it mean?
- **Ownership** — for a resource that must be freed/closed, who is responsible?
- **Invariants** — properties always true, e.g. "always contains at least one entry."

```c
// Vague:
uint32_t offset;  // current offset in buffer

// Precise:
// Position in this buffer of the first byte that has not yet
// been returned to the client.
uint32_t offset;
```

When documenting a variable, **think nouns, not verbs**: describe what it *represents*, not how various pieces of code modify it. A comment that narrates "set to true here, reset to false there" mirrors the code structure and grows stale; a comment stating the meaning ("true means a heartbeat has arrived since the timer was last reset") is shorter, more stable, and lets the reader *infer* the manipulation.

### Higher-level comments enhance intuition

These omit detail to convey overall intent — what the code is *for* and how it fits the surrounding method. Common for blocks inside methods, loops, and interface comments.

```c
// Too low-level — partly repeats the conditions below:
// If there is a LOADING rpc with the same session whose last
// hash is smaller than the current one, use that rpc.

// Higher-level — states the purpose:
// Try to append this key hash to an existing, not-yet-sent RPC
// bound for the right server.
```

With the high-level version a reader can predict almost everything the loop does and can *judge whether the code is correct* — something a detail-echoing comment never enables. Higher-level comments are harder to write because they require stepping back from detail. Ask: *What is this code trying to do? What is the simplest thing that explains all of it? What is the most important thing about it?*

A specially useful higher-level form is **"how we get here"** — the conditions under which a block or method runs, especially for code that only executes in unusual situations.

## Comment categories — and which matter most

| Category | Where | Priority |
|---|---|---|
| **Interface** | Block immediately before a class/method/function declaration; defines the abstraction | Highest |
| **Data-structure member** | Next to a field/variable declaration | Highest |
| **Implementation** | Inside a method body | Often unnecessary |
| **Cross-module** | Describes dependencies spanning module boundaries | Rare but critical |

Every class should have an interface comment, every class variable a comment, and every method an interface comment. The occasional declaration is so self-evident (a trivial getter/setter) that nothing useful can be added — but that is rare, and it is cheaper to comment everything than to deliberate each time.

## Interface comments define the abstraction

Interface documentation is what someone needs to *use* a class or method without reading its body. Keep it strictly separate from implementation detail.

**For a class:** describe the abstraction it provides, what each instance represents, and any limitations users must know (e.g. "not safe for concurrent access").

**For a method**, cover:
- A sentence or two on the behavior *as the caller perceives it* (the abstraction).
- Each argument and the return value, precisely — including constraints and dependencies between arguments.
- Side effects — any consequence affecting future behavior that isn't the return value (mutating internal state, writing a file).
- Exceptions it can raise.
- Preconditions the caller must satisfy first (minimize these, but document any that remain).

```c
/*
 * Copy a range of bytes from this buffer to an external location.
 *
 * offset: index of the first byte to copy.
 * length: number of bytes to copy.
 * dest:   destination; must have room for at least `length` bytes.
 *
 * Returns the number of bytes actually copied, which is less than
 * `length` if the range extends past the end of the buffer, and 0
 * if the range and the buffer do not overlap at all.
 */
uint32_t Buffer::copy(uint32_t offset, uint32_t length, void* dest);
```

The reader never has to open the method body to call it correctly, and the comment says nothing about *how* the copy is implemented.

### Red flag: implementation detail leaking into the interface

If a method's interface comment has to describe how it works internally, that's a warning sign — usually that the method is shallow (its interface is nearly as complex as its implementation). Move the *how* inside the method body, where it's clearly separated from the contract. Things users never need — private config parameters, names of internal RPCs, internal data structures, recovery that happens invisibly — do not belong in interface comments.

## Implementation comments: what and why, not how

Most methods are short enough to need no implementation comments. When a method is long, help the reader by stating, at a higher level, *what* each major block accomplishes:

```c
// Phase 1: scan active RPCs to see if any have completed.
```

For a non-trivial loop, describe what one iteration does:

```c
// Each iteration extracts one request from the request message,
// increments the matching object, and appends a response.
```

Also comment the **why** when it isn't visible: a tricky workaround, a hardware quirk, or a bug fix whose necessity isn't apparent. For a tracked bug, point to the issue instead of restating it:

```c
// Fixes RAM-436: device-driver crash on Linux 2.4.x.
```

Comment important local variables only when their uses are spread across a large span; if every use is visible within a few lines and the name is good, let the code speak.

## Cross-module comments

Some design decisions span several classes (a protocol touching both sender and receiver; an error code requiring edits in many files). These are subtle and bug-prone, so they need documentation — but the hard part is putting it where developers will *find* it.

- If there's a natural central point everyone must touch (e.g. an enum that all changes pass through), put the cross-cutting notes right there, listing every other place that must change.
- If there's no obvious home, a central `designNotes` file with clearly labeled sections works well: keep one authoritative copy, and from each relevant spot leave a short pointer (`// See "Zombies" in designNotes`). The trade-off is that notes living away from the code are harder to keep current — but a single findable copy beats duplicated or buried documentation.

Avoid duplicating the same explanation in many places; duplication is what makes documentation go stale.

## Keeping comments fresh

Comments drift out of date only in proportion to how much the code changes, and large code changes already cost more than the matching comment edit. Two habits keep drift small: **don't duplicate documentation**, and **keep each comment next to the code it describes**. Code review is the natural place to catch stale comments.

## Workflow when writing or revising comments

1. Write the comment, then apply the test: *could a first-time reader produce this from the adjacent code alone?* If yes, rewrite or delete.
2. For declarations, add the precision the type omits (units, bounds, null meaning, ownership, invariants). Describe what it represents, not how it's changed.
3. For methods/classes, write the interface comment first — behavior, parameters, return, side effects, exceptions, preconditions — keeping implementation detail out.
4. Inside long methods, label major blocks and complex loops at a higher level, and explain any non-obvious *why*.
5. Use words different from the entity's name; reach for the level of detail above or below the code, never the same level.
6. If you can't write an interface comment without describing the implementation, treat that as a design smell, not just a writing problem.