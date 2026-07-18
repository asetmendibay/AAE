# Git Delivery Policy

## 1. Source of truth

В проекте действует строгое правило соподчинения источников истины (от абсолютного к производному):

1. Git Repository (код и слияния)
2. Documentation (архитектура, Master Plan, стандарты в `docs/core/` и `docs/standards/`)
3. Executive Context (`docs/executive/`)
4. ChatGPT Context Layer (`docs/chatgpt_context/`)
5. AI Sessions (история чатов ИИ никогда не признаётся источником истины)

Git repository и merged pull requests — единственный канонический источник состояния и истории проекта. История чатов, локальные копии и внешние отчёты не заменяют Git.

## 2. Delivery rule

Ветки, commits и merge следуют `docs/core/11_WORKFLOW.md` и
`docs/standards/GIT_STANDARD.md`. Этот документ не создаёт отдельный процесс.

## 3. Session completion

До передачи работы следующей роли Repository Chief Engineer фиксирует изменения,
результаты проверок и требуемые records в handoff. Обновление project state,
progress, decisions, changelog и journal производится только по правилам
workflow, а не механически после каждой сессии.
