# Handoff Protocol

Handoff — это артефакт одного Unified Development Workflow, а не отдельный
процесс. Он обязателен при передаче работы между ролями.

## Required handoff

1. Task или ADR ID и соответствующий roadmap stage.
2. Выполненный scope и список изменённых файлов.
3. Выполненные проверки, их результаты и непроверенные пункты.
4. Известные риски, ограничения и review questions.
5. Точный следующий шаг для принимающей роли.

Не допускается передавать изменение на External Review или Product Owner
Approval при падающих required checks, нераскрытом architectural impact или
необъяснённых отклонениях от task specification.
