# DDD Common Utilities

This library provides a set of reusable classes and interfaces to build applications following Domain-Driven Design (DDD) principles in TypeScript. It includes foundational building blocks for creating a robust and maintainable domain layer.

## Core Components

### `EntityId`
- **File:** `interfaces/EntityId.ts`
- **DDD Role:** Value Object

In DDD, it's a powerful practice to use strongly-typed IDs instead of primitive types like `string` or `number`. This prevents common errors, such as accidentally comparing a `UserId` with a `PostId`. The `EntityId` class is an abstract base class for creating these strongly-typed identifiers.

**Features:**
-   Generates a UUID by default.
-   Provides a type-safe `equals()` method that ensures you are comparing IDs of the same type.
-   Enforces identity through its `value` property.

**Usage:**
```typescript
// /Users/rotour/tmp/ddd-common/interfaces/EntityId.ts
import { EntityId } from './interfaces/EntityId';

// Create a specific ID type for a domain entity
class UserId extends EntityId {}

const userId1 = new UserId();
const userId2 = new UserId(userId1.id()); // Reconstitute from a string
const otherId = new EntityId(); // Generic, for demonstration

console.log(userId1.equals(userId2)); // true
console.log(userId1.equals(otherId)); // false, because they are different classes
```

**Overriding ID Generation:**

The default `generateId` method uses `crypto.randomUUID()`. You can override it to implement a different generation strategy, like using a prefix.

```typescript
// /Users/rotour/tmp/ddd-common/interfaces/EntityId.ts
import { EntityId } from './interfaces/EntityId';
import { randomUUID } from 'crypto';

class PostId extends EntityId {
  protected generateId(): string {
    // Custom ID format
    return `post_${randomUUID()}`;
  }
}

const postId = new PostId();
console.log(postId.id()); // e.g., "post_a1b2c3d4-..."
```

### `AggregateRoot`
- **File:** `interfaces/AggregateRoot.ts`
- **DDD Role:** Aggregate Root

The Aggregate Root is a fundamental pattern in DDD. It represents a cluster of domain objects (entities and value objects) that can be treated as a single unit. The root entity of the aggregate is the only object that external objects are allowed to hold a reference to. This ensures the integrity and consistency of the business rules within the aggregate.

**Features:**
-   Provides a base structure for any aggregate, ensuring it has a strongly-typed `id`.

**Usage:**
```typescript
// /Users/rotour/tmp/ddd-common/interfaces/AggregateRoot.ts
import { AggregateRoot } from './interfaces/AggregateRoot';
import { EntityId } from './interfaces/EntityId';

class UserId extends EntityId {}

class User extends AggregateRoot<UserId> {
  private name: string;

  constructor(id: UserId, name: string) {
    super(id);
    this.name = name;
  }
}

const user = new User(new UserId(), "Jane Doe");
```

### Domain Events
- **Files:**
    - `events/DomainEventPublisher.ts`
    - `interfaces/IDomainEvent.ts`
    - `interfaces/IDomainEventListener.ts`
- **DDD Role:** Domain Event

Domain Events are used to capture significant occurrences within the domain. They are a powerful tool for decoupling different parts of your domain. When something happens in one aggregate, it can publish an event, and other parts of the application (other aggregates, services, etc.) can react to it without being directly coupled.

**Components:**
-   **`IDomainEvent`**: An interface that all domain events must implement. It standardizes events by requiring:
    - `occuredOn`: The timestamp of the event.
    - `type`: A unique string identifying the event type.
    - `payload`: An object containing the event's data.
-   **`IDomainEventListener`**: An interface for subscribers. Its `handle` method should receive `event: unknown` to be robust. This forces the handler to validate the event structure before processing it, preventing runtime errors from malformed events.
-   **`DomainEventPublisher`**: A singleton publisher that manages subscribers and dispatches events to them.

**Usage:**

For robust and type-safe event handling, it is highly recommended to use a validation library like **Zod**. The listener should expect an `unknown` event and validate it before processing.

```typescript
// /Users/rotour/tmp/ddd-common/events/DomainEventPublisher.ts
import { z } from 'zod'; // Assumes zod is installed
import { IDomainEvent } from "../interfaces/IDomainEvent";
import { IDomainEventListener } from "../interfaces/IDomainEventListener";
import { DomainEventPublisher } from "./DomainEventPublisher";

// 1. Define a Zod schema for the event payload for robust validation
const userCreatedPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
});

// Define a schema for the event itself
const userCreatedEventSchema = z.object({
  type: z.literal('user.created'),
  occuredOn: z.date(),
  payload: userCreatedPayloadSchema,
});

// (Optional) Infer the TypeScript type from the schema for type-safe event creation
type UserCreatedEvent = z.infer<typeof userCreatedEventSchema>;

// 2. Create a listener. The handle method should expect 'unknown' for maximum safety.
class WelcomeEmailSender implements IDomainEventListener {
  handle(event: unknown): void {
    // Use the Zod schema to safely parse the unknown event.
    // This protects the handler from malformed or unexpected event structures.
    const result = userCreatedEventSchema.safeParse(event);

    if (result.success) {
      // Data is now fully typed and validated!
      const { payload } = result.data;
      console.log(`Sending welcome email to ${payload.email}`);
    } else {
      // Optional: log the validation error for debugging purposes
      // console.error("Invalid 'user.created' event received:", result.error);
    }
  }
}

// 3. Subscribe the listener and publish a valid event object
DomainEventPublisher.subscribe(new WelcomeEmailSender());

// The event object must match the schema
const event: UserCreatedEvent = {
  type: 'user.created',
  occuredOn: new Date(),
  payload: {
    userId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    email: 'jane.doe@example.com',
  },
};

DomainEventPublisher.publish(event);
```

### Custom Errors
- **Files:**
    - `errors/DomainError.ts`
    - `errors/ApplicationError.ts`
- **DDD Role:** Domain Exceptions

Custom errors are crucial for clearly communicating when a business rule is violated.

-   **`DomainError`**: This is the base class for all errors that originate from a domain business rule violation (e.g., `InsufficientInventoryError`). Catching `DomainError` allows you to handle business exceptions specifically.
-   **`ApplicationError`**: A more generic error class, serving as a base for any custom error within the application, including domain errors.

**Usage:**
```typescript
// /Users/rotour/tmp/ddd-common/errors/DomainError.ts
import { DomainError } from './errors/DomainError';

class OrderCannotBeShippedError extends DomainError {
  constructor(orderId: string) {
    super(`The order ${orderId} cannot be shipped in its current state.`);
    this.name = 'OrderCannotBeShippedError';
  }
}

function shipOrder(order: any) { // Using 'any' for demonstration
  if (!order.isPaid) {
    throw new OrderCannotBeShippedError(order.id.toString());
  }
  // ... shipping logic
}
```
