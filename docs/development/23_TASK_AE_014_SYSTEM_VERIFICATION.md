# TASK_AE_014: System Verification

## Статус

System Verification завершена 2026-07-18. GitHub Actions run
`29650764469` завершился green: Playwright install, quality gates, production
dependency audit и build прошли на PR #1.

## Scope

Проверен вертикальный срез 0.1: Execution Engine, Playwright Browser Platform,
Runtime Resources и controlled Local Smoke module. Новые external targets,
profiles с реальными cookies и site-specific automation не добавлялись.

## Fault and recovery matrix

| Сценарий                                         | Ожидаемое безопасное поведение                                      | Evidence                                     |
| ------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------- |
| Timeout одновременно с ответом executor на abort | Job заканчивается `TIMEOUT`, поздний result не становится success   | `execution-engine.test.ts`                   |
| Cancellation во время retry backoff              | Второй attempt не начинается; result `cancelled`                    | `execution-engine.test.ts`                   |
| Cancellation Local Smoke во время navigation     | Browser session закрывается ровно один раз; result `cancelled`      | `local-smoke.module.test.ts`                 |
| Ошибка создания browser context                  | Уже запущенный browser закрывается; возвращается safe browser error | `playwright-browser-adapter.test.ts`         |
| Corrupted encrypted profile                      | Возвращается `PROFILE_DECRYPTION_FAILED` без contents blob          | `encrypted-filesystem-profile-store.test.ts` |

## Security verification

- Profile data сохраняются в AES-256-GCM envelope; plaintext не остаётся в
  файле, права файла owner-only (`0600`).
- Profile ID валидируется против path traversal; profiles изолированы.
- Proxy credentials, tokens и `AAE_PROFILE_ENCRYPTION_KEY` redacted в structured
  logs и safe failure classification.
- Fixtures используют synthetic data; `profiles/`, `logs/` и `temp/` исключены
  из Git.

## Dependency audit

На Node.js 20.20.2 последовательно выполнены `npm run quality:check`, `npm run
build`, `npm run audit:prod` и `npm run start -- --local-smoke`. Quality suite:
12 test files / 33 tests green; audit: `0 vulnerabilities` при пороге
high/critical. Audit включён в GitHub Actions workflow после quality gates.

## Release checklist

- [x] `npm run quality:check` проходит локально.
- [x] `npm run build` проходит локально.
- [x] `npm run audit:prod` не находит production vulnerabilities high/critical.
- [x] Local Smoke запускается без внешней сети и возвращает safe result.
- [x] Failure/recovery и security matrix документированы.
- [x] Support runbook определён ниже.
- [x] Текущие изменения отправлены в remote и GitHub Actions завершился green.
- [x] Product Owner подтвердил release candidate и состав версии 0.1.

## Support runbook

### Перед запуском

1. Использовать Node.js 20+ и выполнить `npm ci`.
2. Для browser integration установить Chromium: `npx playwright install chromium`.
3. Никогда не добавлять реальные cookies, profile blobs, ключи или proxy
   credentials в Git, fixtures или CLI arguments.
4. Для Profile Store задавать `AAE_PROFILE_ENCRYPTION_KEY` только через
   защищённый runtime environment; значение — canonical Base64 для 32 bytes.

### Диагностика и восстановление

1. Запустить `npm run quality:check`, затем `npm run audit:prod`.
2. Проверить controlled vertical slice: `npm run start -- --local-smoke`.
3. При `TIMEOUT` или `CANCELLED` не переиспользовать уже закрытую browser
   session; создать новый Job с явно утверждённой retry policy.
4. При `PROFILE_DECRYPTION_FAILED` не пытаться вручную править blob: удалить
   только затронутый validated profile через `ProfileStore` и создать новую
   session по разрешённой процедуре.
5. Если в diagnostics замечен secret, остановить публикацию logs, отозвать
   credential и добавить regression test для redaction до возобновления работы.

## Baseline impact

Architecture Baseline не изменён. Усилены уже утверждённые lifecycle и
redaction boundaries; external API и site-specific integrations остаются вне
scope 0.1.
