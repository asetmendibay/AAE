# Module: Local Smoke

## Назначение

Контролируемый первый authorised module для проверки вертикального среза AAE.
Модуль открывает локальную `data:` страницу и проверяет её title.

## Разрешённые действия

- открыть фиксированный локальный target;
- прочитать title;
- вернуть безопасный результат в Job runtime.

Модуль не выполняет авторизацию, не меняет внешние данные, не использует
cookies/profiles и не обращается к внешним сайтам.

## Архитектура

`LocalSmokeModule` зависит только от `BrowserPort` и `JobExecutionContext`.
Прямого импорта Playwright в `src/modules/` нет.

## Запуск

```bash
npm run start -- --local-smoke
```

## Проверка

Integration tests проверяют успешный title verification, safe failure при
несовпадении ожидания и обязательное закрытие browser session при cancellation
во время navigation.
