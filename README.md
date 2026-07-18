# Automation Engine (AAE)

Automation Engine — модульная платформа разрешённой браузерной автоматизации на
Node.js, TypeScript и Playwright. Реализован вертикальный срез 0.1: execution
engine, isolated Playwright browser session, encrypted profile store и
контролируемый Local Smoke module.

---

## 📂 Структура проекта

```
Automation Engine/
├── docs/
│   ├── executive/      # Точка входа, состояние и baseline
│   ├── core/           # Vision, roadmap, architecture, workflow и decisions
│   ├── development/    # Active backlog, module/API specs и журналы
│   ├── standards/      # Нормы Git, кода, документации и workspace
│   ├── templates/      # Канонические task, ADR и module templates
│   └── AI_TEAM/        # Постоянные роли, handoff и constitutions
├── src/                # Исходный код по Architecture Baseline
├── tests/              # Unit, contract и integration tests
├── scripts/            # Вспомогательные скрипты разработки
├── workspace/          # Ежедневный рабочий воркспейс участников и ИИ
├── archive/            # Архив завершенных дневных задач
├── profiles/           # Сессии и куки сохраненных профилей браузера
├── logs/               # Файлы логов выполнения
└── temp/               # Временные файлы и кэш
```

---

## Документация

Начните с [Project Baseline 0.1](docs/executive/06_PROJECT_BASELINE_0_1.md),
затем прочитайте [Project Roadmap 0.1](docs/core/01_MASTER_PLAN.md),
[Architecture Baseline](docs/core/02_ARCHITECTURE.md) и
[Unified Development Workflow](docs/core/11_WORKFLOW.md).

Для быстрого восстановления контекста ChatGPT при начале архитектурной сессии используйте [ChatGPT Context Layer](docs/chatgpt_context/00_README_FOR_CHATGPT.md).

Полный порядок чтения для участников определён в
[AI Guide](docs/core/05_AI_GUIDE.md).

---

## Статус разработки

Репозиторий подготовлен к Release 0.1. Этапы 1–7 завершены, включая
fault-injection, security verification, dependency audit и GitHub Actions CI.
Поддерживаемая граница версии — controlled Local Smoke scenario без внешней
сети и site-specific integrations.

Локальные quality gates:

```bash
npm ci
npm run quality:check
npm run audit:prod
npm run build
```

Локальный controlled smoke scenario (не обращается к внешней сети):

```bash
npm run start -- --local-smoke
```

Новые задачи создаются только из [Operational Backlog](docs/development/06_BACKLOG.md)
и выполняются по [Git Standard](docs/standards/GIT_STANDARD.md).

Подробные требования установки, run guide и known limitations — в
[Release 0.1 guide](docs/development/24_RELEASE_0_1.md).
