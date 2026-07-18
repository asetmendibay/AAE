import { AaeError } from '../../core/errors/aae-error.js';
import type { BrowserPort, BrowserSession } from '../../core/browser/browser.types.js';
import type { JobExecutor, JobExecutionContext } from '../../core/execution/job.types.js';

export interface LocalSmokeInput {
  readonly expectedTitle: string;
}

export interface LocalSmokeOutput {
  readonly verifiedTitle: string;
}

export const LOCAL_SMOKE_URL =
  'data:text/html,<title>AAE Local Smoke</title><main>Authorized local verification target</main>';

export class LocalSmokeModule implements JobExecutor<LocalSmokeInput, LocalSmokeOutput> {
  public constructor(private readonly browser: BrowserPort) {}

  public async execute(context: JobExecutionContext<LocalSmokeInput>): Promise<LocalSmokeOutput> {
    let session: BrowserSession | undefined;
    let sessionClosed = false;
    let abortListener: (() => void) | undefined;
    const closeSession = async (): Promise<void> => {
      if (session === undefined || sessionClosed) {
        return;
      }

      sessionClosed = true;
      await session.close();
    };

    try {
      session = await this.browser.openSession({ headless: true, timeoutMs: 10_000 });
      abortListener = (): void => {
        void closeSession().catch(() => undefined);
      };
      context.signal.addEventListener('abort', abortListener, { once: true });

      if (context.signal.aborted) {
        throw createCancellationError();
      }

      const page = await session.openPage();
      await page.goto(LOCAL_SMOKE_URL);
      const title = await page.title();
      await page.close();

      if (context.signal.aborted) {
        throw createCancellationError();
      }

      if (title !== context.input.expectedTitle) {
        throw new AaeError({
          code: 'MODULE_VERIFICATION_FAILED',
          kind: 'module',
          retryable: false,
          message: `Expected title ${context.input.expectedTitle} but received ${title}`,
          safeMessage: 'Local target verification failed',
        });
      }

      return { verifiedTitle: title };
    } finally {
      if (abortListener !== undefined) {
        context.signal.removeEventListener('abort', abortListener);
      }
      await closeSession();
    }
  }
}

function createCancellationError(): AaeError {
  return new AaeError({
    code: 'CANCELLED',
    kind: 'cancelled',
    retryable: false,
    message: 'Local smoke module was cancelled',
    safeMessage: 'Module was cancelled',
  });
}
