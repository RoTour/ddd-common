// /Users/rotour/projects/back-to-react/src/domain/errors/DomainError.ts

/**
 * Base class for all custom domain errors.
 *
 * This allows application-level error handlers to catch any error originating
 * from a domain business rule violation and handle it differently from
 * system, network, or validation errors.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly. This is a common requirement when extending built-in classes like Error.
    Object.setPrototypeOf(this, new.target.prototype);
    // Set the error name to the class name.
    this.name = this.constructor.name;
  }
}
