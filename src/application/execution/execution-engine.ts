import { AaeError } from '../../core/errors/aae-error.js';
import type { EventPublisher } from '../../core/observability/event.types.js';
import type { Logger } from '../../core/observability/logger.types.js';
import { classifyError } from '../errors/classify-error.js';
import type {
  ExecutionEngineDependencies,
  JobDefinition,
  JobExecutionContext,
  JobExecutor,
  JobResult,
  RetryPolicy,
} from '../../core/execution/job.types.js';

const DEFAULT_MAX_ATTEMPTS = 1;
const DEFAULT_BACKOFF_MS = 0;

export class ExecutionEngine<Input = unknown, Output = unknown> {
  private readonly logger: Logger;
  private readonly events: EventPublisher;

  public constructor(
    private readonly executor: JobExecutor<Input, Output>,
    dependencies: ExecutionEngineDependencies,
  ) {
    this.logger = dependencies.logger;
    this.events = dependencies.events;
  }

  public async run(
    definition: JobDefinition<Input>,
    signal?: AbortSignal,
  ): Promise<JobResult<Output>> {
    const retryPolicy = normalizeRetryPolicy(definition.retryPolicy);
    validateDefinition(definition, retryPolicy);
    const correlationId = definition.correlationId ?? definition.id;
    let attempts = 0;

    this.emit('job.queued', definition.id, correlationId);

    while (attempts < retryPolicy.maxAttempts) {
      attempts += 1;
      this.emit('job.running', definition.id, correlationId, { attempt: attempts });

      try {
        const output = await this.runAttempt(definition, correlationId, attempts, signal);
        this.emit('job.succeeded', definition.id, correlationId, { attempts });
        return { jobId: definition.id, status: 'succeeded', attempts, output };
      } catch (error) {
        const failure = classifyError(error);

        if (failure.kind === 'cancelled') {
          this.emit('job.cancelled', definition.id, correlationId, { attempts });
          return { jobId: definition.id, status: 'cancelled', attempts, failure };
        }

        if (failure.retryable && attempts < retryPolicy.maxAttempts) {
          this.emit('job.retrying', definition.id, correlationId, {
            attempt: attempts,
            nextAttempt: attempts + 1,
          });
          try {
            await delay(retryPolicy.backoffMs * attempts, signal);
          } catch (delayError) {
            const cancellation = classifyError(delayError);
            if (cancellation.kind === 'cancelled') {
              this.emit('job.cancelled', definition.id, correlationId, { attempts });
              return { jobId: definition.id, status: 'cancelled', attempts, failure: cancellation };
            }
            throw delayError;
          }
          continue;
        }

        this.logger.error('Job failed', {
          correlationId,
          eventName: 'job.failed',
          data: { code: failure.code, kind: failure.kind, attempts },
        });
        this.emit('job.failed', definition.id, correlationId, {
          code: failure.code,
          kind: failure.kind,
          attempts,
        });
        return { jobId: definition.id, status: 'failed', attempts, failure };
      }
    }

    throw new Error('Execution engine reached an invalid retry state');
  }

  private async runAttempt(
    definition: JobDefinition<Input>,
    correlationId: string,
    attempt: number,
    signal?: AbortSignal,
  ): Promise<Output> {
    const controller = new AbortController();
    if (signal?.aborted) {
      controller.abort();
    }
    const executionContext: JobExecutionContext<Input> = {
      jobId: definition.id,
      input: definition.input,
      attempt,
      correlationId,
      signal: controller.signal,
    };
    const execution = this.executor.execute(executionContext);
    const timeout = createTimeoutPromise<Output>(
      definition.timeoutMs,
      () => createTimeoutError(definition.timeoutMs),
      () => controller.abort(),
    );
    const cancellation = createCancellationPromise<Output>(signal, createCancellationError, () =>
      controller.abort(),
    );

    try {
      return await Promise.race([execution, timeout.promise, cancellation.promise]);
    } finally {
      timeout.cancel();
      cancellation.cancel();
    }
  }

  private emit(
    name: string,
    jobId: string,
    correlationId: string,
    payload?: Readonly<Record<string, unknown>>,
  ): void {
    this.events.publish({
      name,
      correlationId,
      occurredAt: new Date().toISOString(),
      payload: { jobId, ...payload },
    });
  }
}

function normalizeRetryPolicy(policy?: RetryPolicy): Required<RetryPolicy> {
  return {
    maxAttempts: policy?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    backoffMs: policy?.backoffMs ?? DEFAULT_BACKOFF_MS,
  };
}

function validateDefinition<Input>(
  definition: JobDefinition<Input>,
  retryPolicy: Required<RetryPolicy>,
): void {
  if (definition.id.trim() === '') {
    throw new AaeError({
      code: 'INPUT_INVALID',
      kind: 'validation',
      retryable: false,
      message: 'Job id must not be empty',
      safeMessage: 'Job definition is invalid',
    });
  }

  if (!Number.isInteger(definition.timeoutMs) || definition.timeoutMs <= 0) {
    throw new AaeError({
      code: 'INPUT_INVALID',
      kind: 'validation',
      retryable: false,
      message: 'Job timeout must be a positive integer',
      safeMessage: 'Job definition is invalid',
    });
  }

  if (!Number.isInteger(retryPolicy.maxAttempts) || retryPolicy.maxAttempts <= 0) {
    throw new AaeError({
      code: 'INPUT_INVALID',
      kind: 'validation',
      retryable: false,
      message: 'Job maxAttempts must be a positive integer',
      safeMessage: 'Job definition is invalid',
    });
  }

  if (!Number.isInteger(retryPolicy.backoffMs) || retryPolicy.backoffMs < 0) {
    throw new AaeError({
      code: 'INPUT_INVALID',
      kind: 'validation',
      retryable: false,
      message: 'Job backoffMs must be a non-negative integer',
      safeMessage: 'Job definition is invalid',
    });
  }
}

function createTimeoutError(timeoutMs: number): AaeError {
  return new AaeError({
    code: 'TIMEOUT',
    kind: 'timeout',
    retryable: true,
    message: `Job timed out after ${timeoutMs}ms`,
    safeMessage: 'Job timed out',
  });
}

function createCancellationError(): AaeError {
  return new AaeError({
    code: 'CANCELLED',
    kind: 'cancelled',
    retryable: false,
    message: 'Job was cancelled',
    safeMessage: 'Job was cancelled',
  });
}

interface CancellablePromise<T> {
  readonly promise: Promise<T>;
  cancel(): void;
}

function createTimeoutPromise<T>(
  timeoutMs: number,
  createError: () => Error,
  onTriggered?: () => void,
): CancellablePromise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const promise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(createError());
      onTriggered?.();
    }, timeoutMs);
  });

  return {
    promise,
    cancel: (): void => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    },
  };
}

function createCancellationPromise<T>(
  signal: AbortSignal | undefined,
  createError: () => Error,
  onTriggered?: () => void,
): CancellablePromise<T> {
  let listener: (() => void) | undefined;
  const promise = new Promise<T>((_, reject) => {
    if (signal === undefined) {
      return;
    }

    listener = (): void => {
      reject(createError());
      onTriggered?.();
    };
    if (signal.aborted) {
      listener();
      return;
    }
    signal.addEventListener('abort', listener, { once: true });
  });

  return {
    promise,
    cancel: (): void => {
      if (signal !== undefined && listener !== undefined) {
        signal.removeEventListener('abort', listener);
      }
    },
  };
}

async function delay(milliseconds: number, signal?: AbortSignal): Promise<void> {
  if (milliseconds === 0) {
    return;
  }

  let timerId: ReturnType<typeof setTimeout> | undefined;
  const timer = new Promise<void>((resolve) => {
    timerId = setTimeout(resolve, milliseconds);
  });
  const cancellation = createCancellationPromise<void>(signal, createCancellationError);

  try {
    await Promise.race([timer, cancellation.promise]);
  } finally {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    cancellation.cancel();
  }
}
