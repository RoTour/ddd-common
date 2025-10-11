import { randomUUID } from "crypto";

export abstract class EntityId {
  protected readonly value: string;
  constructor(id?: string) {
    this.value = id ?? this.generateId();
  }

  /**
   * This method can be overridden by subclasses to provide a custom ID generation strategy.
   * The default strategy is to generate a UUID.
   * It's `protected` so it can only be called from this class or a subclass.
   */
  protected generateId(): string {
    return randomUUID();
  }

  public id(): string {
    return this.value;
  }

  /**
   * Compares two EntityId objects for equality.
   * A critical feature of strongly-typed IDs is that IDs of different types
   * are never equal, even if their string values are the same.
   * (e.g., new UserId("abc") is not equal to new PostId("abc"))
   */
  public equals(otherId?: EntityId): boolean {
    if (otherId === null || otherId === undefined) {
      return false;
    }

    // Check if they are the same type of ID
    if (this.constructor.name !== otherId.constructor.name) {
      return false;
    }

    return this.value === otherId.value;
  }

  /**
   * Returns the string representation of the EntityId.
   * The returned string should be able to be used to recreate the EntityId object.
   *
   * @returns {string} The string representation of the EntityId.
   */
  public toString(): string {
    return this.value;
  }
}
