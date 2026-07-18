# Project Roadmap 0.1

**Статус:** главный план разработки версии 0.1
**Владелец:** Product Owner
**Правило:** новая задача может появиться только как декомпозиция одного из
этапов этого roadmap.

## 1. Последовательность

```text
0. Project Baseline
        ↓
1. Engineering Foundation
        ↓
2. Cross-cutting Runtime
        ↓
3. Execution Engine
        ↓
4. Browser Platform
        ↓
5. Runtime Resources
        ↓
6. First Authorised Module
        ↓
7. System Verification
        ↓
8. Release 0.1
```

Этапы выполняются строго последовательно. Тесты создаются на каждом этапе;
Этап 7 не начинает тестирование с нуля, а завершает системную проверку.

## 2. Этап 0 — Project Baseline

**Цель:** утвердить границы продукта, architecture baseline, роли, workflow и
правило freeze.

**Результат:** единые документы baseline и нулевая неоднозначность, блокирующая
Engineering Foundation.

**Зависимости:** отсутствуют.

**Риски:** зафиксировать слишком детальные решения до появления evidence.

**Definition of Done:** архитектурные границы, последовательность этапов,
ответственность ролей и единственный workflow утверждены Product Owner.

**Переход:** разрешено создавать задачи только Этапа 1.

## 3. Этап 1 — Engineering Foundation

**Цель:** сделать репозиторий воспроизводимой инженерной средой до появления
runtime-логики.

**Результат:** Node.js/TypeScript project scaffold, package manifest, lockfile,
ESM policy, strict compiler settings, formatter, linter, test runner, базовый CI
и утверждённая структура `src/` и `tests/`.

**Зависимости:** Этап 0.

**Риски:** внедрить framework или dependency до определения её необходимости;
создать пустую структуру без quality gates.

**Definition of Done:** чистый clone устанавливает зависимости, проходит type
check, lint и минимальный test command; CI повторяет эти проверки; никаких
product modules не реализовано.

**Переход:** разрешён Этап 2, когда все quality gates работают локально и в CI.

## 4. Этап 2 — Cross-cutting Runtime

**Цель:** создать единые контракты конфигурации, событий, ошибок и логирования.

**Результат:** Config contract с валидацией, структурированный Logger,
корреляционные идентификаторы, error taxonomy и правило redaction.

**Зависимости:** Этап 1.

**Риски:** смешать конфигурацию с кодом, логировать секреты, создать Logger,
зависящий от будущих модулей.

**Definition of Done:** контракты покрыты unit-тестами, настройки не хранятся в
коде, ошибки классифицируются, а логи допускают безопасную диагностику.

**Переход:** разрешён Этап 3, когда execution engine может использовать Config и
Logger без прямой зависимости от конкретных внешних библиотек.

## 5. Этап 3 — Execution Engine

**Цель:** реализовать нейтральный runtime выполнения задач без зависимости от
браузера.

**Результат:** Job model, конечный автомат статусов, cancellation, timeout,
retry policy, result contract, CLI entry point и dependency composition.

**Зависимости:** Этап 2.

**Риски:** привязать job lifecycle к Playwright или реализовать retry,
дублирующий необратимые действия.

**Definition of Done:** engine проходит unit и contract-тесты с fake executor;
CLI создаёт и завершает тестовую Job; каждый terminal state диагностируем.

**Переход:** разрешён Этап 4, когда browser adapter может подключаться через
утверждённый execution contract.

## 6. Этап 4 — Browser Platform

**Цель:** добавить Playwright как инфраструктурный адаптер, не меняя application
layer.

**Результат:** Browser port и adapter, изолированный context на Job, lifecycle
ресурсов, timeout/cancellation integration, безопасные trace и diagnostic
artifacts.

**Зависимости:** Этап 3.

**Риски:** утечки browser processes, общий mutable context, прямой импорт
Playwright в сценариях.

**Definition of Done:** integration-тесты подтверждают launch, isolated context,
graceful cleanup и передачу browser failure в execution engine.

**Переход:** разрешён Этап 5, когда browser state и diagnostics имеют стабильный
контракт.

## 7. Этап 5 — Runtime Resources

**Цель:** добавить ресурсы, которыми Job владеет во время выполнения.

**Результат:** Profile contract и безопасное local storage, жизненный цикл
session data, network resource contract, validation и cleanup policy.

**Зависимости:** Этап 4.

**Риски:** секреты в репозитории или логах, shared profile state, неявная
передача сетевых настроек между Job.

**Definition of Done:** profile и network resources изолированы между Job,
секреты redacted, storage contract покрыт integration-тестами, cleanup
верифицирован.

**Переход:** разрешён Этап 6, когда модуль может запросить все необходимые
resources только через публичные порты.

## 8. Этап 6 — First Authorised Module

**Цель:** доказать архитектуру одним сквозным разрешённым сценарием.

**Результат:** один module для контролируемого тестового или принадлежащего
проекту target, использующий execution engine и browser platform без обхода
границ слоёв.

**Зависимости:** Этап 5.

**Риски:** оптимизировать ядро под один сайт или включить неутверждённый внешний
сценарий.

**Definition of Done:** module имеет спецификацию, unit/integration/E2E набор,
выполняется через CLI и сохраняет безопасный наблюдаемый результат.

**Переход:** разрешён Этап 7, когда вертикальный срез воспроизводим в чистом
окружении.

## 9. Этап 7 — System Verification

**Цель:** проверить 0.1 как систему, а не как набор отдельных модулей.

**Результат:** полная test matrix, failure/recovery scenarios, dependency audit,
security review, documentation runbook и release candidate.

**Зависимости:** Этап 6.

**Риски:** flaky E2E, неявные секреты, расхождение документации и runtime.

**Definition of Done:** CI green, критические сценарии проверены, отсутствуют
известные blocking defects, release checklist и support runbook завершены.

**Переход:** разрешён Этап 8 после решения Product Owner о release candidate.

## 10. Этап 8 — Release 0.1

**Цель:** выпустить воспроизводимую первую инженерную версию.

**Результат:** versioned release, changelog, tagged source, install/run guide и
подтверждённая поддерживаемая граница продукта.

**Зависимости:** Этап 7.

**Риски:** обозначить версией 0.1 непроверенный набор функций или включить
неподдерживаемые integration paths.

**Definition of Done:** Product Owner принимает release, все обязательные
проверки и документация завершены, known limitations опубликованы.

## 11. Проверка последовательности

Ни один этап нельзя начать раньше предыдущего:

| Этап | Почему ранний старт запрещён                                   |
| ---- | -------------------------------------------------------------- |
| 1    | До baseline неизвестны границы и quality gates.                |
| 2    | Контракты не могут жить в неустановленном toolchain.           |
| 3    | Job engine зависит от Config, Logger и error model.            |
| 4    | Browser adapter должен реализовать готовый execution contract. |
| 5    | Resources зависят от concrete browser lifecycle.               |
| 6    | Первый module не должен определять инфраструктурные контракты. |
| 7    | Системная проверка требует законченного вертикального среза.   |
| 8    | Release не предшествует evidence из system verification.       |

Параллельно разрешены только задачи внутри одного активного этапа, если они не
меняют один контракт и имеют независимые критерии приёмки.
