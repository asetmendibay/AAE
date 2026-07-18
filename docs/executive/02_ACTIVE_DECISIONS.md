# Active Decisions

**Статус:** реестр действующих и открытых решений
**Дата обновления:** 2026-07-18

## 1. Уже зафиксированные решения

| ID    | Решение                                                         | Статус        | Основание                   |
| ----- | --------------------------------------------------------------- | ------------- | --------------------------- |
| D-001 | Отказ от Browser Automation Studio в пользу собственного движка | Зафиксировано | `docs/core/99_DECISIONS.md` |
| D-002 | Целевой стек: Node.js, TypeScript, npm и Playwright adapter     | Зафиксировано | Architecture Baseline       |
| D-003 | Модульный монолит с направлением зависимостей к core            | Зафиксировано | Architecture Baseline       |
| D-004 | Архитектурные изменения требуют согласования с Product Owner    | Действует     | AI Guide и правила команды  |
| D-005 | История и рабочая память проекта хранятся в Git и документации  | Действует     | Project Operating System    |
| D-006 | Постоянные роли, единый workflow и Architecture Freeze          | Зафиксировано | Решение №2                  |
| D-007 | Encrypted profile storage и explicit per-session proxy policy   | Зафиксировано | Решение №3                  |
| D-008 | Первый target — controlled Local Smoke module                   | Зафиксировано | Решение №4                  |

## 2. Stage-gated decisions

Следующие вопросы не блокируют Engineering Foundation, но должны быть приняты
до начала указанного этапа:

| Вопрос                                                    | Не позже этапа |
| --------------------------------------------------------- | -------------: |
| Формат Config/Logger contracts и error taxonomy           |              2 |
| Конкретные Job states и retry classification              |              3 |
| Diagnostic artifact format                                |              4 |
| Concrete profile storage и network resource configuration |     Решение №3 |
| Controlled target первого module                          |     Решение №4 |
| Release distribution mechanism                            |              8 |

## 3. Правило работы с решениями

- Stage-gated вопрос не является неявным разрешением на реализацию.
- Исполнитель задачи обязан явно указать, какое действующее решение использует.
- Новое архитектурное решение сначала обсуждается с Product Owner, затем
  фиксируется в `docs/core/99_DECISIONS.md`.
- Этот реестр — обзор; журнал решений остаётся историческим источником истины.
