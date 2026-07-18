import { Buffer } from 'node:buffer';

import { describe, expect, it } from 'vitest';

import { classifyError } from '../../../src/application/errors/classify-error.js';
import { loadProfileEncryptionKey } from '../../../src/infrastructure/profile/profile-encryption-key.js';

describe('loadProfileEncryptionKey', () => {
  it('loads a canonical 32-byte base64 key', () => {
    const encoded = Buffer.alloc(32, 7).toString('base64');

    expect(loadProfileEncryptionKey({ AAE_PROFILE_ENCRYPTION_KEY: encoded })).toEqual(
      new Uint8Array(Buffer.alloc(32, 7)),
    );
  });

  it('rejects missing and malformed keys with a safe error', () => {
    for (const source of [{}, { AAE_PROFILE_ENCRYPTION_KEY: 'not-a-key' }]) {
      try {
        loadProfileEncryptionKey(source);
        throw new Error('Expected key validation to fail');
      } catch (error) {
        expect(classifyError(error)).toEqual({
          code: 'PROFILE_ENCRYPTION_KEY_INVALID',
          kind: 'profile',
          retryable: false,
          message: 'Profile encryption key is invalid',
        });
      }
    }
  });
});
