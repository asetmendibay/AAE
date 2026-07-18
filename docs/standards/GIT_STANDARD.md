# Git Standard (Стандарты Git)

## 1. Ветки (Branches)

- **`main`** — защищённая стабильная ветка. Прямые коммиты запрещены.
- **`feature/[task-id]-[short-description]`** — ветка для roadmap-задачи (например, `feature/AE-006-git-standard`).
- **`fix/[task-id]-[short-description]`** — ветка для исправления ошибок.
- **`docs/[task-id]-[short-description]`** — ветка для документальной задачи.

---

## 2. Commit Messages (Спецификация коммитов)

Все коммиты должны соответствовать спецификации **Conventional Commits**:

Шаблон: `<type>(<scope>): <description>`

### Типы (Types):

- **`feat`** — добавление нового функционала (кода).
- **`fix`** — исправление багов в коде.
- **`docs`** — изменения в документации (включая воркспейс).
- **`refactor`** — изменение структуры кода без изменения его поведения.
- **`test`** — добавление или изменение тестов.
- **`chore`** — рутинные задачи, конфиги (например, обновление `.gitignore`).

### Примеры:

- `docs(standards): create git workflow and naming guidelines`
- `feat(config): implement environment variable validator`

---

## 3. Слияние веток (Merge Pipeline)

- Pull request должен соответствовать Unified Development Workflow.
- До merge проходят все применимые quality gates, предусмотренные task
  specification.
- External Review выполняет Claude; Product Owner даёт final approval.
- Merge в `main` выполняет Repository Chief Engineer после approval и green
  checks.
