# Modules

**Статус:** baseline map; Local Smoke module реализован как первый controlled
vertical slice.

| Область                  | Ответственность                                      | Roadmap stage |
| ------------------------ | ---------------------------------------------------- | ------------- |
| Config                   | Валидация и предоставление runtime settings          | 2             |
| Logger / Events / Errors | Наблюдаемость, correlation и failure classification  | 2             |
| Execution Engine         | Job lifecycle, retry, timeout, cancellation и result | 3             |
| CLI                      | Первый вход в application layer                      | 3             |
| Browser Adapter          | Playwright lifecycle и isolated browser context      | 4             |
| Profile Store            | Защищённое хранение и lifecycle session data         | 5             |
| Network Resource         | Явная валидация и передача сетевой конфигурации      | 5             |
| First Module             | Один разрешённый сквозной сценарий                   | 6             |

Module specification создаётся из канонического шаблона только перед началом его
roadmap stage. Ни один module не получает direct dependency на другой module;
взаимодействие проходит через core/application contracts.
