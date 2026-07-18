# Architecture Baseline 0.1

**Статус:** утверждённый baseline
**Дата:** 2026-07-18
**Изменение:** только через ADR или явно зафиксированное решение Product Owner.

## 1. Scope

AAE 0.1 — локальный модульный runtime для одного разрешённого браузерного
сценария. Базовая ценность версии — надёжное выполнение Job, а не количество
внешних интеграций.

Внешний REST API, Dashboard, cloud synchronization, multi-worker orchestration
и непроверенные provider integrations не входят в baseline 0.1.

## 2. Runtime

- Node.js 20+ и npm.
- TypeScript в strict mode и ES Modules.
- Playwright применяется только в infrastructure adapter.
- Один локальный process на начальном этапе; масштабирование не имитируется
  заранее.

## 3. Архитектурный стиль

Проект — модульный монолит с направлением зависимостей к центру.

```text
interfaces ────────┐
infrastructure ────┼──> application ───> core
modules ───────────┘
composition связывает реализации на границе приложения
```

- `core` содержит типы, инварианты, ports и не зависит от framework или IO.
- `application` реализует use cases и orchestration через ports из `core`.
- `infrastructure` реализует ports для Playwright, файловой системы и внешних
  ресурсов.
- `interfaces` содержит входы в систему: сначала CLI; будущие API/UI — отдельные
  adapters.
- `modules` содержат site-specific или domain-specific сценарии и зависят только
  от публичных application/core contracts.
- `composition` — единственное место, где concrete implementations связываются
  с contracts.

## 4. Зафиксированная структура исходного кода

```text
src/
├── core/
├── application/
├── infrastructure/
├── interfaces/
├── modules/
└── composition/

tests/
├── unit/
├── contract/
├── integration/
└── e2e/
```

Каталоги будут физически созданы на Этапе 1. Их назначение и правила
зависимостей уже зафиксированы; новые верхнеуровневые runtime-каталоги требуют
ADR.

## 5. Execution model

Единица работы — `Job`. Каждый Job имеет идентификатор, входные параметры,
статус, timeout, cancellation signal, retry policy, безопасный результат и
диагностические события.

Базовый lifecycle:

```text
queued → running → succeeded
                 ↘ failed
                 ↘ cancelled
```

Retry допустим только для ошибок, которые контракт классифицирует как
повторяемые. Retry не должен неявно повторять необратимое действие.

## 6. Browser and resource boundaries

- Browser context принадлежит одному Job и закрывается при любом terminal state.
- Site-specific modules не импортируют Playwright и не управляют процессами
  браузера напрямую.
- Profile, network и temporary artifacts передаются через ports и не являются
  глобальным mutable state.
- Runtime data, secrets и session data не попадают в Git и не логируются в
  открытом виде.

## 7. Cross-cutting contracts

До implementation каждого модуля должны существовать или быть определены в его
задаче следующие contracts:

- `Config` — загрузка и валидация runtime settings;
- `Logger` и `Event` — структурированная наблюдаемость с correlation ID;
- `Error` — классификация failure для user-facing результата и retry policy;
- `Clock`, `IdGenerator` и IO ports — если они нужны для детерминированных
  тестов;
- `Browser`, `ProfileStore`, `NetworkResource` — только на соответствующих
  roadmap stages.

## 8. Security and quality invariants

- Конфигурация не хранится в production code.
- Секреты, cookies, session data и PII должны redacted в логах и artefacts.
- Все внешние операции имеют timeout и явную error handling policy.
- Координаты интерфейса и необоснованные fixed sleeps запрещены.
- Every behaviour change получает пропорциональную автоматическую проверку.

## 9. Stage-gated decisions

Следующие решения не блокируют начало Этапа 1, но должны быть утверждены до
начала соответствующего этапа: concrete profile storage (Этап 5), формат
diagnostic artifacts (Этап 4), конкретный target первого модуля (Этап 6) и
release distribution mechanism (Этап 8).

Они не могут приниматься неявно в implementation task.
