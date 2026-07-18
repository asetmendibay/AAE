import { describe, expect, it, vi } from 'vitest';

import { ConsoleEventPublisher } from '../../../src/infrastructure/events/console-event-publisher.js';
import type { Logger } from '../../../src/core/observability/logger.types.js';

describe('ConsoleEventPublisher', () => {
  it('publishes events through the logger with correlation data', () => {
    const logger: Logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const publisher = new ConsoleEventPublisher(logger);

    publisher.publish({
      name: 'job.started',
      correlationId: 'corr-123',
      occurredAt: '2026-07-18T00:00:00.000Z',
      payload: { jobId: 'job-123' },
    });

    expect(logger.info).toHaveBeenCalledWith('Runtime event: job.started', {
      correlationId: 'corr-123',
      eventName: 'job.started',
      occurredAt: '2026-07-18T00:00:00.000Z',
      data: { jobId: 'job-123' },
    });
  });
});
