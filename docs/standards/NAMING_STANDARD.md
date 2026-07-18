# Naming Standard (Стандарты именования)

## 1. Файлы и каталоги

### Проектная документация (`docs/`):
* Шаблон: `[Индекс]_[ИМЯ_В_ВЕРХНЕМ_РЕГИСТРЕ].md`
* Примеры: `00_RULE_ZERO.md`, `14_AI_CONTEXT.md`

### Исходный код (`src/`):
* Файлы модулей и папки: `snake_case` (нижнее подчеркивание).
* Пример: `browser_manager.ts`, `proxy_service.ts`
* Тестовые файлы: `[имя_модуля].test.ts` или `[имя_модуля].spec.ts`

---

## 2. Код (TypeScript / JavaScript)

### Классы, Интерфейсы и Enum:
* Имя: `PascalCase`.
* Интерфейсы начинаются с буквы `I`.
* Примеры: `class BrowserInstance`, `interface IConfigService`, `enum ProxyStatus`

### Переменные, Параметры и Функции:
* Имя: `camelCase`.
* Примеры: `const activeProfiles = []`, `function getProxyAddress()`

### Константы:
* Имя: `UPPER_CASE_SNAKE_CASE`.
* Примеры: `const DEFAULT_TIMEOUT_MS = 30000`
