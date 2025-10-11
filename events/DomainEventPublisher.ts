import type { IDomainEvent } from "../interfaces/IDomainEvent";
import type { IDomainEventListener } from "../interfaces/IDomainEventListener";

class Publisher {
  private subscribers: IDomainEventListener[] = [];
  private publishing = false;

  public subscribe(subscriber: IDomainEventListener): void {
    // As per the text, prevent modification while publishing
    if (this.publishing) {
      return;
    }
    this.subscribers.push(subscriber);
  }

  public publish(event: IDomainEvent): void {
    // As per the text, prevent nested publishing
    if (this.publishing) {
      return;
    }

    try {
      this.publishing = true;
      this.subscribers.forEach((subscriber) => {
        // Here, a more complex implementation would check if the
        // subscriber is interested in this specific event type.
        subscriber.handle(event);
      });
    } finally {
      this.publishing = false;
    }
  }

  /**
   * As per the text, this is needed to clear subscribers between
   * different requests in a long-running server process.
   */
  public reset(): void {
    this.subscribers = [];
  }
}

// Export a singleton instance, as per the text's `instance()` pattern
export const DomainEventPublisher = new Publisher();
