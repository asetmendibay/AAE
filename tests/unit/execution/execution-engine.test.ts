import { describe, expect, it, vi } from 'vitest';

import { ExecutionEngine } from '../../../src/application/execution/execution-engine.js';
import { AaeError } from '../../../src/core/errors/aae-error.js';
import type { EventPublisher, RuntimeEvent } from '../../../src/core/observability/event.types.js';
import type { Logger } from '../../../src/core/observability/logger.types.js';
import type { JobExecutor } from '../../../src/core/execution/job.types.js';

const logger: Logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

function createEvents(): { events: EventPublisher; records: RuntimeEvent[] } {
  const records: RuntimeEvent[] = [];
  return {
    records,
    events: {
      publish: (event: RuntimeEvent): void => records.push(event),
    },
  };
}

describe('ExecutionEngine', () => {
  it('completes a successful job and publishes terminal diagnostics', async () => {
    const { events, records } = createEvents();
    const executor: JobExecutor<{ value: number }, { doubled: number }> = {
      execute: async ({ input }): Promise<{ doubled: number }> => ({ doubled: input.value * 2 }),
    };
    const engine = new ExecutionEngine(executor, { logger, events });

    const result = await engine.run({
      id: 'job-success',
      input: { value: 21 },
      timeoutMs: 100,
    });

    expect(result).toEqual({
      jobId: 'job-success',
      status: 'succeeded',
      attempts: 1,
      output: { doubled: 42 },
    });
    expect(records.map(({ name }) => name)).toEqual(['job.queued', 'job.running', 'job.succeeded']);
  });

  it('retries only a retryable failure', async () => {
    const { events, records } = createEvents();
    let calls = 0;
    const executor: JobExecutor<void, string> = {
      execute: async (): Promise<string> => {
        calls += 1;
        if (calls === 1) {
          throw new AaeError({
            code: 'DEPENDENCY_UNAVAILABLE',
            kind: 'dependency',
            retryable: true,
            message: 'temporary dependency failure',
            safeMessage: 'Required dependency is unavailable',
          });
        }
        return 'ok';
      },
    };
    const engine = new ExecutionEngine(executor, { logger, events });

    const result = await engine.run({
      id: 'job-retry',
      input: undefined,
      timeoutMs: 100,
      retryPolicy: { maxAttempts: 2 },
    });

    expect(result).toEqual({ jobId: 'job-retry', status: 'succeeded', attempts: 2, output: 'ok' });
    expect(calls).toBe(2);
    expect(records.map(({ name }) => name)).toContain('job.retrying');
  });

  it('fails without retrying a non-retryable error', async () => {
    const { events, records } = createEvents();
    const executor: JobExecutor<void, never> = {
      execute: async (): Promise<never> => {
        throw new AaeError({
          code: 'INPUT_INVALID',
          kind: 'validation',
          retryable: false,
          message: 'invalid input',
          safeMessage: 'Input is invalid',
        });
      },
    };
    const engine = new ExecutionEngine(executor, { logger, events });

    const result = await engine.run({
      id: 'job-failure',
      input: undefined,
      timeoutMs: 100,
      retryPolicy: { maxAttempts: 3 },
    });

    expect(result).toEqual({
      jobId: 'job-failure',
      status: 'failed',
      attempts: 1,
      failure: {
        code: 'INPUT_INVALID',
        kind: 'validation',
        retryable: false,
        message: 'Input is invalid',
      },
    });
    expect(records.at(-1)?.name).toBe('job.failed');
  });

  it('returns cancelled when the caller aborts the job', async () => {
    const { events } = createEvents();
    const controller = new AbortController();
    const executor: JobExecutor<void, never> = {
      execute: async ({ signal }): Promise<never> =>
        new Promise<never>((_resolve, _reject) => {
          signal.addEventListener('abort', () => undefined);
        }),
    };
    const engine = new ExecutionEngine(executor, { logger, events });
    const promise = engine.run(
      { id: 'job-cancelled', input: undefined, timeoutMs: 1_000 },
      controller.signal,
    );

    controller.abort();

    await expect(promise).resolves.toMatchObject({
      jobId: 'job-cancelled',
      status: 'cancelled',
      attempts: 1,
    });
  });

  it('retries a timeout when policy allows it', async () => {
    const { events } = createEvents();
    let calls = 0;
    const executor: JobExecutor<void, never> = {
      execute: async (): Promise<never> => {
        calls += 1;
        return new Promise<never>(() => undefined);
      },
    };
    const engine = new ExecutionEngine(executor, { logger, events });

    const result = await engine.run({
      id: 'job-timeout',
      input: undefined,
      timeoutMs: 5,
      retryPolicy: { maxAttempts: 2 },
    });

    expect(result.status).toBe('failed');
    expect(result.failure?.code).toBe('TIMEOUT');
    expect(result.attempts).toBe(2);
    expect(calls).toBe(2);
  });

  it('returns a timeout even when executor resolves as its abort signal is delivered', async () => {
    const { events } = createEvents();
    let executorWasAborted = false;
    const executor: JobExecutor<void, string> = {
      execute: async ({ signal }): Promise<string> =>
        new Promise<string>((resolve) => {
          signal.addEventListener('abort', () => {
            executorWasAborted = true;
            resolve('late-result');
          });
        }),
    };
    const engine = new ExecutionEngine(executor, { logger, events });

    const result = await engine.run({ id: 'job-timeout-race', input: undefined, timeoutMs: 5 });

    expect(result).toMatchObject({
      jobId: 'job-timeout-race',
      status: 'failed',
      attempts: 1,
      failure: { code: 'TIMEOUT', kind: 'timeout' },
    });
    expect(executorWasAborted).toBe(true);
  });

  it('does not start a new retry attempt when cancellation happens during backoff', async () => {
    const records: RuntimeEvent[] = [];
    let notifyRetrying: (() => void) | undefined;
    const retrying = new Promise<void>((resolve) => {
      notifyRetrying = resolve;
    });
    const events: EventPublisher = {
      publish: (event: RuntimeEvent): void => {
        records.push(event);
        if (event.name === 'job.retrying') {
          notifyRetrying?.();
        }
      },
    };
    const controller = new AbortController();
    let calls = 0;
    const executor: JobExecutor<void, never> = {
      execute: async (): Promise<never> => {
        calls += 1;
        throw new AaeError({
          code: 'DEPENDENCY_UNAVAILABLE',
          kind: 'dependency',
          retryable: true,
          message: 'temporary dependency failure',
          safeMessage: 'Required dependency is unavailable',
        });
      },
    };
    const engine = new ExecutionEngine(executor, { logger, events });
    const resultPromise = engine.run(
      {
        id: 'job-cancel-during-backoff',
        input: undefined,
        timeoutMs: 100,
        retryPolicy: { maxAttempts: 2, backoffMs: 1_000 },
      },
      controller.signal,
    );

    await retrying;
    controller.abort();

    await expect(resultPromise).resolves.toMatchObject({
      jobId: 'job-cancel-during-backoff',
      status: 'cancelled',
      attempts: 1,
    });
    expect(calls).toBe(1);
    expect(records.map(({ name }) => name)).toEqual([
      'job.queued',
      'job.running',
      'job.retrying',
      'job.cancelled',
    ]);
  });
});
