# TASK_AE_007: Config foundation

## Статус

Завершено — Этап 2, первый cross-cutting contract.

## Цель

Создать минимальный типизированный контракт runtime-конфигурации, который не
зависит от Playwright, файловой системы или конкретного интерфейса запуска.

## Контракт

`loadConfig()` читает только следующие environment variables:

| Переменная               | Значение по умолчанию | Допустимые значения                 |
| ------------------------ | --------------------- | ----------------------------------- |
| `AAE_ENVIRONMENT`        | `development`         | `development`, `test`, `production` |
| `AAE_LOG_LEVEL`          | `info`                | `debug`, `info`, `warn`, `error`    |
| `AAE_DEFAULT_TIMEOUT_MS` | `30000`               | положительное целое число           |

Ошибки конфигурации агрегируются в `ConfigValidationError`. Значения ошибочных
переменных не включаются в текст ошибки.

## Baseline impact

- Architecture baseline не изменяется.
- Секреты и session data не добавляются в конфигурационный контракт.
- Реализация не логирует окружение и не читает внешние ресурсы.

## Проверка

```bash
npm run quality:check
npm run build
```
