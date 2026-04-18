# SOLID Principles — Reference

## S — Single Responsibility Principle

**"A class should have one, and only one, reason to change."**

Every module/class/function should be responsible for one actor or concern.

```typescript
// BAD — mixes business logic, formatting, and persistence
class Report {
  generateData() { /* query DB */ }
  formatHtml() { /* build HTML */ }
  save() { /* write to disk */ }
}

// GOOD — each class has one reason to change
class ReportData    { generate(): ReportDto { /* query DB */ } }
class ReportFormatter { toHtml(data: ReportDto): string { /* format */ } }
class ReportStorage { save(content: string): void { /* persist */ } }
```

**Smell:** "This class changes when X changes AND when Y changes" → split it.

---

## O — Open/Closed Principle

**"Software entities should be open for extension, but closed for modification."**

Add new behavior by adding new code, not by changing existing code.

```typescript
// BAD — must modify existing class to add new discount type
class DiscountService {
  calculate(type: string, price: number): number {
    if (type === 'vip') return price * 0.8;
    if (type === 'student') return price * 0.9;
    // adding new type requires editing here
  }
}

// GOOD — extend via new implementations
interface DiscountPolicy {
  apply(price: Money): Money;
}

class VipDiscount     implements DiscountPolicy { apply(p: Money) { return p.multiply(0.8); } }
class StudentDiscount implements DiscountPolicy { apply(p: Money) { return p.multiply(0.9); } }

class DiscountService {
  constructor(private readonly policy: DiscountPolicy) {}
  calculate(price: Money): Money { return this.policy.apply(price); }
}
```

**Strategy, decorator, and specification patterns are common OCP enablers.**

---

## L — Liskov Substitution Principle

**"Subtypes must be substitutable for their base types without altering the correctness of the program."**

If `S` extends `B`, anywhere you use `B`, you must be able to use `S` with no surprises.

```typescript
// BAD — Square violates LSP when extending Rectangle
class Rectangle {
  setWidth(w: number)  { this.width = w; }
  setHeight(h: number) { this.height = h; }
  area(): number { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(w: number)  { this.width = this.height = w; } // breaks caller expectations
}

// GOOD — use a shared abstraction rather than inheritance
interface Shape { area(): number; }
class Rectangle implements Shape { area() { return this.width * this.height; } }
class Square    implements Shape { area() { return this.side ** 2; } }
```

**Check:** Does calling code need `instanceof` checks? That's an LSP violation signal.

---

## I — Interface Segregation Principle

**"Clients should not be forced to depend on methods they do not use."**

Prefer small, focused interfaces over large, general ones.

```typescript
// BAD — implementors are forced to implement irrelevant methods
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// GOOD — small, composable interfaces
interface Workable { work(): void; }
interface Feedable { eat(): void; }
interface Restable { sleep(): void; }

class HumanWorker implements Workable, Feedable, Restable { ... }
class RobotWorker  implements Workable { ... }  // robots don't eat or sleep
```

**Smell:** Classes implementing an interface but throwing `NotImplementedError` from some methods.

---

## D — Dependency Inversion Principle

**"High-level modules should not depend on low-level modules. Both should depend on abstractions."**

```typescript
// BAD — high-level use case depends on concrete Postgres class
class CreateOrderUseCase {
  private repo = new PostgresOrderRepository(); // concrete dependency
}

// GOOD — depend on the abstraction; inject the concrete at the edge
interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
}

class CreateOrderUseCase {
  constructor(private readonly repo: OrderRepositoryPort) {} // abstraction
}

// Composition root wires the concrete
const useCase = new CreateOrderUseCase(new PostgresOrderRepository(db));
```

**DIP enables testability**: inject fakes in tests, real adapters in production.

---

## SOLID Self-Check Questions

Before committing code, ask:

| Principle | Question |
|---|---|
| SRP | If this class changes, is it for exactly one reason? |
| OCP | Can I add new behavior without editing this file? |
| LSP | Can every subtype/implementor be swapped in without surprises? |
| ISP | Does every consumer of this interface use all its methods? |
| DIP | Does this class `new` up its own concrete dependencies? |
