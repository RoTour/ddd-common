import type { IDomainEvent } from "./IDomainEvent";

export interface IDomainEventListener {
  handle(event: IDomainEvent): void;
}
