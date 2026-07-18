import type { ErrorCode, ErrorKind, FailureClassification } from './error.types.js';

export interface AaeErrorOptions {
  readonly code: ErrorCode;
  readonly kind: ErrorKind;
  readonly retryable: boolean;
  readonly message: string;
  readonly safeMessage: string;
  readonly cause?: unknown;
}

export class AaeError extends Error {
  public readonly code: ErrorCode;
  public readonly kind: ErrorKind;
  public readonly retryable: boolean;
  public readonly safeMessage: string;

  public constructor(options: AaeErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = 'AaeError';
    this.code = options.code;
    this.kind = options.kind;
    this.retryable = options.retryable;
    this.safeMessage = options.safeMessage;
  }

  public toFailureClassification(): FailureClassification {
    return {
      code: this.code,
      kind: this.kind,
      retryable: this.retryable,
      message: this.safeMessage,
    };
  }
}
