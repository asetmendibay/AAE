# Release 0.1

## Статус

Release candidate подтверждён Product Owner. Этот документ определяет
поддерживаемую границу, установку и запуск immutable версии `v0.1.0`.

## Поддерживаемая граница

- Node.js 20+; CI evidence получен на Node.js 20.20.2.
- TypeScript runtime с Execution Engine, retry, timeout, cancellation,
  structured logging и safe failure results.
- Isolated Playwright Chromium sessions и encrypted filesystem Profile Store.
- Controlled Local Smoke scenario: локальная `data:` page, чтение title, без
  внешней сети.

## Установка и проверка

```bash
npm ci
npx playwright install chromium
npm run quality:check
npm run audit:prod
npm run build
npm run start -- --local-smoke
```

Ожидаемый terminal result Local Smoke: `{"jobId":"local-smoke-job","status":"succeeded","attempts":1}`.

## Secrets и profiles

- Не передавать `AAE_PROFILE_ENCRYPTION_KEY`, cookies или proxy credentials в
  CLI arguments, fixtures или Git.
- Для Profile Store key задаётся только через runtime environment: canonical
  Base64 для 32 bytes.
- Corrupted profile не редактируется вручную: удалить только validated profile
  через `ProfileStore` и создать новую session.

## Known limitations

- Нет external API, Dashboard, cloud sync или неутверждённых integrations.
- Нет site-specific modules, external login flow и работы с реальными cookies.
- Local Smoke — единственный авторизованный end-to-end target версии 0.1.
- CI предупреждает, что GitHub internally запускает actions на Node 24 из-за
  platform deprecation; project setup и tests по-прежнему используют Node 20.

## Release evidence

- PR #1, GitHub Actions runs `29650764469` и `29650857617`: green.
- 12 test files / 33 tests, build и production dependency audit: green.
- Verification matrix и support runbook: `23_TASK_AE_014_SYSTEM_VERIFICATION.md`.
