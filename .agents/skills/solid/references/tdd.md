# TDD — Red / Green / Refactor

## The Three Laws of TDD

1. You **cannot** write production code unless it makes a failing test pass.
2. You **cannot** write more test code than is sufficient to fail (including compilation failure).
3. You **cannot** write more production code than is sufficient to make the failing test pass.

## The Cycle

```
RED    → Write a failing test that describes the desired behavior
GREEN  → Write the SIMPLEST code that makes the test pass (even hardcoded)
REFACTOR → Clean up duplication and improve design — without changing behavior
```

**Design happens during REFACTOR, not during GREEN.** Resist the urge to design up-front.

## Why Hardcode in Green?

The goal of GREEN is to confirm the test works and covers real behavior. Hardcoding exposes missing tests:

```typescript
// RED — test fails
it('when adding 2 + 3, returns 5', () => {
  expect(add(2, 3)).toBe(5);
});

// GREEN — hardcode is fine; exposes you need more tests
function add(a: number, b: number): number {
  return 5; // will break when next test is added
}

// next RED — forces real implementation
it('when adding 10 + 1, returns 11', () => {
  expect(add(10, 1)).toBe(11);
});

// GREEN — real implementation emerges
function add(a: number, b: number): number {
  return a + b;
}
```

## Refactor Phase Rules

- Refactor only when tests are green.
- Apply Rule of Three: wait for three duplications before extracting.
- Each refactor step must keep all tests passing.
- Use extract-method, extract-class, rename, introduce parameter object — in small steps.

## What Makes a Good Unit Test

- Tests **one behavior**, not one method.
- Uses realistic values (not `"foo"`, `1`, `true`).
- Has one logical `expect`/`assert` (multiple assertions are OK if they describe the same outcome).
- Does not rely on order of execution.
- Is fast (milliseconds).
- Is deterministic — always produces the same result.

## Test as Documentation

Tests document the **intent** of the system. They should read like specifications:

```typescript
describe('Order', () => {
  describe('when placing an order with insufficient stock', () => {
    it('throws InsufficientStockError', () => {
      const order = Order.create({ productId: new ProductId('p-1'), quantity: 100 });
      const inventory = new Inventory({ productId: new ProductId('p-1'), available: 5 });

      expect(() => inventory.reserve(order)).toThrow(InsufficientStockError);
    });
  });
});
```

## TDD Rhythm

| Step | Focus |
|---|---|
| RED | Describe intent through the test |
| GREEN | Make it work — any means necessary |
| REFACTOR | Make it right — clean design |
| Commit | Small, meaningful commit at green+refactored |

## Common TDD Mistakes

| Mistake | Fix |
|---|---|
| Writing tests after the code | Start from failing test always |
| Writing multiple tests before going green | One test at a time |
| Skipping refactor | Debt compounds quickly; refactor every cycle |
| Over-engineering in green | Keep it simple; design in refactor |
| Mocking too much | Prefer fakes; mock only at true system boundaries |
