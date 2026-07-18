# AI Context (Контекст для ИИ)

## 1. Stack & Runtime
* **Stack:** Node.js, TypeScript, Playwright (с обходом детектирования)
* **Runtime:** Node.js v20+ / npm

## 2. Architecture & Folder Structure
* **Architecture:** Модульный монолит (модули имеют низкую связанность). Использование классов-сервисов и интерфейсов для изоляции сторонних API.
* **Current Folder Structure:**
  ```
  Automation Engine/
  ├── docs/             # Постоянная документация проекта
  ├── workspace/        # Текущая ежедневная работа
  ├── archive/          # Архив завершенных задач
  ├── src/              # Исходный код приложения
  ├── tests/            # Тесты (Unit, Integration, E2E)
  ├── scripts/          # Вспомогательные скрипты
  ├── profiles/         # Данные сессий браузеров
  ├── logs/             # Лог-файлы
  └── temp/             # Временные файлы
  ```

## 3. Naming Rules & Conventions
* **Документация:** `[Индекс]_[Имя].md` (в корне и в `docs/`).
* **Классы & Интерфейсы:** PascalCase (`BrowserService`, `IConfig`).
* **Переменные & Функции:** camelCase (`getProfile`, `isProxyActive`).
* **Исходные файлы & Директории:** snake_case (например, `browser_manager.ts`).

## 4. Engineering Principles
* **Правило Ноль:** Любое решение должно снижать будущую сложность проекта, а не только решать сиюминутную задачу.
* Никаких жестких координат элементов (используем стабильные селекторы и семантический поиск).
* Никаких фиксированных sleep (используем ожидание событий и состояний Playwright).
* Обязательное логирование всех ошибок и отладочной информации.

## 5. Current Tasks & State
* **Current Sprint:** Спринт 1: Инициализация проекта и проектирование.
* **Current Task:** Проектирование структуры `src/` и API базовых сервисов.
* **Important Decisions:**
  - Отказались от BAS в пользу Node.js + Playwright + TypeScript (Решение №1 в [99_DECISIONS.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/99_DECISIONS.md)).

## 6. Documents to Read First (Порядок чтения)
Перед началом работы изучите следующие файлы в указанном порядке:
1. [14_AI_CONTEXT.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/development/14_AI_CONTEXT.md) (этот документ)
2. [13_PROJECT_STATE.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/development/13_PROJECT_STATE.md) (текущее состояние)
3. [00_PROJECT_VISION.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/00_PROJECT_VISION.md) (цели проекта)
4. [99_DECISIONS.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/99_DECISIONS.md) (принятые решения)
5. [02_ARCHITECTURE.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/core/02_ARCHITECTURE.md) (архитектура)

## 7. Files Changed Recently
* Все файлы документации перенесены в каталоги `docs/core/` и `docs/development/`.
* [docs/standards/12_PROJECT_OPERATING_SYSTEM.md](file:///Users/asetmendibay/AAE%20Aset%20Automation%20Engine/docs/standards/12_PROJECT_OPERATING_SYSTEM.md)

