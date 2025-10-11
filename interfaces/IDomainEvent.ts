export interface IDomainEvent {
  /**
   * The date and time when the event occurred. This is crucial for
   * auditing, logging, and reconstructing state if needed.
   */
  readonly occuredOn: Date;

  /**
   * A payload containing relevant data about the event. This should
   * be a plain object with key-value pairs that provide context for
   * the event.
   */
  readonly payload: Record<string, unknown>;

  /**
   * A string that uniquely identifies the type of event. This is
   * useful for event handling, logging, and processing.
   */
  readonly type: string;
}
