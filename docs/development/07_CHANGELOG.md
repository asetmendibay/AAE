# Changelog (Журнал изменений)

## [0.1.0] — 2026-07-18

### Runtime implementation

- Реализованы этапы 1–6: Node.js/TypeScript toolchain, contracts runtime,
  Execution Engine, Playwright adapter, encrypted Profile Store и Local Smoke
  vertical slice.
- На Этапе 7 добавлены fault-injection tests для timeout/cancellation/retry и
  browser cleanup; `AAE_PROFILE_ENCRYPTION_KEY` redacted в diagnostics.
- Добавлены `audit:prod`, CI audit gate, system verification report и support
  runbook.

### Changed

- Project Vision ограничено scope версии 0.1: локальный execution runtime и
  один разрешённый сквозной сценарий.
- Master Plan преобразован в единственный Project Roadmap 0.1.
- Зафиксированы Architecture Baseline, Architecture Freeze и Unified
  Development Workflow.
- Постоянная AI Team переопределена: Product Owner, Repository Chief Engineer
  (Codex), Independent Architecture Advisor (ChatGPT), External Review (Claude)
  и External Research (Gemini).
- Стандарты Git, документации, task/ADR templates и operational documents
  приведены к baseline.

### Added

- Executive Project Baseline 0.1.
- Конституции Product Owner, ChatGPT, Claude и Gemini.

### Removed from scope 0.1

- Внешние API, Dashboard, cloud synchronization и неутверждённые integrations.

## [0.0.0] — 2026-07-18

### Added

- Инициализирован проект Automation Engine (AAE).
- Базовая документация в корне проекта: `00_PROJECT_VISION.md`, `00_RULE_ZERO.md`, `01_MASTER_PLAN.md`, `02_ARCHITECTURE.md`, `03_RULES.md`, `04_PROGRESS.md`, `05_AI_GUIDE.md`, `10_ENGINEERING_VALUES.md`, `11_WORKFLOW.md`, `99_DECISIONS.md`.
- Система управления проектом ([12_PROJECT_OPERATING_SYSTEM.md](../standards/12_PROJECT_OPERATING_SYSTEM.md)) [TASK_AE_001].
- Полная файловая структура каталогов (`docs/`, `src/`, `tests/`, `workspace/` и др.) и конфигурация Git ([.gitignore](../../.gitignore)).
- Ежедневный воркспейс `workspace/2026/07/Week_29/2026-07-18/`.
- Система оперативной памяти проекта (Project Memory System) [TASK_AE_002]:
  - [13_PROJECT_STATE.md](13_PROJECT_STATE.md) (текущее состояние).
  - [14_AI_CONTEXT.md](14_AI_CONTEXT.md) (контекст для ИИ).
  - [15_PROJECT_JOURNAL.md](15_PROJECT_JOURNAL.md) (журнал проекта).
  - [06_BACKLOG.md](06_BACKLOG.md) (бэклог задач).
  - [07_CHANGELOG.md](07_CHANGELOG.md) (этот файл).
  - [08_MODULES.md](08_MODULES.md) (описание модулей).
  - [09_API.md](09_API.md) (описание API).
