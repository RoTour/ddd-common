// /Users/rotour/projects/back-to-react/src/domain/events/IDomainEventListener.ts
import { IDomainEvent } from "./IDomainEvent";

export interface IDomainEventListener {
  handle(event: IDomainEvent): void;
}
