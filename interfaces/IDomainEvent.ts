export interface IDomainEvent {
  /**
   * The date and time when the event occurred. This is crucial for
   * auditing, logging, and reconstructing state if needed.
   */
  readonly occuredOn: Date;
}
