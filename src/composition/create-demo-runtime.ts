import { ExecutionEngine } from '../application/execution/execution-engine.js';
import type { JobExecutor } from '../core/execution/job.types.js';
import { ConsoleEventPublisher } from '../infrastructure/events/console-event-publisher.js';
import { ConsoleLogger } from '../infrastructure/logging/console-logger.js';

export interface DemoJobInput {
  readonly message: string;
}

export interface DemoJobOutput {
  readonly echoedMessage: string;
}

export function createDemoRuntime(): ExecutionEngine<DemoJobInput, DemoJobOutput> {
  const logger = new ConsoleLogger();
  const executor: JobExecutor<DemoJobInput, DemoJobOutput> = {
    execute: async ({ input }): Promise<DemoJobOutput> => ({ echoedMessage: input.message }),
  };

  return new ExecutionEngine(executor, {
    logger,
    events: new ConsoleEventPublisher(logger),
  });
}
