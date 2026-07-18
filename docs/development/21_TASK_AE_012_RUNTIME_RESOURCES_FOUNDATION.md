# TASK_AE_012: Runtime Resources foundation

## Статус

Завершено — Этап 5. Решение №3 Product Owner фиксирует storage/key policy.

## Threat model

| Актив             | Основной риск                                 | Контроль в контракте                                                           |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| Profile ID        | Path traversal и cross-profile access         | Строгая allowlist-валидация ID                                                 |
| Session data      | Попадание cookies/session data в Git или logs | `Uint8Array` без логирования и без fixture с реальными данными                 |
| Storage key       | Хранение ключа рядом с profile blob           | Ключ не является частью Profile Store contract                                 |
| Proxy credentials | Утечка в сообщениях validation/logging        | Только safe error messages; logger redaction уже покрывает password/token keys |
| Network config    | Неявная передача между Job                    | Явный immutable `NetworkResource` contract                                     |

## Принятое решение Product Owner

1. Storage: encrypted local filesystem blobs в `profiles/`.
2. Encryption: AES-256-GCM с уникальным random IV на каждую запись.
3. Key source: обязательный `AAE_PROFILE_ENCRYPTION_KEY`, 32 bytes в base64;
   ключ не сохраняется на диске и не попадает в логи.
4. File naming: только валидированный `profileId`; атомарная запись через
   temporary file и rename.
5. Network: direct connection или один explicit proxy на Job; credentials не
   сериализуются в diagnostic events.

## Реализованный срез

- `ProfileStore` с load/save/delete и opaque session bytes.
- `NetworkResource` с optional proxy и credentials.
- Validation Profile ID и network resource.
- `EncryptedFilesystemProfileStore` с AES-256-GCM, unique IV, owner-only files
  и atomic write.
- Browser adapter получает один explicit proxy только для isolated launch.
- Unit/integration tests без реальных cookies, keys или credentials.

## Gate для следующего среза

Этап 5 завершён. Перед Этапом 6 Product Owner выбирает контролируемый,
разрешённый target для первого site-specific module.
