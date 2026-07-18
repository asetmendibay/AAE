# Next Target

**Статус:** ближайшая целевая веха
**Дата обновления:** 2026-07-18

## Цель

Пройти remote CI release gate для завершённого локально **Этапа 7 — System
Verification**.

## Обязательный результат

1. Отправить текущий runtime-срез в remote без включения незапланированных файлов.
2. Получить green GitHub Actions: quality gates, production dependency audit и build.
3. Передать evidence Product Owner для решения о release candidate.

## Не является целью

- Новые site-specific integrations.
- Изменение baseline, workflow или AI Team.

## Критерий завершения вехи

Веха завершена, когда GitHub Actions green, критические failure/recovery
scenarios имеют evidence, dependency audit clean, а release/support documents
готовы для решения Product Owner о release candidate.
