import { AaeError } from '../../core/errors/aae-error.js';
import type { FailureClassification } from '../../core/errors/error.types.js';

export function classifyError(error: unknown): FailureClassification {
  if (error instanceof AaeError) {
    return error.toFailureClassification();
  }

  return {
    code: 'UNEXPECTED_FAILURE',
    kind: 'unexpected',
    retryable: false,
    message: 'Unexpected runtime failure',
  };
}
