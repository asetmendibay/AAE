# TASK_AE_009: Error taxonomy

## Статус

Завершено — Этап 2, failure classification contract.

## Контракт

Каждая известная ошибка AAE содержит:

- `code` — машинно-обрабатываемый код;
- `kind` — категория ошибки;
- `retryable` — явный признак допустимости retry;
- `safeMessage` — сообщение, безопасное для user-facing результата.

Поддерживаемые категории: `configuration`, `validation`, `timeout`, `cancelled`,
`dependency` и `unexpected`.

Неизвестные ошибки классифицируются как `UNEXPECTED_FAILURE`, не повторяются
автоматически и не передают исходный текст наружу.

`ConfigValidationError` теперь является частью общей иерархии `AaeError`.

## Ограничение этапа

Конкретная политика количества retry и правила повторения Job остаются задачей
Этапа 3. Этот контракт только передаёт классификацию.

## Проверка

```bash
npm run quality:check
npm run build
```
