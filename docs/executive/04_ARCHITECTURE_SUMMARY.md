# Architecture Summary

**Статус:** executive summary утверждённого Architecture Baseline 0.1
**Дата обновления:** 2026-07-18

## 1. Заявленная модель

Automation Engine строится как модульный монолит на Node.js и TypeScript.
Playwright рассматривается как интеграция для управления браузером, а не как
модель всей системы. Модули должны иметь низкую связанность, а внешние API —
быть изолированы интерфейсами.

## 2. Ожидаемые области ответственности

| Область                  | Назначение                                      | Текущий статус       |
| ------------------------ | ----------------------------------------------- | -------------------- |
| Core / Application       | Ports, contracts, Job lifecycle и orchestration | Не реализована       |
| Config / Logger / Errors | Configuration, events, correlation и redaction  | Завершены на Этапе 2 |
| Execution Engine / CLI   | Job lifecycle и первый интерфейс запуска        | Этап 3               |
| Browser Adapter          | Playwright lifecycle и isolated context         | Этап 4               |
| Runtime Resources        | Profiles, network resources и session lifecycle | Этап 5               |
| First Module             | Один разрешённый сквозной сценарий              | Этап 6               |

## 3. Инварианты, уже отражённые в правилах проекта

- В бизнес-логике не должно быть прямой зависимости от сторонних библиотек.
- Настройки не хранятся в коде.
- Ошибки логируются и не замалчиваются.
- Не используются координаты интерфейса и необоснованные фиксированные ожидания.
- Модули не получают зависимости друг от друга без необходимости.

## 4. Что ещё не определено

Concrete contracts, persistence details и resource formats принимаются только
перед соответствующим roadmap stage. Они не могут вводиться неявно в task.

## 5. Связь с detailed architecture

Подробная архитектура определена в `docs/core/02_ARCHITECTURE.md`. Этот summary
предназначен только для быстрого восстановления контекста.
