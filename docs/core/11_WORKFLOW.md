# Unified Development Workflow

**Статус:** единственный обязательный workflow проекта
**Граница:** от идеи до merge в `main`.

```text
Idea → Intake → Decision Gate → Task Specification → Implementation Branch
     → Verification → External Review → Product Owner Approval → Merge → Record
```

## 1. Idea

Product Owner формулирует проблему, ожидаемую ценность и связь с roadmap stage.
Идея вне активного или следующего разрешённого этапа не становится задачей.

## 2. Intake

Repository Chief Engineer проверяет scope, зависимости, baseline impact и
измеримый критерий результата. Если задача не следует из roadmap, она сначала
добавляется в roadmap через решение Product Owner.

## 3. Decision Gate

Если задача меняет baseline, публичный contract, module boundary, workflow,
роль или структуру каталогов, требуется ADR и решение Product Owner до task
specification. Independent Architecture Advisor и External Research подключаются
только для подготовки evidence; они не утверждают решение.

## 4. Task Specification

Repository Chief Engineer создаёт task из канонического шаблона: цель, scope,
зависимости, файлы, acceptance criteria, проверки, риски и roadmap source.

## 5. Implementation Branch

Исполнитель создаёт ветку `feature/[task-id]-[short-description]` или
`fix/[task-id]-[short-description]`, реализует минимальный согласованный объём,
тесты и обязательные изменения документации. Прямые изменения в `main`
запрещены.

## 6. Verification

Repository Chief Engineer запускает все применимые quality gates: format, lint,
type check, unit/contract/integration/E2E tests и проверку документации.
Падающая или пропущенная обязательная проверка блокирует review.

## 7. External Review

Claude выполняет независимое review изменения и результатов проверок. Critical
или unresolved review finding возвращает задачу в Implementation Branch.

## 8. Product Owner Approval

Product Owner подтверждает, что задача соответствует цели и критериям приёмки.
Для ADR это явное архитектурное утверждение; для обычной задачи — разрешение на
merge после complete review.

## 9. Merge

Repository Chief Engineer выполняет merge в `main` только при green checks,
закрытых review findings и Product Owner approval. Merge commit или squash
сохраняет Conventional Commit format.

## 10. Record

В том же pull request обновляются только применимые источники истины:

- roadmap/progress — при завершении этапа;
- current state — при изменении текущей позиции;
- decisions — только при принятом ADR;
- changelog — при изменении продукта;
- project journal — краткая историческая запись.

После merge следующая идея снова проходит этот же workflow. Альтернативных
процессов нет.
