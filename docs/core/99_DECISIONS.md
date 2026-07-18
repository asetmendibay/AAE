# Журнал архитектурных решений (Decisions)

## 2026-07-18

### Решение №1: Отказ от Browser Automation Studio

**Причина:**

- Ограниченная масштабируемость;
- Сложность отладки;
- Неудобное сопровождение.

**Новое решение:**

- Строим Automation Engine на Node.js + Playwright с модульной архитектурой.

---

## 2026-07-18

### Решение №2: Project Baseline 0.1 и Architecture Freeze

**Статус:** Принято Product Owner в рамках `TASK — PROJECT BASELINE 0.1`.

**Контекст:** первоначальные документы определяли направление, но не задавали
единственную последовательность разработки, окончательные роли, workflow и
правила изменения baseline.

**Решение:**

- Версия 0.1 строится как локальный модульный монолит на Node.js, TypeScript и
  Playwright с направлением зависимостей к `core`.
- Зафиксированы слои `core`, `application`, `infrastructure`, `interfaces`,
  `modules` и `composition`, а также тестовые уровни.
- Execution engine с Job lifecycle является центром runtime; Playwright остаётся
  infrastructure adapter.
- Единственный workflow определён в `docs/core/11_WORKFLOW.md`.
- Постоянные роли команды определены в `docs/AI_TEAM/00_TEAM.md`.
- Project Roadmap 0.1 в `docs/core/01_MASTER_PLAN.md` — единственный источник
  новых задач.
- Изменения архитектуры, структуры каталогов, workflow, ролей, constitution и
  массовой документации после baseline требуют ADR либо явно зафиксированного
  решения Product Owner.

**Последствия:**

- Не допускается начинать runtime modules до Engineering Foundation.
- Внешние API, Dashboard, cloud и неутверждённые integrations исключены из
  scope 0.1.
- Детали, необходимые только для будущих roadmap stages, принимаются перед
  соответствующим этапом и не могут вводиться неявно в implementation task.

---

## 2026-07-18

### Решение №3: Profile storage и network resource policy

**Статус:** Принято Product Owner для Этапа 5.

**Решение:**

- Profile session data хранится только в encrypted filesystem blobs внутри
  `profiles/`.
- Применяется AES-256-GCM с уникальным random IV для каждой записи.
- Ключ берётся только из `AAE_PROFILE_ENCRYPTION_KEY` в canonical Base64 и
  обязан декодироваться в 32 bytes.
- Ключ, cookies и session data не записываются в Git, логи или diagnostics.
- Имена файлов строятся только из валидированного `profileId`; запись атомарна
  через temporary file и rename.
- Network resource — direct connection либо один explicit proxy на isolated
  browser session; proxy credentials не попадают в diagnostic events.

**Последствия:**

- Реализован `EncryptedFilesystemProfileStore` с правами доступа owner-only.
- Profile и proxy contracts остаются независимыми от site-specific modules.

---

## 2026-07-18

### Решение №4: Controlled target первого authorised module

**Статус:** Принято Product Owner в рамках самостоятельного выбора разрешённого
локального target.

**Решение:**

- Первый module — `Local Smoke`.
- Target — фиксированная локальная `data:` страница без внешней сети.
- Допустимые действия — открыть страницу и прочитать title.
- Авторизация, cookies, изменение внешних данных и site-specific integrations в
  этот module не входят.

**Последствия:**

- Вертикальный срез проверяет Job runtime, Browser Platform и safe result.
- Следующий module может быть создан только после отдельного target approval.
