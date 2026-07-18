# AI Guide

Перед любой задачей участник читает документы в следующем порядке:

1. `docs/executive/00_EXECUTIVE_CONTEXT.md`;
2. `docs/executive/01_CURRENT_STATE.md`;
3. `docs/executive/02_ACTIVE_DECISIONS.md`;
4. `docs/core/01_MASTER_PLAN.md`;
5. `docs/core/02_ARCHITECTURE.md`;
6. `docs/core/11_WORKFLOW.md`;
7. собственную конституцию в `docs/AI_TEAM/constitutions/`;
8. task specification и документы активного roadmap stage.

_Исключение для ChatGPT:_ ChatGPT при начале нового диалога читает документы строго в порядке, определённом в [00_README_FOR_CHATGPT.md](../chatgpt_context/00_README_FOR_CHATGPT.md), восстанавливая только архитектурный контекст без загрузки всей кодовой базы.

## Обязательные правила

- Не менять архитектуру, роли, workflow или структуру репозитория без ADR либо
  явно зафиксированного решения Product Owner.
- Не начинать задачу, если её источник не указан в Project Roadmap 0.1.
- Не считать отсутствие решения разрешением выбрать вариант самостоятельно.
- Не скрывать риски, сбои проверок и расхождения с baseline.
- В конце задачи обновлять только документы, определённые единственным workflow.

Детальные стандарты кода, Git и документации читаются до той задачи, к которой
они применимы.
