import type { EventPublisher } from '../observability/event.types.js';
import type { Logger } from '../observability/logger.types.js';
import type { FailureClassification } from '../errors/error.types.js';

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly backoffMs?: number;
}

export interface JobDefinition<Input = unknown> {
  readonly id: string;
  readonly input: Input;
  readonly timeoutMs: number;
  readonly retryPolicy?: RetryPolicy;
  readonly correlationId?: string;
}

export interface JobExecutionContext<Input = unknown> {
  readonly jobId: string;
  readonly input: Input;
  readonly attempt: number;
  readonly correlationId: string;
  readonly signal: AbortSignal;
}

export interface JobExecutor<Input = unknown, Output = unknown> {
  execute(context: JobExecutionContext<Input>): Promise<Output>;
}

export interface JobResult<Output = unknown> {
  readonly jobId: string;
  readonly status: Exclude<JobStatus, 'queued' | 'running'>;
  readonly attempts: number;
  readonly output?: Output;
  readonly failure?: FailureClassification;
}

export interface ExecutionEngineDependencies {
  readonly logger: Logger;
  readonly events: EventPublisher;
}
