# Automation Engine (AAE)

**Automation Engine** — это модульный, масштабируемый движок автоматизации браузера на базе Node.js + Playwright + TypeScript, разработанный как надежная B2B-альтернатива визуальным средам автоматизации (BAS, ZennoPoster).

---

## 📂 Структура проекта

```
Automation Engine/
├── docs/               # Документация проекта (Базовые правила, роли ИИ, стандарты)
│   ├── core/           # Видение, мастер-план, прогресс и архитектура
│   ├── standards/      # Стандарты разработки, стиля кода, именования и Git
│   ├── templates/      # Шаблоны ТЗ, архитектурных решений, модулей
│   ├── AI_TEAM/        # Роли, правила и конституция ИИ-команды
│   └── development/    # Бэклог, чейнджлог, журналы проекта и текущий статус
├── src/                # Исходный код приложения
├── tests/              # Автоматические тесты (Unit, E2E)
├── scripts/            # Вспомогательные скрипты разработки
├── workspace/          # Ежедневный рабочий воркспейс участников и ИИ
├── archive/            # Архив завершенных дневных задач
├── profiles/           # Сессии и куки сохраненных профилей браузера
├── logs/               # Файлы логов выполнения
└── temp/               # Временные файлы и кэш
```

---

## 📚 Навигация по документации

Каждый участник команды (включая ИИ-помощников) должен начинать работу в строгом порядке, описанном в [docs/core/05_AI_GUIDE.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/05_AI_GUIDE.md):

1. **Контекст ИИ:** Изучите текущий стек и правила именования в [docs/development/14_AI_CONTEXT.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/development/14_AI_CONTEXT.md).
2. **Текущий статус:** Проверьте текущую задачу в [docs/development/13_PROJECT_STATE.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/development/13_PROJECT_STATE.md).
3. **Цели:** Ознакомьтесь с видением проекта в [docs/core/00_PROJECT_VISION.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/00_PROJECT_VISION.md).
4. **Правила кодирования:** Прочитайте правила [docs/core/03_RULES.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/03_RULES.md).
5. **Инженерные ценности:** Соблюдайте принципы [docs/core/10_ENGINEERING_VALUES.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/10_ENGINEERING_VALUES.md) и **Правило Ноль** в [docs/core/00_RULE_ZERO.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/00_RULE_ZERO.md).

---

## 🚀 Как начать работу

1. Установите зависимости (Node.js v20+):
   ```bash
   npm install
   ```
2. Изучите бэклог задач в [docs/development/06_BACKLOG.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/development/06_BACKLOG.md).
3. Создайте ветку под задачу в соответствии с [docs/standards/GIT_STANDARD.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/standards/GIT_STANDARD.md).
4. Весь рабочий процесс ведется в папках ежедневного воркспейса ([docs/standards/12_PROJECT_OPERATING_SYSTEM.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/standards/12_PROJECT_OPERATING_SYSTEM.md)).
