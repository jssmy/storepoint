# Design Patterns — Awareness Guide

Design patterns are recurring solutions to common design problems. Do **not** force them — let them emerge naturally from refactoring.

## When to Introduce a Pattern

1. You have a concrete problem, not a hypothetical one.
2. You've seen the same structure appear at least twice (Rule of Three).
3. The pattern reduces coupling or enables extension without modification.
4. The code is harder to understand without the pattern name than with it.

---

## Creational Patterns

### Factory Method / Abstract Factory
**Problem:** Deciding which concrete class to instantiate is complex or varies.
**When:** Multiple implementations of a port/interface; the caller shouldn't know which concrete type to create.

### Builder
**Problem:** Constructing a complex object step-by-step where many optional parts exist.
**When:** Objects with > 3 optional parameters; test data builders (object mothers).

### Singleton
**Problem:** Exactly one instance of a class must exist.
**Warning:** Often a code smell disguising global state. Prefer dependency injection over singleton access.

---

## Structural Patterns

### Adapter
**Problem:** An existing interface is incompatible with what the client expects.
**When:** Wrapping a third-party SDK, legacy service, or external API behind a port.

### Decorator
**Problem:** Add behavior to an object without subclassing.
**When:** Cross-cutting concerns (logging, caching, retry, rate limiting) layered around a core implementation.

```typescript
class CachingOrderRepository implements OrderRepositoryPort {
  constructor(
    private readonly inner: OrderRepositoryPort,
    private readonly cache: Cache
  ) {}

  async findById(id: string): Promise<Order | null> {
    return this.cache.getOrSet(id, () => this.inner.findById(id));
  }
}
```

### Composite
**Problem:** Treat individual objects and compositions of objects uniformly.
**When:** Tree structures; discount rules composed of sub-rules; permission hierarchies.

### Proxy
**Problem:** Control access to an object (lazy loading, access control, remote proxy).
**When:** Deferred initialization, authorization checks without modifying the target.

---

## Behavioral Patterns

### Strategy
**Problem:** A family of algorithms that must be interchangeable.
**When:** OCP requires adding behavior without modifying existing code; discount policies, sorting, validation strategies.

```typescript
interface PricingStrategy { calculate(basePrice: Money): Money; }
class PeakPricing    implements PricingStrategy { ... }
class DiscountPricing implements PricingStrategy { ... }
```

### Observer / Event
**Problem:** One object must notify others without knowing who they are.
**When:** Domain events; decoupling side effects (send email, update read model) from business logic.

### Template Method
**Problem:** An algorithm's skeleton is fixed, but specific steps vary.
**When:** Base process is shared; subclasses or callbacks customize specific steps.

### Command
**Problem:** Encapsulate a request as an object to support queuing, logging, or undo.
**When:** Use-case input objects; transactional outbox patterns; undo/redo systems.

### Specification
**Problem:** Business rules that can be combined with AND/OR/NOT.
**When:** Complex filtering logic that must be composable and testable independently.

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Harmful |
|---|---|
| **God Object** | Single class knows everything; violates SRP massively |
| **Service Locator** | Hides dependencies; makes testing and auditing hard |
| **Anemic Domain Model** | Domain objects are just data bags; business logic leaks into services |
| **Golden Hammer** | Forcing one pattern on every problem |
| **Spaghetti Code** | No structure; change amplification is catastrophic |
| **Lava Flow** | Dead code kept "just in case"; nobody knows if it's safe to remove |

---

## Pattern Discovery Flow

```
Observe a problem recurring →
  Name the smell →
    Find the refactoring →
      Pattern emerges from refactoring
```

Never start from "what pattern should I use?" Start from "what problem do I have?"
