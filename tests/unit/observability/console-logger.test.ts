import { describe, expect, it } from 'vitest';

import {
  ConsoleLogger,
  type ConsoleSink,
} from '../../../src/infrastructure/logging/console-logger.js';

function createSink(): { sink: ConsoleSink; messages: string[] } {
  const messages: string[] = [];
  const sink: ConsoleSink = {
    debug: (message: string): void => messages.push(message),
    info: (message: string): void => messages.push(message),
    warn: (message: string): void => messages.push(message),
    error: (message: string): void => messages.push(message),
  };

  return { sink, messages };
}

describe('ConsoleLogger', () => {
  it('writes structured records with correlation and event fields', () => {
    const { sink, messages } = createSink();
    const logger = new ConsoleLogger(sink);

    logger.info('Job started', {
      correlationId: 'corr-123',
      eventName: 'job.started',
      occurredAt: '2026-07-18T00:00:00.000Z',
      data: { jobId: 'job-123' },
    });

    expect(JSON.parse(messages[0] ?? '')).toMatchObject({
      level: 'info',
      message: 'Job started',
      correlationId: 'corr-123',
      eventName: 'job.started',
      occurredAt: '2026-07-18T00:00:00.000Z',
      data: { jobId: 'job-123' },
    });
  });

  it('redacts sensitive keys and common secret patterns', () => {
    const { sink, messages } = createSink();
    const logger = new ConsoleLogger(sink);

    logger.error('Request failed token=message-token', {
      data: {
        password: 'password-value',
        nested: { apiKey: 'api-key-value' },
        authorization: 'Bearer header-token',
        AAE_PROFILE_ENCRYPTION_KEY: 'profile-encryption-key-value',
        safe: 'token remains hidden: token=value',
      },
      error: {
        name: 'Error',
        message: 'secret=error-secret',
      },
    });

    const serialized = messages[0] ?? '';
    expect(serialized).not.toContain('password-value');
    expect(serialized).not.toContain('api-key-value');
    expect(serialized).not.toContain('header-token');
    expect(serialized).not.toContain('message-token');
    expect(serialized).not.toContain('error-secret');
    expect(serialized).not.toContain('profile-encryption-key-value');
    expect(JSON.parse(serialized)).toMatchObject({
      data: {
        password: '[REDACTED]',
        nested: { apiKey: '[REDACTED]' },
        authorization: '[REDACTED]',
        AAE_PROFILE_ENCRYPTION_KEY: '[REDACTED]',
      },
    });
  });
});
