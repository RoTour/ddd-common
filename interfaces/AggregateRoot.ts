import { EntityId } from "./EntityId";

export abstract class AggregateRoot<T extends EntityId> {
  public readonly id: T;
  protected constructor(id: T) {
    this.id = id;
  }
}
