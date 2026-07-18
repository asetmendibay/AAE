# Executive Context

**Статус:** утверждённый executive context
**Дата обновления:** 2026-07-18
**Назначение:** краткая точка входа для Product Owner, Repository Chief Engineer, Independent Architecture Advisor и новых участников.

## 1. Что такое Automation Engine

Automation Engine (AAE) — долгосрочный проект модульного движка браузерной автоматизации на Node.js, TypeScript и Playwright. Цель проекта — создать контролируемую, расширяемую и поддерживаемую платформу, а не набор разрозненных скриптов.

Продуктовая цель и инженерные принципы остаются источниками истины в документах `docs/core/`. Этот файл не заменяет их и не принимает новых архитектурных решений.

## 2. Текущий контекст

Реализован vertical slice версии 0.1: strict TypeScript runtime, Execution
Engine, isolated Playwright adapter, encrypted Profile Store и controlled Local
Smoke module. Локальная System Verification завершена; перед release candidate
нужен remote green GitHub Actions для текущих изменений.

## 3. Порядок чтения

1. Этот документ — цель проекта и границы текущего контекста.
2. `06_PROJECT_BASELINE_0_1.md` — карта канонических источников.
3. `01_CURRENT_STATE.md` — проверяемая фактическая картина.
4. `02_ACTIVE_DECISIONS.md` — действующие и stage-gated решения.
5. `03_NEXT_TARGET.md` — ближайшая целевая веха.
6. `docs/core/01_MASTER_PLAN.md`, `02_ARCHITECTURE.md` и `11_WORKFLOW.md`.
7. Собственная constitution и task specification.

_Примечание:_ Для роли Independent Architecture Advisor (ChatGPT) порядок восстановления контекста определён отдельно в [ChatGPT Context Layer](../chatgpt_context/00_README_FOR_CHATGPT.md).

## 4. Полномочия и границы

- Product Owner утверждает продуктовые и архитектурные решения.
- Repository Chief Engineer (основной инженер проекта) ведёт task от roadmap до merge.
- Independent Architecture Advisor даёт независимую оценку, но не принимает решение и не управляет репозиторием.
- Этот каталог не заменяет журнал архитектурных решений `docs/core/99_DECISIONS.md`.

## 5. Источник истины (Source of Truth)

В проекте действует строгое соподчинение источников истины (от абсолютного к производному):

```
Git Repository
↓
Documentation
↓
Executive Context
↓
ChatGPT Context Layer
↓
AI Sessions
```

История чатов никогда не считается источником истины.

## 6. Неподлежащие интерпретации правила

- Документ не является разрешением на изменение baseline.
- Отсутствие решения не следует трактовать как выбор варианта по умолчанию.
- Источником фактов служат репозиторий, утверждённые решения и результаты проверок, а не история чатов.
