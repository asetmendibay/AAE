# Interface Specification

## Scope 0.1

Единственный публичный вход версии 0.1 — CLI, реализуемый на Этапе 3. Его
аргументы и exit codes документируются вместе с task specification.

## Не входит в 0.1

REST API, Webhook API, Dashboard API, Telegram integration и cloud interfaces
не имеют контракта в baseline и не должны получать неявную реализацию.

## Library boundary

Application contracts могут использоваться внутри process, но не считаются
стабильным external library API до отдельного ADR и roadmap stage.
