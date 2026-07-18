# Operational Backlog

**Источник задач:** `docs/core/01_MASTER_PLAN.md`.

Backlog содержит только декомпозированные задачи active roadmap stage. Он не
заменяет Roadmap и не содержит будущие product ideas.

## Закрыто

- [x] Repository and documentation initialization.
- [x] Project Memory System.
- [x] Project Baseline 0.1.

## Разрешено к планированию

### Этап 1 — Engineering Foundation

- [x] TASK-001: создать воспроизводимый Node.js/TypeScript project scaffold.
- [x] TASK-002: настроить strict type check, formatter и linter.
- [x] TASK-003: настроить test runner и базовую test matrix.
- [x] TASK-004: настроить CI quality gates.
- [x] TASK-005: создать утверждённую физическую структуру `src/` и `tests/`
      без production modules.

### Этап 2 — Cross-cutting Runtime

- [x] TASK_AE_007: реализовать Config contract и безопасный environment loader.
- [x] TASK_AE_008: реализовать Logger/Events contract, JSON logger и redaction.
- [x] TASK_AE_009: реализовать Error taxonomy и safe failure classification.
- [x] TASK_AE_010: реализовать Execution Engine с lifecycle, timeout, cancellation,
      retry и demo CLI.
- [x] TASK_AE_011: реализовать Browser port и Playwright adapter с isolated context
      и graceful cleanup.

### Этап 5 — Runtime Resources

- [x] TASK_AE_012: утвердить storage/key policy и реализовать Profile Store,
      Network Resource, validation и isolation tests.

### Этап 6 — First Authorised Module

- [x] TASK_AE_013: реализовать Local Smoke module для контролируемого local target.

### Этап 7 — System Verification

- [x] TASK_AE_014: выполнены fault-injection, security verification, dependency
      audit и remote CI release gate (PR #1, GitHub Actions green).

### Этап 8 — Release 0.1

- [ ] TASK_AE_015: опубликовать подтверждённый 0.1 source как tag и GitHub
      Release с install/run guide и known limitations.

Следующая задача создаётся только из active roadmap stage и после выполнения
переходного критерия текущего этапа.
