import { ExecutionEngine } from '../application/execution/execution-engine.js';
import { ConsoleEventPublisher } from '../infrastructure/events/console-event-publisher.js';
import { PlaywrightBrowserAdapter } from '../infrastructure/browser/playwright-browser-adapter.js';
import { ConsoleLogger } from '../infrastructure/logging/console-logger.js';
import { LocalSmokeModule } from '../modules/local-smoke/local-smoke.module.js';

export function createLocalSmokeRuntime(): ExecutionEngine<
  { readonly expectedTitle: string },
  { readonly verifiedTitle: string }
> {
  const logger = new ConsoleLogger();
  const browser = new PlaywrightBrowserAdapter();
  const module = new LocalSmokeModule(browser);

  return new ExecutionEngine(module, {
    logger,
    events: new ConsoleEventPublisher(logger),
  });
}
