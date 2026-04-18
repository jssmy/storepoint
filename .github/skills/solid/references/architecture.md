# Architecture and Dependency Rules

## The Core Dependency Rule

> Source code dependencies must point **inward**, toward high-level policies (domain and application logic). Infrastructure always depends on domain — never the reverse.

```
Infrastructure (DB, HTTP, Queue, SDK)
       ↓ depends on
Application (use cases, ports)
       ↓ depends on
Domain (entities, value objects, rules)
       ↓ depends on
Nothing external
```

If an entity imports an ORM model, or a use case imports `express`, the dependency rule is violated.

## Vertical Slicing

Organize code by **feature**, not by technical layer. Each slice contains everything needed to deliver one user-facing capability:

```text
features/
  orders/
    domain/          ← entities, value objects, domain rules
    application/     ← use cases, ports, application services
    adapters/        ← HTTP, DB, queue implementations
    composition/     ← wires adapters into use cases
  inventory/
    ...
```

Benefits:
- Changes to one feature don't scatter across unrelated files.
- Each slice can be developed, tested, and deployed independently.
- Team ownership maps naturally to slices.

## Horizontal Decoupling (Layer Isolation)

Within a slice, layers must not know each other's internals:

| Layer | May depend on | Must NOT depend on |
|---|---|---|
| Domain | Only other domain types | Application, adapters, frameworks |
| Application | Domain + port interfaces | Adapters, frameworks, infrastructure |
| Adapters | Application ports + infrastructure SDKs | Other adapters directly |
| Composition | Everything (that's its job) | — |

## Dependency Injection vs. Service Locator

**Prefer constructor injection (explicit DI)** over service locators (hidden globals):

```typescript
// BAD — service locator hides dependencies
class CreateOrderUseCase {
  execute(input: CreateOrderInput) {
    const repo = Container.get('OrderRepository'); // hidden dependency
  }
}

// GOOD — explicit dependency makes the contract visible and testable
class CreateOrderUseCase {
  constructor(private readonly repo: OrderRepositoryPort) {}
}
```

## Avoiding Big-Ball-of-Mud

Signs the architecture is degrading:
- Circular dependencies between features/modules.
- Domain classes with `import` statements pointing to controllers or ORM models.
- Use cases that hold HTTP request objects or database connections.
- "Utility" classes that everyone imports.

**Corrective actions:**
1. Extract the shared concept into the domain layer.
2. Introduce a port interface for cross-cutting dependencies.
3. Move shared utilities to a true shared kernel (minimal, stable, no upward dependencies).

## Architecture Decision Heuristics

| Question | If YES → |
|---|---|
| Does this change frequently based on infrastructure choices? | Move to an adapter |
| Does this encode a business rule? | Move to domain |
| Does this orchestrate multiple steps for one user intent? | Move to a use case |
| Is this wiring two things together? | Move to composition root |
| Is this transforming between two representations? | Move to a mapper in the adapter |
