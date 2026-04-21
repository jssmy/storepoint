# Migration Playbook — Hexagonal Architecture

For refactoring existing layered or framework-heavy systems toward Ports & Adapters without a big-bang rewrite.

## Core Principles

- **Strangler approach**: keep current endpoints; route one use case at a time through new ports/adapters.
- **No full rewrites**: migrate per feature slice and preserve behavior with characterization tests.
- **Facade first**: wrap legacy services behind outbound ports before replacing internals.
- **Composition freeze**: centralize wiring early so new dependencies cannot leak into domain/use-case layers.
- **Rollback path**: keep a reversible toggle or route switch per migrated slice until production behavior is verified.

## Step-by-Step Migration

### Step 1 — Add characterization tests
Before touching any code, write tests that capture the **current observable behavior** of the target slice. These become your safety net.

```typescript
// characterization: existing behavior before extraction
it('POST /orders returns 201 with order id and authorization id', async () => {
  const response = await request(app).post('/orders').send({ ... });
  expect(response.status).toBe(201);
  expect(response.body).toMatchObject({ orderId: expect.any(String) });
});
```

### Step 2 — Pick one vertical slice
Choose by:
- **High churn, low blast radius**: frequently changed code that doesn't affect too many other things.
- Clear input/output boundary already implied by the existing code.
- Manageable size (one endpoint or one job).

### Step 3 — Define the use-case boundary
Extract explicit input/output DTOs. Identify what the use case needs from the outside world.

```typescript
type CreateOrderInput  = { orderId: string; amountCents: number };
type CreateOrderOutput = { orderId: string; authorizationId: string };
```

### Step 4 — Introduce outbound ports around existing calls
Wrap each infrastructure concern (DB calls, HTTP clients, event publishers) behind a port interface. Keep the existing implementation behind the port for now.

```typescript
// Before: use case calls ORM directly
await OrderModel.create({ id, amountCents });

// After: use case calls port; existing ORM code moves into an adapter
interface OrderRepositoryPort { save(order: Order): Promise<void>; }
class SequelizeOrderRepository implements OrderRepositoryPort { ... }
```

### Step 5 — Move orchestration into the use case
Pull control flow and business decisions out of controllers/services/handlers and into the use case class/function. The use case should be dependency-free except for port interfaces.

### Step 6 — Keep old adapters; delegate to the new use case
Don't change the existing inbound adapter (controller/handler) yet. Make it delegate to the new use case instead of running its own logic.

```typescript
// Existing controller — no behavioral change, now delegates
router.post('/orders', async (req, res) => {
  const result = await createOrderUseCase.execute({   // new use case
    orderId: req.body.orderId,
    amountCents: req.body.amountCents,
  });
  res.status(201).json(result);
});
```

### Step 7 — Add boundary tests
- Unit test the use case with in-memory fakes.
- Integration test the new adapters against real infrastructure.
- Verify characterization tests still pass.

### Step 8 — Repeat slice by slice
Pick the next slice. Do not attempt cross-cutting restructuring until several slices are migrated and patterns are established.

### Step 9 — Remove characterization tests when stable
Once production behavior is verified and the new boundary tests cover it fully, retire the characterization tests.

## Slice Selection Heuristics

| Priority | Signal |
|---|---|
| High | Frequent bugs or regressions in this area |
| High | Multiple developers stepping on each other |
| High | Known upcoming infrastructure replacement |
| Medium | High test coverage debt |
| Low | Stable, rarely changed code |
| Avoid | Highly tangled shared state across features |

## Common Blockers and Workarounds

| Blocker | Workaround |
|---|---|
| Global singletons used everywhere | Wrap in a port; pass via constructor; refactor globals last |
| Framework objects deep in domain | Extract use-case boundary above the framework object; strip it in the inbound adapter |
| No tests at all | Write characterization tests first; treat them as the baseline |
| Circular dependencies between modules | Identify which module should own the port; the other becomes the adapter |
| Database transactions spanning multiple use cases | Introduce a `UnitOfWork` outbound port; implement per-DB-adapter |
