import { describe, expect, it } from 'vitest';

import { classifyError } from '../../../src/application/errors/classify-error.js';
import { ConfigValidationError } from '../../../src/core/config/config.errors.js';
import { AaeError } from '../../../src/core/errors/aae-error.js';

describe('classifyError', () => {
  it('returns explicit metadata for known AAE errors', () => {
    const error = new AaeError({
      code: 'DEPENDENCY_UNAVAILABLE',
      kind: 'dependency',
      retryable: true,
      message: 'Browser service is unavailable',
      safeMessage: 'Required dependency is unavailable',
    });

    expect(classifyError(error)).toEqual({
      code: 'DEPENDENCY_UNAVAILABLE',
      kind: 'dependency',
      retryable: true,
      message: 'Required dependency is unavailable',
    });
  });

  it('classifies configuration errors as non-retryable', () => {
    expect(classifyError(new ConfigValidationError(['AAE_LOG_LEVEL is invalid']))).toEqual({
      code: 'CONFIG_INVALID',
      kind: 'configuration',
      retryable: false,
      message: 'Runtime configuration is invalid',
    });
  });

  it('sanitizes unknown errors into a stable user-facing result', () => {
    const error = new Error('secret=do-not-expose');

    expect(classifyError(error)).toEqual({
      code: 'UNEXPECTED_FAILURE',
      kind: 'unexpected',
      retryable: false,
      message: 'Unexpected runtime failure',
    });
    expect(JSON.stringify(classifyError(error))).not.toContain('do-not-expose');
  });
});
