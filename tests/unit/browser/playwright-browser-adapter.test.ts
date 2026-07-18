import { describe, expect, it, vi } from 'vitest';
import type { Browser, BrowserContext, BrowserType } from 'playwright';

import { PlaywrightBrowserAdapter } from '../../../src/infrastructure/browser/playwright-browser-adapter.js';

describe('PlaywrightBrowserAdapter network resource', () => {
  it('passes one explicit validated proxy into its isolated browser launch', async () => {
    const closeBrowser = vi.fn(async (): Promise<void> => undefined);
    const closeContext = vi.fn(async (): Promise<void> => undefined);
    const setDefaultTimeout = vi.fn();
    const browser = {
      close: closeBrowser,
      newContext: async (): Promise<BrowserContext> =>
        ({ close: closeContext, setDefaultTimeout }) as unknown as BrowserContext,
    } as unknown as Browser;
    const launch = vi.fn(async (): Promise<Browser> => browser);
    const browserType = { launch } as unknown as BrowserType;
    const adapter = new PlaywrightBrowserAdapter(browserType);

    const session = await adapter.openSession({
      headless: true,
      timeoutMs: 5_000,
      network: {
        proxy: {
          protocol: 'https',
          host: 'proxy.example.test',
          port: 8443,
          credentials: { username: 'user', password: 'not-logged' },
        },
      },
    });

    expect(launch).toHaveBeenCalledWith({
      headless: true,
      timeout: 5_000,
      proxy: {
        server: 'https://proxy.example.test:8443',
        username: 'user',
        password: 'not-logged',
      },
    });
    await session.close();
    expect(closeContext).toHaveBeenCalledOnce();
    expect(closeBrowser).toHaveBeenCalledOnce();
  });

  it('closes the launched browser when isolated context creation fails', async () => {
    const closeBrowser = vi.fn(async (): Promise<void> => undefined);
    const browser = {
      close: closeBrowser,
      newContext: async (): Promise<BrowserContext> => {
        throw new Error('context creation failed');
      },
    } as unknown as Browser;
    const browserType = {
      launch: vi.fn(async (): Promise<Browser> => browser),
    } as unknown as BrowserType;
    const adapter = new PlaywrightBrowserAdapter(browserType);

    await expect(adapter.openSession({ headless: true, timeoutMs: 5_000 })).rejects.toMatchObject({
      code: 'BROWSER_LAUNCH_FAILED',
      safeMessage: 'Browser could not be started',
    });
    expect(closeBrowser).toHaveBeenCalledOnce();
  });
});
