# Clean Code & Object Calisthenics

## Object Calisthenics Rules

Nine rules that, when followed strictly, force clean object-oriented design:

| # | Rule | Rationale |
|---|---|---|
| 1 | One level of indentation per method | Forces method extraction |
| 2 | No `else` keyword | Use early returns, guard clauses |
| 3 | Wrap all primitives in objects | Domain safety, no primitive obsession |
| 4 | First-class collections | Wrap arrays/lists in a dedicated class |
| 5 | One dot per line | Enforce Law of Demeter |
| 6 | Don't abbreviate names | If you want to abbreviate, it's too long or ambiguous |
| 7 | Keep entities small | < 50 lines per class; < 10 lines per method |
| 8 | No more than 2 instance variables per class | Forces decomposition |
| 9 | No getter/setter/property | Tell, don't ask |

## Naming Priorities

1. **Consistency** — same concept = same name everywhere in the codebase
2. **Understandability** — use domain language (ubiquitous language), not technical jargon
3. **Specificity** — `orderId` not `id`; `pendingOrders` not `list`; `calculateTotalPrice` not `process`
4. **Brevity** — short but not cryptic; avoid `Manager`, `Handler`, `Helper`, `Util`, `Info`, `Data`
5. **Searchability** — unique enough to grep without false positives

## Value Objects — Mandatory for Domain Concepts

Wrap every domain primitive in a value object:

```typescript
// WRONG — primitive obsession
function chargeCustomer(customerId: string, amount: number, currency: string) { ... }

// RIGHT — value objects express domain intent
class CustomerId {
  constructor(private readonly value: string) {
    if (!value.trim()) throw new Error('CustomerId cannot be blank');
  }
  toString() { return this.value; }
  equals(other: CustomerId) { return this.value === other.value; }
}

class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: 'USD' | 'EUR' | 'GBP'
  ) {
    if (amount < 0) throw new Error('Money amount cannot be negative');
  }
  add(other: Money): Money {
    if (this.currency !== other.currency) throw new CurrencyMismatchError();
    return new Money(this.amount + other.amount, this.currency);
  }
}

function chargeCustomer(customerId: CustomerId, amount: Money) { ... }
```

## First-Class Collections

When a class contains a collection, that class should contain **only** that collection plus behavior related to it:

```typescript
// WRONG — raw array used throughout
const orders: Order[] = [];
const total = orders.filter(o => o.isPending()).reduce((sum, o) => sum + o.total, 0);

// RIGHT — behavior lives with the collection
class PendingOrders {
  constructor(private readonly orders: Order[]) {
    if (orders.some(o => !o.isPending())) throw new Error('All orders must be pending');
  }
  totalValue(): Money { return this.orders.reduce((sum, o) => sum.add(o.total), Money.zero()); }
  count(): number { return this.orders.length; }
}
```

## Guard Clauses (No Else)

```typescript
// WRONG — nested conditions
function processOrder(order: Order | null) {
  if (order !== null) {
    if (order.isPending()) {
      if (order.hasItems()) {
        // actual logic
      }
    }
  }
}

// RIGHT — fail fast with guard clauses
function processOrder(order: Order | null) {
  if (order === null) throw new OrderNotFoundError();
  if (!order.isPending()) throw new InvalidOrderStateError();
  if (!order.hasItems()) throw new EmptyOrderError();
  // actual logic — flat, clear
}
```

## Security Note: Object Key Validation

When checking if an untrusted string is a valid key of an object or map:

```typescript
// WRONG — `in` operator matches prototype chain keys (security risk)
if (userInput in validActions) { ... }

// RIGHT — use Object.hasOwn for own-property check only
if (Object.hasOwn(validActions, userInput)) { ... }
// or for older targets:
if (Object.prototype.hasOwnProperty.call(validActions, userInput)) { ... }
```

## Law of Demeter (One Dot Per Line)

```typescript
// WRONG — chaining exposes internals
const city = customer.getAddress().getCity().getName();

// RIGHT — ask the object, don't navigate its internals
const city = customer.cityName();  // customer exposes behavior, not structure
```

## Class Size Discipline

- **Classes**: < 50 lines (excluding blank lines and comments)
- **Methods**: < 10 lines
- **Parameters**: ≤ 3; use a parameter object if more are needed
- **Instance variables**: ≤ 2; forces decomposition into collaborating objects

When a class grows beyond these limits, extract a collaborator.
