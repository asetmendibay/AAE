# Next Target

**Назначение:** Описание текущей вехи и непосредственных задач команды.

## 1. Текущая задача (Что делается прямо сейчас)

Решение Product Owner о release candidate после завершённого **Этапа 7 — System
Verification**.

- Проверка green GitHub Actions evidence PR #1.
- Подтверждение release candidate для 0.1.
- Переход к Этапу 8 только после Product Owner approval.

## 2. Ожидаемый результат (Definition of DoD)

- GitHub Actions повторил matrix без failures (run `29650764469`).
- Секреты и session data не попадают в сообщения, логи и тестовые артефакты.
- Product Owner получает release checklist и support runbook.

## 3. Следующий этап

**Этап 8 — Release 0.1**

- Цель: выпустить воспроизводимую инженерную версию после Product Owner approval.
- Результат: versioned release, changelog, tag и install/run guide.
