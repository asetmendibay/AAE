import { describe, expect, it } from 'vitest';

import { ConfigValidationError } from '../../../src/core/config/config.errors.js';
import { loadConfig } from '../../../src/application/config/load-config.js';

describe('loadConfig', () => {
  it('uses safe defaults when no supported variables are provided', () => {
    expect(loadConfig({})).toEqual({
      environment: 'development',
      logLevel: 'info',
      defaultTimeoutMs: 30_000,
    });
  });

  it('parses supported environment variables', () => {
    expect(
      loadConfig({
        AAE_ENVIRONMENT: 'test',
        AAE_LOG_LEVEL: 'debug',
        AAE_DEFAULT_TIMEOUT_MS: '15000',
      }),
    ).toEqual({
      environment: 'test',
      logLevel: 'debug',
      defaultTimeoutMs: 15_000,
    });
  });

  it('trims supported string values', () => {
    expect(
      loadConfig({
        AAE_ENVIRONMENT: ' production ',
        AAE_LOG_LEVEL: ' warn ',
        AAE_DEFAULT_TIMEOUT_MS: ' 5000 ',
      }),
    ).toEqual({
      environment: 'production',
      logLevel: 'warn',
      defaultTimeoutMs: 5_000,
    });
  });

  it('reports all invalid values without exposing their contents', () => {
    expect(() =>
      loadConfig({
        AAE_ENVIRONMENT: 'invalid-environment',
        AAE_LOG_LEVEL: 'invalid-level',
        AAE_DEFAULT_TIMEOUT_MS: 'not-a-number',
      }),
    ).toThrow(ConfigValidationError);

    try {
      loadConfig({
        AAE_ENVIRONMENT: 'invalid-environment',
        AAE_LOG_LEVEL: 'invalid-level',
        AAE_DEFAULT_TIMEOUT_MS: 'not-a-number',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigValidationError);
      expect((error as ConfigValidationError).issues).toHaveLength(3);
      expect((error as Error).message).not.toContain('invalid-environment');
      expect((error as Error).message).not.toContain('not-a-number');
    }
  });
});
