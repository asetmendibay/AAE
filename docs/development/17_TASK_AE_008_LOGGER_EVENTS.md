# TASK_AE_008: Logger and Events foundation

## Статус

Завершено — Этап 2, structured observability contract.

## Контракт

- `Logger` принимает level-specific сообщения и структурированный context.
- `RuntimeEvent` содержит `name`, `correlationId`, `occurredAt` и optional payload.
- `EventPublisher` публикует события без зависимости от конкретного logger.
- `ConsoleLogger` выводит JSON records через injected `ConsoleSink`.
- Чувствительные ключи (`password`, `secret`, `token`, `cookie`, `session`,
  `authorization`, `apiKey`) и распространённые текстовые формы секретов
  заменяются на `[REDACTED]`.

## Baseline impact

Architecture baseline не изменяется. Playwright, Job Engine и внешние logging
dependencies не добавляются.

## Проверка

```bash
npm run quality:check
npm run build
```
