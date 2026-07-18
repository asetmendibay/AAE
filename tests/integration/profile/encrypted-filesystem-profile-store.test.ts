import { Buffer } from 'node:buffer';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { classifyError } from '../../../src/application/errors/classify-error.js';
import { EncryptedFilesystemProfileStore } from '../../../src/infrastructure/profile/encrypted-filesystem-profile-store.js';

let testDirectory: string;

beforeEach(async () => {
  testDirectory = await mkdtemp(join(tmpdir(), 'aae-profile-store-'));
});

afterEach(async () => {
  await rm(testDirectory, { recursive: true, force: true });
});

function createStore(keyByte = 7): EncryptedFilesystemProfileStore {
  return new EncryptedFilesystemProfileStore({
    directory: join(testDirectory, 'profiles'),
    encryptionKey: new Uint8Array(Buffer.alloc(32, keyByte)),
  });
}

describe('EncryptedFilesystemProfileStore', () => {
  it('encrypts session data on disk and restores the original bytes', async () => {
    const store = createStore();
    const sessionData = new TextEncoder().encode('fixture-session-state-not-a-real-cookie');

    await store.save('profile-one', { data: sessionData });

    const profileFile = join(testDirectory, 'profiles', 'profile-one.profile');
    const stored = await readFile(profileFile, 'utf8');
    const fileStat = await stat(profileFile);

    expect(stored).not.toContain('fixture-session-state-not-a-real-cookie');
    expect(JSON.parse(stored)).toMatchObject({ version: 1, algorithm: 'aes-256-gcm' });
    expect(fileStat.mode & 0o777).toBe(0o600);
    await expect(store.load('profile-one')).resolves.toEqual({ data: sessionData });
  });

  it('keeps profiles isolated and removes only the requested profile', async () => {
    const store = createStore();
    const first = new TextEncoder().encode('first-profile');
    const second = new TextEncoder().encode('second-profile');

    await store.save('profile-one', { data: first });
    await store.save('profile-two', { data: second });
    await store.delete('profile-one');

    await expect(store.load('profile-one')).resolves.toBeUndefined();
    await expect(store.load('profile-two')).resolves.toEqual({ data: second });
  });

  it('does not expose corrupted profile contents through the failure contract', async () => {
    const store = createStore();
    const profileDirectory = join(testDirectory, 'profiles');
    await store.save('profile-corrupted', { data: new Uint8Array([1, 2, 3]) });
    await writeFile(
      join(profileDirectory, 'profile-corrupted.profile'),
      '{"ciphertext":"secret-profile-content"}',
      'utf8',
    );

    try {
      await store.load('profile-corrupted');
      throw new Error('Expected corrupted profile to fail');
    } catch (error) {
      const failure = classifyError(error);
      expect(failure).toEqual({
        code: 'PROFILE_DECRYPTION_FAILED',
        kind: 'profile',
        retryable: false,
        message: 'Profile data could not be read',
      });
      expect(JSON.stringify(failure)).not.toContain('secret-profile-content');
    }
  });
});
