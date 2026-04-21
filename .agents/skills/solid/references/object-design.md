# Object Design — Stereotypes and Responsibility

## Object Stereotypes

Every object in a well-designed system plays a recognizable role. Identify it before writing the class:

| Stereotype | Responsibility | Characteristics |
|---|---|---|
| **Information Holder** | Holds and provides data | Value objects, DTOs, records; minimal behavior |
| **Structurer** | Manages relationships between objects | Aggregates, collections, graphs of related objects |
| **Service Provider** | Performs work; stateless operations | Domain services, application services; no persistent state |
| **Coordinator** | Orchestrates multiple services to complete a workflow | Use cases; delegates to providers, never does the work itself |
| **Controller** | Makes decisions; delegates execution | Policy objects, strategy selectors |
| **Interfacer** | Transforms data between two systems or layers | Adapters, mappers, translators |

## Responsibility Questions

Before writing a class, answer:

1. **What is its one job?** (If you need "and" — split it)
2. **Who depends on it?** (Tells you its change frequency)
3. **What does it collaborate with?** (List no more than 2–3 collaborators)
4. **Which stereotype is it?** (Name it; if it doesn't fit, design is wrong)

## Responsibility Assignment Principles (GRASP)

| Pattern | Assign responsibility to… |
|---|---|
| **Information Expert** | The class that has the information needed to fulfil the responsibility |
| **Creator** | The class that aggregates, contains, or closely uses instances of B |
| **Controller** | A use-case or facade object, not a UI/domain object |
| **Low Coupling** | The class that minimizes new dependencies |
| **High Cohesion** | The class where the behavior naturally belongs |
| **Polymorphism** | The type that varies in behavior (not a switch in the caller) |
| **Protected Variations** | The stable interface around a point of known variation |

## Aggregates and Boundaries

An **aggregate** is a cluster of domain objects treated as a single unit for data changes:

- One object is the **aggregate root** — the only entry point from outside.
- External objects hold references only to the root, never to internal members.
- Invariants are enforced within the aggregate boundary.

```typescript
// WRONG — external code creates OrderLine directly
const line = new OrderLine(productId, qty, price); // bypasses Order invariants
order.lines.push(line);

// RIGHT — all mutations go through the root
order.addItem(productId, qty, price); // Order enforces invariants internally
```

## Tell, Don't Ask

Objects should be commanded to perform behavior, not interrogated for data so the caller can decide:

```typescript
// WRONG — ask, then decide (breaks encapsulation)
if (order.getStatus() === 'pending') {
  order.setStatus('confirmed');
  notificationService.send(order.getEmail(), 'confirmed');
}

// RIGHT — tell the object what to do
order.confirm(notificationService); // Order knows its own rules; notificationService is a collaborator
```

## Design by Contract

- **Preconditions**: what must be true when the method is called (validate at boundary)
- **Postconditions**: what must be true after the method completes
- **Invariants**: what must always be true for the object to be valid

Enforce invariants in the constructor; enforce preconditions at method entry with guard clauses.
