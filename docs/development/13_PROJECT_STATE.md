# Project State

## Текущий статус

| Поле                   | Значение                                         |
| ---------------------- | ------------------------------------------------ |
| Roadmap stage          | 8 — Release 0.1 (in progress)                    |
| Current goal           | Merge подтверждённого PR, tag и GitHub Release   |
| Next stage             | Release complete                                 |
| Branch                 | `codex/release-0.1-rc`                           |
| Stack                  | Node.js 20+, TypeScript, npm, Playwright adapter |
| Active runtime modules | Execution Engine и Browser Platform adapters     |

## Решения и ограничения

- Решение №2 зафиксировало architecture baseline, роли, workflow и freeze.
- Новые задачи следуют только из Project Roadmap 0.1.
- Direct implementation Config, Logger, Browser или Profile до Engineering
  Foundation не разрешена.
- Product runtime logic в foundation не добавляется; `src/` содержит только
  утверждённые слои и технический entrypoint.
- Config, Logger/Events и Error taxonomy завершены в рамках Этапа 2.
- Execution Engine и demo CLI завершены в рамках Этапа 3.
- Browser port и Playwright adapter завершены в рамках Этапа 4.
- Runtime Resources и решение №3 завершены в рамках Этапа 5.
- Local Smoke module и решение №4 завершены в рамках Этапа 6.

## Блокеры

Product Owner подтвердил release candidate. Этап 7 завершён; выполняется Этап 8:
merge PR #1, создание immutable tag `v0.1.0` и GitHub Release.
