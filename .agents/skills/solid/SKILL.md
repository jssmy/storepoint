---
name: solid
description: 'Use this skill when writing code, implementing features, refactoring, planning architecture, designing systems, reviewing code, or debugging. This skill transforms junior-level code into senior-engineer quality software through SOLID principles, TDD, clean code practices, and professional software design.'
---

# Solid Skills: Professional Software Engineering

Operate as a senior software engineer. Every line of code, every design decision, and every refactoring must embody professional craftsmanship.

> "Code is to create products for users & customers. Testable, flexible, and maintainable code that serves the needs of the users is GOOD because it can be cost-effectively maintained by developers."

The goal of software: enable developers to **discover, understand, add, change, remove, test, debug, deploy, and monitor** features efficiently.

## When to Use

Use this skill on **every** coding task:
- Writing any code (features, fixes, utilities)
- Refactoring existing code
- Planning or designing architecture
- Reviewing code quality
- Debugging issues
- Creating tests
- Making design decisions

## The Non-Negotiable Process

### 1. Always Start with Tests (TDD)

Red-Green-Refactor is not optional:

```
1. RED      — Write a failing test that describes the behavior
2. GREEN    — Write the SIMPLEST code to make it pass
3. REFACTOR — Clean up, remove duplication (Rule of Three)
```

**Design happens during REFACTORING, not during initial coding.**

See [references/tdd.md](./references/tdd.md) for the Three Laws and detailed patterns.

### 2. Apply SOLID Principles Rigorously

| Principle | Question to Ask |
|---|---|
| **S**RP — Single Responsibility | "Does this have ONE reason to change?" |
| **O**CP — Open/Closed | "Can I extend without modifying?" |
| **L**SP — Liskov Substitution | "Can subtypes replace base types safely?" |
| **I**SP — Interface Segregation | "Are clients forced to depend on unused methods?" |
| **D**IP — Dependency Inversion | "Do high-level modules depend on abstractions?" |

See [references/solid-principles.md](./references/solid-principles.md) for examples and violation patterns.

### 3. Write Clean, Human-Readable Code

**Naming priorities (in order):**
1. **Consistency** — same concept = same name everywhere
2. **Understandability** — domain language, not technical jargon
3. **Specificity** — precise, not vague (`userId`, not `data`)
4. **Brevity** — short but not cryptic
5. **Searchability** — unique, greppable names

**Structure rules:**
- One level of indentation per method
- No `else` when early return works
- When validating untrusted strings against an object/map, use `Object.hasOwn(...)` — never the `in` operator (matches prototype keys)
- **Always wrap primitives in domain objects** — IDs, emails, money, etc.
- First-class collections (wrap arrays in a class)
- One dot per line (Law of Demeter)
- Keep classes < 50 lines; methods < 10 lines
- No more than two instance variables per class

**Value objects are mandatory:**
```typescript
// ALWAYS create value objects for domain concepts
class UserId  { constructor(private readonly value: string) {} }
class Email   { constructor(private readonly value: string) { /* validate */ } }
class Money   { constructor(private readonly amount: number, private readonly currency: string) {} }

// NEVER pass raw primitives for domain concepts
// BAD:  function createOrder(userId: string, email: string)
// GOOD: function createOrder(userId: UserId, email: Email)
```

See [references/clean-code.md](./references/clean-code.md) for object calisthenics and naming rules.

### 4. Design with Responsibility in Mind

For every class, ask:
1. "What stereotype is this?" (Entity, Service, Repository, Factory, Coordinator…)
2. "Is it doing too much?" (Apply object calisthenics)

See [references/object-design.md](./references/object-design.md) for stereotypes and responsibility checks.

### 5. Manage Complexity Ruthlessly

- **Essential complexity** — inherent to the problem domain (unavoidable)
- **Accidental complexity** — introduced by our solutions (eliminate it)

Fight accidental complexity with:
- **YAGNI** — don't build what you don't need NOW
- **KISS** — simplest solution that works
- **DRY** — but only after Rule of Three (wait for 3 duplications)

See [references/complexity.md](./references/complexity.md) for detection techniques.

### 6. Architect for Change

- Vertical slicing: features as end-to-end self-contained slices
- Dependencies point inward (toward domain)
- Infrastructure depends on domain, never the reverse

See [references/architecture.md](./references/architecture.md).

## The Four Elements of Simple Design (XP)

In priority order:
1. **Runs all the tests** — must work correctly
2. **Expresses intent** — readable, reveals purpose
3. **No duplication** — DRY (but Rule of Three)
4. **Minimal** — fewest classes and methods possible

## Code Smell Quick Reference

| Smell | Solution |
|---|---|
| Long Method | Extract methods; compose-method pattern |
| Large Class | Extract class; single responsibility |
| Long Parameter List | Introduce parameter object |
| Divergent Change | Split into focused classes |
| Shotgun Surgery | Move related code together |
| Feature Envy | Move method to the envied class |
| Data Clumps | Extract class for grouped data |
| Primitive Obsession | Wrap in value objects |
| Switch Statements | Replace with polymorphism |
| Speculative Generality | YAGNI — remove unused abstractions |

See [references/code-smells.md](./references/code-smells.md) for full detection and refactoring guide.

## Behavioral Principles

- **Tell, Don't Ask** — command objects; don't query then decide
- **Design by Contract** — preconditions, postconditions, invariants
- **Hollywood Principle** — "Don't call us, we'll call you" (IoC)
- **Law of Demeter** — only talk to immediate collaborators

## Pre-Code Checklist

- [ ] Do I understand the requirement? (Write acceptance criteria first)
- [ ] What test will I write first?
- [ ] What is the simplest solution?
- [ ] What patterns might apply? (Don't force them)
- [ ] Am I solving a real problem or a hypothetical one?

## During-Code Checklist

- [ ] Is this the simplest thing that could work?
- [ ] Does this class have a single responsibility?
- [ ] Am I depending on abstractions or concretions?
- [ ] Can I name this more clearly?
- [ ] Is there duplication I should extract? (Rule of Three)

## Post-Code Checklist

- [ ] Do all tests pass?
- [ ] Is there any dead code to remove?
- [ ] Can I simplify any complex conditions?
- [ ] Are names still accurate after changes?
- [ ] Would a junior understand this in 6 months?

## Red Flags — Stop and Rethink

- Writing code without a failing test first
- Class with more than 2 instance variables
- Method longer than 10 lines
- More than one level of indentation
- Using `else` when early return works
- Hardcoding values that should be configurable
- Creating abstractions before the third duplication
- Adding features "just in case"
- Depending on concrete implementations
- God classes that know everything

## Key Reminders

> "A little bit of duplication is 10× better than the wrong abstraction."

> "Focus on WHAT needs to happen, not HOW it needs to happen."

> "Design principles become second nature through practice. Eventually, you won't think about SOLID — you'll just write SOLID code."

The mastery journey:
**Code-first → Best-practice-first → Pattern-first → Responsibility-first → Systems Thinking**

## References

- [TDD — Red/Green/Refactor in depth](./references/tdd.md)
- [SOLID principles with examples](./references/solid-principles.md)
- [Clean code and object calisthenics](./references/clean-code.md)
- [Object design stereotypes](./references/object-design.md)
- [Complexity management](./references/complexity.md)
- [Architecture and dependency rules](./references/architecture.md)
- [Code smells and refactoring](./references/code-smells.md)
- [Design patterns awareness](./references/design-patterns.md)
- [Testing strategy](./references/testing.md)
