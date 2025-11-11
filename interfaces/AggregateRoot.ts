import { IEntity } from '$lib/ddd/interfaces/IEntity';
import type { EntityId } from './EntityId';
import type { IDomainEvent } from './IDomainEvent';

export abstract class AggregateRoot<T extends EntityId> extends IEntity<T> {
	private readonly _domainEvents: IDomainEvent[] = [];

	protected constructor(id: T) {
		super(id);
	}

	public addDomainEvent(domainEvent: IDomainEvent): void {
		this._domainEvents.push(domainEvent);
	}

	public getDomainEvents(): IDomainEvent[] {
		return this._domainEvents;
	}

	public clearDomainEvents(): void {
		this._domainEvents.length = 0;
	}
}
