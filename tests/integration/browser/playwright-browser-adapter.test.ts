import { describe, expect, it } from 'vitest';

import { PlaywrightBrowserAdapter } from '../../../src/infrastructure/browser/playwright-browser-adapter.js';

describe('PlaywrightBrowserAdapter', () => {
  it('launches an isolated session, opens a page and cleans up idempotently', async () => {
    const adapter = new PlaywrightBrowserAdapter();
    const session = await adapter.openSession({ headless: true, timeoutMs: 10_000 });
    const page = await session.openPage();

    await page.goto('data:text/html,<title>AAE Browser Test</title>');
    await expect(page.title()).resolves.toBe('AAE Browser Test');

    await page.close();
    await session.close();
    await expect(session.close()).resolves.toBeUndefined();
    await expect(session.openPage()).rejects.toMatchObject({ code: 'BROWSER_SESSION_CLOSED' });
  }, 30_000);
});
