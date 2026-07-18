import { describe, expect, it, vi } from 'vitest';

import { ExecutionEngine } from '../../../src/application/execution/execution-engine.js';
import type { BrowserPort, BrowserSession } from '../../../src/core/browser/browser.types.js';
import type { EventPublisher } from '../../../src/core/observability/event.types.js';
import type { Logger } from '../../../src/core/observability/logger.types.js';
import { PlaywrightBrowserAdapter } from '../../../src/infrastructure/browser/playwright-browser-adapter.js';
import { LocalSmokeModule } from '../../../src/modules/local-smoke/local-smoke.module.js';

const logger: Logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

const events: EventPublisher = { publish: (): void => undefined };

describe('LocalSmokeModule', () => {
  it('verifies the controlled local target through the BrowserPort', async () => {
    const module = new LocalSmokeModule(new PlaywrightBrowserAdapter());

    await expect(
      module.execute({
        jobId: 'local-smoke-test',
        input: { expectedTitle: 'AAE Local Smoke' },
        attempt: 1,
        correlationId: 'local-smoke-test',
        signal: new AbortController().signal,
      }),
    ).resolves.toEqual({ verifiedTitle: 'AAE Local Smoke' });
  }, 30_000);

  it('returns a safe failure when the verification expectation is wrong', async () => {
    const module = new LocalSmokeModule(new PlaywrightBrowserAdapter());

    await expect(
      module.execute({
        jobId: 'local-smoke-failure-test',
        input: { expectedTitle: 'Wrong title' },
        attempt: 1,
        correlationId: 'local-smoke-failure-test',
        signal: new AbortController().signal,
      }),
    ).rejects.toMatchObject({
      code: 'MODULE_VERIFICATION_FAILED',
      safeMessage: 'Local target verification failed',
    });
  }, 30_000);

  it('closes its browser session when the execution is cancelled during navigation', async () => {
    let rejectNavigation: ((reason?: unknown) => void) | undefined;
    let navigationStarted: (() => void) | undefined;
    const navigation = new Promise<void>((_resolve, reject) => {
      rejectNavigation = reject;
    });
    const started = new Promise<void>((resolve) => {
      navigationStarted = resolve;
    });
    const close = vi.fn(async (): Promise<void> => {
      rejectNavigation?.(new Error('session closed by cancellation'));
    });
    const session: BrowserSession = {
      openPage: async () => ({
        goto: async (): Promise<void> => {
          navigationStarted?.();
          await navigation;
        },
        title: async (): Promise<string> => 'AAE Local Smoke',
        close: async (): Promise<void> => undefined,
      }),
      close,
    };
    const browser: BrowserPort = {
      openSession: async (): Promise<BrowserSession> => session,
    };
    const controller = new AbortController();
    const engine = new ExecutionEngine(new LocalSmokeModule(browser), { logger, events });
    const resultPromise = engine.run(
      {
        id: 'local-smoke-cancelled',
        input: { expectedTitle: 'AAE Local Smoke' },
        timeoutMs: 1_000,
      },
      controller.signal,
    );

    await started;
    controller.abort();

    await expect(resultPromise).resolves.toMatchObject({
      jobId: 'local-smoke-cancelled',
      status: 'cancelled',
      attempts: 1,
    });
    await vi.waitFor(() => expect(close).toHaveBeenCalledOnce());
  });
});
