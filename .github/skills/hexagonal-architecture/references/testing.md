# Testing Guidance — Hexagonal Architecture

Hexagonal boundaries map cleanly to test layers. Each layer has a distinct purpose, tooling, and infrastructure dependency level.

## Test Layers

### 1. Domain Tests
Test entities and value objects as pure business rules.

- No mocks, no framework setup, no I/O.
- Assert invariants, state transitions, and domain errors.
- These should run in milliseconds.

```typescript
// domain/Order.spec.ts
it('cannot authorize an already-cancelled order', () => {
  const order = Order.create({ id: '1', amountCents: 1000 }).cancel();
  expect(() => order.markAuthorized('auth-123')).toThrow(OrderAlreadyCancelledError);
});
```

### 2. Use-Case Unit Tests
Test orchestration logic with **fakes** (in-memory implementations) or stubs for outbound ports.

- No real infrastructure — use in-memory fakes.
- Assert business outcomes and port interactions.
- Fast and deterministic.

```typescript
// application/use-cases/CreateOrderUseCase.spec.ts
class InMemoryOrderRepository implements OrderRepositoryPort {
  private store = new Map<string, Order>();
  async save(order: Order) { this.store.set(order.id, order); }
  async findById(id: string) { return this.store.get(id) ?? null; }
}

class StubPaymentGateway implements PaymentGatewayPort {
  async authorize() { return { authorizationId: 'auth-stub-123' }; }
}

it('saves an authorized order after payment succeeds', async () => {
  const repo = new InMemoryOrderRepository();
  const useCase = new CreateOrderUseCase(repo, new StubPaymentGateway());

  const result = await useCase.execute({ orderId: 'order-1', amountCents: 5000 });

  expect(result.authorizationId).toBe('auth-stub-123');
  expect(await repo.findById('order-1')).not.toBeNull();
});
```

### 3. Outbound Adapter Contract Tests
Define a shared contract suite at the port interface level and run it against each concrete adapter.

- Prevents drift between the port contract and the adapter implementation.
- Run the same suite against in-memory fakes (fast) and real adapters (integration).

```typescript
// Define contract as a shared function
export const orderRepositoryContract = (getRepo: () => OrderRepositoryPort) => {
  it('persists and retrieves an order by id', async () => {
    const repo = getRepo();
    const order = Order.create({ id: 'c-1', amountCents: 200 });
    await repo.save(order);
    expect(await repo.findById('c-1')).toEqual(order);
  });
};

// Run against in-memory fake
describe('InMemoryOrderRepository', () => orderRepositoryContract(() => new InMemoryOrderRepository()));

// Run against real Postgres adapter (integration test)
describe('PostgresOrderRepository', () => orderRepositoryContract(() => new PostgresOrderRepository(testDb)));
```

### 4. Inbound Adapter Tests
Verify protocol mapping in both directions.

- Input: protocol payload → use-case input DTO (correct fields, types, validation errors).
- Output: use-case output DTO → protocol response (status codes, response shape, error codes).
- Use a fake/mock use case; do not test business logic here.

```typescript
// adapters/inbound/http/createOrderRoute.spec.ts
it('returns 201 with order data on success', async () => {
  const fakeUseCase = { execute: jest.fn().mockResolvedValue({ orderId: '1', authorizationId: 'auth-1' }) };
  const response = await request(app).post('/orders').send({ orderId: '1', amountCents: 500 });
  expect(response.status).toBe(201);
  expect(response.body.authorizationId).toBe('auth-1');
});
```

### 5. Outbound Adapter Integration Tests
Run against real infrastructure to verify serialization, schema/query behavior, retries, and timeouts.

- Use test containers or a dedicated test DB/queue.
- Cover error cases: constraint violations, network timeouts, unexpected schemas.
- Slower; run in CI on every PR, not on every local save.

### 6. End-to-End Tests
Cover critical user journeys through inbound adapter → use case → outbound adapter.

- Use real infrastructure or high-fidelity stubs (e.g., WireMock for external APIs).
- Keep the count small; cover happy paths and the most important failure modes.
- Do not duplicate business logic assertions already covered by use-case unit tests.

## Refactor Safety

When migrating existing code to hexagonal boundaries:

1. Add **characterization tests** against the current behavior before extracting anything.
2. Keep characterization tests active until the new boundary is stable and behaviorally equivalent.
3. Only then remove characterization tests in favor of the new use-case + adapter layer tests.

## Test Naming Convention

| Layer | Pattern |
|---|---|
| Domain | `<entity>.<rule>.spec.ts` |
| Use case | `<UseCase>.spec.ts` with descriptive `it` strings about business outcomes |
| Adapter contract | `<PortName>.contract.spec.ts` |
| Inbound adapter | `<route/handler>.spec.ts` focused on protocol mapping |
| Integration | `<Adapter>.integration.spec.ts` |
| E2E | `<journey>.e2e.spec.ts` |
