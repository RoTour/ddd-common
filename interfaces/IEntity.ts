// src/lib/ddd/interfaces/Entity.ts
import type { EntityId } from './EntityId';

/**
 * The base class for all domain entities.
 * An entity is an object that is not defined by its attributes, but rather by a thread of continuity and its identity.
 * @template T - The type of the entity's unique identifier.
 */
export abstract class IEntity<T extends EntityId> {
	public readonly id: T;

	protected constructor(id: T) {
		this.id = id;
	}

	/**
	 * Compares two entities for equality.
	 * Entities are considered equal if they are of the same type and their IDs are equal.
	 * @param other - The other entity to compare against.
	 * @returns `true` if the entities are equal, `false` otherwise.
	 */
	public equals(other?: IEntity<T>): boolean {
		if (other === null || other === undefined) {
			return false;
		}

		// Check if the other object is an Entity
		if (!(other instanceof IEntity)) {
			return false;
		}

		// Compare by reference first
		if (this === other) {
			return true;
		}

		// Compare by ID value object
		return this.id.equals(other.id);
	}
}
