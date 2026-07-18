# TASK_AE_011: Browser Platform foundation

## Статус

Завершено — Этап 4, lifecycle adapter.

## Контракт

- `BrowserPort`, `BrowserSession` и `BrowserPage` находятся в `core` и не
  импортируют Playwright.
- `PlaywrightBrowserAdapter` запускает Chromium только в infrastructure layer.
- Каждая session получает отдельный browser context.
- `close()` session идемпотентен и закрывает context и browser process.
- Операции page используют context timeout.
- Работа с закрытой session возвращает безопасную `BROWSER_SESSION_CLOSED` error.
- Ошибка запуска не раскрывает внутренние детали и классифицируется как
  retryable browser failure.

## Baseline impact

Architecture baseline не изменяется. Profile storage, cookies, proxy и
site-specific selectors остаются за пределами Этапа 4.

## Проверка

```bash
npx playwright install chromium
npm run quality:check
npm run build
```
