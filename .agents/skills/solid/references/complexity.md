# Complexity Management

## Two Types of Complexity

| Type | Definition | Response |
|---|---|---|
| **Essential** | Inherent to the problem domain; cannot be eliminated | Model it accurately; make it visible |
| **Accidental** | Introduced by our solutions (frameworks, premature abstraction, misdesign) | Eliminate ruthlessly |

## Detecting Complexity

### Change Amplification
A small conceptual change requires edits in many unrelated files.

**Signal:** "I changed the discount rule and had to touch 8 files."
**Response:** Find where the concept is scattered; consolidate it.

### Cognitive Load
A developer needs to hold too much context in working memory to understand or change the code.

**Signal:** "I need to read 5 classes before I can make this one-line change."
**Response:** Extract, rename, simplify; reduce coupling.

### Unknown Unknowns
Behavior that surprises developers because it is hidden in implicit dependencies or side effects.

**Signal:** "I didn't know changing X would break Y."
**Response:** Make dependencies explicit; eliminate hidden global state and side effects.

## The Three Anti-Complexity Principles

### YAGNI — You Aren't Gonna Need It
Build only what is required right now, by the current requirement.

- Do not add parameters, flags, or abstraction layers "for future use."
- Every unused abstraction is accidental complexity.
- If you need it later, add it later — when the requirement is concrete.

### KISS — Keep It Simple, Stupid
The simplest solution that correctly solves the problem is the right solution.

- Prefer boring, readable code over clever, terse code.
- Prefer explicit over implicit.
- Simple solutions are easier to test, debug, and change.

### DRY — Don't Repeat Yourself (Rule of Three)

> "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."

**The Rule of Three:** Do not extract until you see the duplication **three times**.

- First time: write it.
- Second time: notice the similarity.
- Third time: extract the abstraction.

Extracting too early often creates the wrong abstraction, which is harder to fix than duplication.

> "A little bit of duplication is 10× better than the wrong abstraction."

## Complexity Budget

Every design decision adds to the complexity budget. Ask:

- Does this abstraction pay for itself in reduced change cost?
- Can I achieve the same outcome with fewer concepts?
- Am I solving a real, present problem or a hypothetical future one?

## Refactoring Triggers

Refactor when any of these thresholds are crossed:

| Signal | Threshold |
|---|---|
| Method length | > 10 lines |
| Class length | > 50 lines |
| Parameters | > 3 |
| Instance variables | > 2 |
| Nesting depth | > 1 level |
| Duplicated logic | 3rd occurrence |
| Files touched for one change | > 3 unrelated files |
