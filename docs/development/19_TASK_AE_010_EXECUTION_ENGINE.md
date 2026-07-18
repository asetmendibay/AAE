# TASK_AE_010: Execution Engine foundation

## Статус

Завершено — Этап 3.

## Контракт

- `JobDefinition` содержит id, input, timeout и retry policy.
- Lifecycle: `queued → running → succeeded|failed|cancelled`.
- `maxAttempts` означает общее число попыток, включая первую.
- Retry выполняется только для ошибок с `retryable: true`.
- Timeout и cancellation передаются executor через `AbortSignal`.
- `JobResult` возвращает terminal status, attempts, optional output и safe failure.
- Event payloads не содержат Job input/output.
- Composition связывает engine с ConsoleLogger и ConsoleEventPublisher.
- CLI поддерживает демонстрационный запуск: `npm run start -- --demo`.

## Baseline impact

Architecture baseline не изменяется. Execution Engine не импортирует Playwright и
не зависит от внешних browser adapters.

## Проверка

```bash
npm run quality:check
npm run build
npm run start -- --demo
```
