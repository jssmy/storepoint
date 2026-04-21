# Testing Strategy

## Test Pyramid

```
         [E2E / Acceptance]     ← few, slow, high confidence
        [Integration Tests]     ← moderate count, real components
       [Unit Tests]             ← many, fast, isolated
```

### Unit Tests
- Test a **single class or function** in isolation.
- All dependencies are replaced with fakes or stubs.
- Must be millisecond-fast and fully deterministic.
- Cover: happy paths, edge cases, error conditions.

### Integration Tests
- Test multiple real components working together.
- May use a real database (test container), real file system, real queue.
- Verify: serialization, query correctness, adapter behavior with real infrastructure.
- Slower than unit tests; run in CI on every PR.

### E2E / Acceptance Tests
- Cover critical user journeys through the full system.
- Verify: the system does what the user expects end-to-end.
- Keep the count small; focus on business-critical flows.
- Do not re-test business logic already covered by unit tests.

---

## Arrange-Act-Assert (AAA) Pattern

Every test has three clear phases:

```typescript
it('when adding 2 + 3, returns 5', () => {
  // Arrange — set up the subject under test and dependencies
  const calculator = new Calculator();

  // Act — perform the operation
  const result = calculator.add(2, 3);

  // Assert — verify the expected outcome
  expect(result).toBe(5);
});
```

Never mix arrangement with assertion or let one `it` block do multiple independent behaviors.

---

## Test Naming

Names describe **concrete behavior**, not abstract categories.

```typescript
// BAD — abstract, says nothing about what fails
'can process order'
'handles error case'
'returns correct value'

// GOOD — concrete, readable as a specification
'when placing an order with sufficient stock, confirms the order'
'when payment gateway times out, throws PaymentTimeoutError'
'when adding 2 + 3, returns 5'
```

Format: `when <context/condition>, <expected behavior>`

---

## Fakes vs. Mocks vs. Stubs

| Test Double | Use When |
|---|---|
| **Fake** | In-memory implementation of a port (preferred; real behavior, no I/O) |
| **Stub** | Return a fixed value; verify no interaction needed |
| **Mock** | Verify that a specific interaction occurred (e.g., event was published) |
| **Spy** | Like a mock but wraps a real object; use sparingly |

**Prefer fakes over mocks.** Fakes test behavior; mocks test implementation details, making tests brittle.

```typescript
// Fake — in-memory implementation; tests real behavioral contracts
class InMemoryOrderRepository implements OrderRepositoryPort {
  private store = new Map<string, Order>();
  async save(order: Order) { this.store.set(order.id.toString(), order); }
  async findById(id: string) { return this.store.get(id) ?? null; }
}

// Mock — verifies interaction (use only when behavior can't be observed otherwise)
const publishEvent = jest.fn();
await useCase.execute(input);
expect(publishEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'OrderCreated' }));
```

---

## Test Isolation Rules

- Tests must not share mutable state.
- Tests must not depend on execution order.
- Each test sets up its own fixtures in Arrange.
- Clean up after tests that write to real infrastructure (use `afterEach` / `beforeEach`).

---

## What NOT to Test

- Private implementation details (test behavior, not internals).
- Framework code that's not your responsibility.
- Trivial getters/setters with no logic.
- Code that is already covered by a lower-level test (don't duplicate assertions).

---

## Test Coverage Guidance

Coverage is a tool, not a goal:

- **100% coverage with bad tests** provides false confidence.
- **Aim for coverage of behavior**: every decision branch, every error case, every domain rule.
- **Don't skip edge cases** just because the happy path is covered.
- **Mutation testing** (e.g., Stryker) reveals gaps that coverage metrics miss.
