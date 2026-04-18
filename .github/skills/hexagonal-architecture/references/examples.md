# Code Examples — Hexagonal Architecture

## TypeScript

### Port definitions

```typescript
// application/ports/outbound/OrderRepositoryPort.ts
export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(orderId: string): Promise<Order | null>;
}

// application/ports/outbound/PaymentGatewayPort.ts
export interface PaymentGatewayPort {
  authorize(input: { orderId: string; amountCents: number }): Promise<{ authorizationId: string }>;
}
```

### Use case

```typescript
// application/use-cases/CreateOrderUseCase.ts
type CreateOrderInput = { orderId: string; amountCents: number };
type CreateOrderOutput = { orderId: string; authorizationId: string };

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly paymentGateway: PaymentGatewayPort
  ) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const order = Order.create({ id: input.orderId, amountCents: input.amountCents });

    const auth = await this.paymentGateway.authorize({
      orderId: order.id,
      amountCents: order.amountCents,
    });

    // markAuthorized returns a new Order; no mutation.
    const authorizedOrder = order.markAuthorized(auth.authorizationId);
    await this.orderRepository.save(authorizedOrder);

    return { orderId: order.id, authorizationId: auth.authorizationId };
  }
}
```

### Outbound adapter

```typescript
// adapters/outbound/postgres/PostgresOrderRepository.ts
export class PostgresOrderRepository implements OrderRepositoryPort {
  constructor(private readonly db: SqlClient) {}

  async save(order: Order): Promise<void> {
    await this.db.query(
      'insert into orders (id, amount_cents, status, authorization_id) values ($1, $2, $3, $4)',
      [order.id, order.amountCents, order.status, order.authorizationId]
    );
  }

  async findById(orderId: string): Promise<Order | null> {
    const row = await this.db.oneOrNone('select * from orders where id = $1', [orderId]);
    return row ? Order.rehydrate(row) : null;
  }
}
```

### Inbound adapter (Express)

```typescript
// adapters/inbound/http/createOrderRoute.ts
export const createOrderRoute = (useCase: CreateOrderUseCase) =>
  async (req: Request, res: Response) => {
    // Mapping stays here — use case never sees req/res
    const result = await useCase.execute({
      orderId: req.body.orderId,
      amountCents: req.body.amountCents,
    });
    res.status(201).json(result);
  };
```

### Composition root

```typescript
// composition/ordersContainer.ts
export const buildCreateOrderUseCase = (deps: { db: SqlClient; stripe: StripeClient }) => {
  const orderRepository = new PostgresOrderRepository(deps.db);
  const paymentGateway = new StripePaymentGateway(deps.stripe);
  return new CreateOrderUseCase(orderRepository, paymentGateway);
};
```

---

## Java

```java
// application/port/out/OrderRepositoryPort.java
public interface OrderRepositoryPort {
    void save(Order order);
    Optional<Order> findById(String orderId);
}

// application/usecase/CreateOrderUseCase.java
public class CreateOrderUseCase {
    private final OrderRepositoryPort orderRepository;
    private final PaymentGatewayPort paymentGateway;

    public CreateOrderUseCase(OrderRepositoryPort orderRepository, PaymentGatewayPort paymentGateway) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    public CreateOrderOutput execute(CreateOrderInput input) {
        Order order = Order.create(input.orderId(), input.amountCents());
        AuthResult auth = paymentGateway.authorize(order.getId(), order.getAmountCents());
        orderRepository.save(order.markAuthorized(auth.authorizationId()));
        return new CreateOrderOutput(order.getId(), auth.authorizationId());
    }
}
```

---

## Kotlin

```kotlin
// application/port/OrderRepositoryPort.kt
interface OrderRepositoryPort {
    suspend fun save(order: Order)
    suspend fun findById(orderId: String): Order?
}

// application/usecase/CreateOrderUseCase.kt
class CreateOrderUseCase(
    private val orderRepository: OrderRepositoryPort,
    private val paymentGateway: PaymentGatewayPort
) {
    suspend fun execute(input: CreateOrderInput): CreateOrderOutput {
        val order = Order.create(input.orderId, input.amountCents)
        val auth = paymentGateway.authorize(order.id, order.amountCents)
        orderRepository.save(order.markAuthorized(auth.authorizationId))
        return CreateOrderOutput(order.id, auth.authorizationId)
    }
}
```

---

## Go

```go
// internal/orders/ports/ports.go
type OrderRepository interface {
    Save(ctx context.Context, order Order) error
    FindByID(ctx context.Context, orderID string) (*Order, error)
}

type PaymentGateway interface {
    Authorize(ctx context.Context, orderID string, amountCents int) (string, error)
}

// internal/orders/application/create_order.go
type CreateOrderUseCase struct {
    repo    ports.OrderRepository
    gateway ports.PaymentGateway
}

func NewCreateOrderUseCase(repo ports.OrderRepository, gateway ports.PaymentGateway) *CreateOrderUseCase {
    return &CreateOrderUseCase{repo: repo, gateway: gateway}
}

func (uc *CreateOrderUseCase) Execute(ctx context.Context, input CreateOrderInput) (CreateOrderOutput, error) {
    order := NewOrder(input.OrderID, input.AmountCents)
    authID, err := uc.gateway.Authorize(ctx, order.ID, order.AmountCents)
    if err != nil {
        return CreateOrderOutput{}, err
    }
    order = order.MarkAuthorized(authID)
    if err := uc.repo.Save(ctx, order); err != nil {
        return CreateOrderOutput{}, err
    }
    return CreateOrderOutput{OrderID: order.ID, AuthorizationID: authID}, nil
}

// cmd/api/main.go (composition root)
func main() {
    db := connectDB()
    stripeClient := stripe.NewClient(os.Getenv("STRIPE_KEY"))

    repo := postgres.NewOrderRepository(db)
    gateway := stripeadapter.NewPaymentGateway(stripeClient)
    createOrder := application.NewCreateOrderUseCase(repo, gateway)

    server := http.NewServer(createOrder)
    server.ListenAndServe(":8080")
}
```
