# Git Standard (Стандарты Git)

## 1. Ветки (Branches)
* **`main`** — стабильная ветка. Прямые коммиты в main разрешены только для исправления опечаток в документах. Код вливается через Pull Requests.
* **`feature/[task-id]-[short-description]`** — ветка для новых фич (например, `feature/AE-006-git-standard`).
* **`fix/[task-id]-[short-description]`** — ветка для исправления ошибок.

---

## 2. Commit Messages (Спецификация коммитов)
Все коммиты должны соответствовать спецификации **Conventional Commits**:

Шаблон: `<type>(<scope>): <description>`

### Типы (Types):
* **`feat`** — добавление нового функционала (кода).
* **`fix`** — исправление багов в коде.
* **`docs`** — изменения в документации (включая воркспейс).
* **`refactor`** — изменение структуры кода без изменения его поведения.
* **`test`** — добавление или изменение тестов.
* **`chore`** — рутинные задачи, конфиги (например, обновление `.gitignore`).

### Примеры:
* `docs(standards): create git workflow and naming guidelines`
* `feat(config): implement environment variable validator`

---

## 3. Слияние веток (Merge Pipeline)
* Перед слиянием любой ветки feature/fix в main должен быть запущен тест-пакет (`npm test`).
* Слияние производится только после проведения Code Review со стороны **Claude** (Senior Engineer) и одобрения **ChatGPT** (Chief Architect).
