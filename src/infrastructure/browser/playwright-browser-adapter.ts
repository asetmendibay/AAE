import {
  chromium,
  type Browser,
  type BrowserContext,
  type BrowserType,
  type Page,
} from 'playwright';

import { validateNetworkResource } from '../../application/resources/validate-resources.js';
import { AaeError } from '../../core/errors/aae-error.js';
import type {
  BrowserOptions,
  BrowserPage,
  BrowserPort,
  BrowserSession,
} from '../../core/browser/browser.types.js';

export class PlaywrightBrowserAdapter implements BrowserPort {
  public constructor(private readonly browserType: BrowserType = chromium) {}

  public async openSession(options: BrowserOptions): Promise<BrowserSession> {
    let browser: Browser | undefined;

    try {
      if (options.network !== undefined) {
        validateNetworkResource(options.network);
      }

      browser = await this.browserType.launch({
        headless: options.headless,
        timeout: options.timeoutMs,
        ...(options.network?.proxy === undefined
          ? {}
          : {
              proxy: {
                server: `${options.network.proxy.protocol}://${options.network.proxy.host}:${options.network.proxy.port}`,
                ...(options.network.proxy.credentials === undefined
                  ? {}
                  : {
                      username: options.network.proxy.credentials.username,
                      password: options.network.proxy.credentials.password,
                    }),
              },
            }),
      });
      const context = await browser.newContext();
      context.setDefaultTimeout(options.timeoutMs);
      return new PlaywrightBrowserSession(browser, context);
    } catch (error) {
      if (browser !== undefined) {
        await browser.close().catch(() => undefined);
      }
      throw new AaeError({
        code: 'BROWSER_LAUNCH_FAILED',
        kind: 'browser',
        retryable: true,
        message: 'Playwright browser session could not be launched',
        safeMessage: 'Browser could not be started',
        cause: error,
      });
    }
  }
}

class PlaywrightBrowserSession implements BrowserSession {
  private closed = false;

  public constructor(
    private readonly browser: Browser,
    private readonly context: BrowserContext,
  ) {}

  public async openPage(): Promise<BrowserPage> {
    this.ensureOpen();
    const page = await this.context.newPage();
    return new PlaywrightBrowserPage(page);
  }

  public async close(): Promise<void> {
    if (this.closed) {
      return;
    }

    this.closed = true;
    let contextError: unknown;

    try {
      await this.context.close();
    } catch (error) {
      contextError = error;
    }

    try {
      await this.browser.close();
    } catch (error) {
      if (contextError === undefined) {
        throw createCleanupError(error);
      }
      throw createCleanupError(new AggregateError([contextError, error]));
    }

    if (contextError !== undefined) {
      throw createCleanupError(contextError);
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new AaeError({
        code: 'BROWSER_SESSION_CLOSED',
        kind: 'browser',
        retryable: false,
        message: 'Browser session is already closed',
        safeMessage: 'Browser session is closed',
      });
    }
  }
}

function createCleanupError(cause: unknown): AaeError {
  return new AaeError({
    code: 'BROWSER_CLEANUP_FAILED',
    kind: 'browser',
    retryable: false,
    message: 'Browser session cleanup failed',
    safeMessage: 'Browser cleanup failed',
    cause,
  });
}

class PlaywrightBrowserPage implements BrowserPage {
  public constructor(private readonly page: Page) {}

  public async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  public async title(): Promise<string> {
    return this.page.title();
  }

  public async close(): Promise<void> {
    await this.page.close();
  }
}
