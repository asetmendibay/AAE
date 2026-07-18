import { Buffer } from 'node:buffer';

import { AaeError } from '../../core/errors/aae-error.js';

export type EnvironmentSource = Readonly<Record<string, string | undefined>>;

const PROFILE_KEY_NAME = 'AAE_PROFILE_ENCRYPTION_KEY';
const PROFILE_KEY_LENGTH = 32;
const BASE64_32_BYTE_PATTERN = /^[A-Za-z0-9+/]{43}=$/;

export function loadProfileEncryptionKey(source: EnvironmentSource = process.env): Uint8Array {
  const value = source[PROFILE_KEY_NAME];

  if (value === undefined || !BASE64_32_BYTE_PATTERN.test(value)) {
    throw invalidKeyError();
  }

  const key = Buffer.from(value, 'base64');
  if (key.byteLength !== PROFILE_KEY_LENGTH) {
    throw invalidKeyError();
  }

  return new Uint8Array(key);
}

function invalidKeyError(): AaeError {
  return new AaeError({
    code: 'PROFILE_ENCRYPTION_KEY_INVALID',
    kind: 'profile',
    retryable: false,
    message: `${PROFILE_KEY_NAME} must be a base64-encoded 32-byte key`,
    safeMessage: 'Profile encryption key is invalid',
  });
}
