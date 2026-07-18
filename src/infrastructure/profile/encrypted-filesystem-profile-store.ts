import { Buffer } from 'node:buffer';
import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from 'node:crypto';
import { chmod, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { validateProfileId } from '../../application/resources/validate-resources.js';
import { AaeError } from '../../core/errors/aae-error.js';
import type { ProfileSessionData, ProfileStore } from '../../core/resources/profile.types.js';

const ALGORITHM = 'aes-256-gcm';
const ENVELOPE_VERSION = 1;
const IV_LENGTH = 12;

interface EncryptedProfileEnvelope {
  readonly version: number;
  readonly algorithm: string;
  readonly iv: string;
  readonly authTag: string;
  readonly ciphertext: string;
}

export interface EncryptedFilesystemProfileStoreOptions {
  readonly directory: string;
  readonly encryptionKey: Uint8Array;
}

export class EncryptedFilesystemProfileStore implements ProfileStore {
  private readonly encryptionKey: Buffer;

  public constructor(private readonly options: EncryptedFilesystemProfileStoreOptions) {
    if (options.encryptionKey.byteLength !== 32) {
      throw new AaeError({
        code: 'PROFILE_ENCRYPTION_KEY_INVALID',
        kind: 'profile',
        retryable: false,
        message: 'Profile encryption key must be 32 bytes',
        safeMessage: 'Profile encryption key is invalid',
      });
    }

    this.encryptionKey = Buffer.from(options.encryptionKey);
  }

  public async load(profileId: string): Promise<ProfileSessionData | undefined> {
    validateProfileId(profileId);

    try {
      const contents = await readFile(this.profilePath(profileId), 'utf8');
      const envelope = parseEnvelope(contents);
      return { data: decrypt(envelope, this.encryptionKey) };
    } catch (error) {
      if (isNotFoundError(error)) {
        return undefined;
      }
      if (error instanceof AaeError) {
        throw error;
      }
      throw new AaeError({
        code: 'PROFILE_DECRYPTION_FAILED',
        kind: 'profile',
        retryable: false,
        message: 'Profile data could not be decrypted',
        safeMessage: 'Profile data could not be read',
        cause: error,
      });
    }
  }

  public async save(profileId: string, sessionData: ProfileSessionData): Promise<void> {
    validateProfileId(profileId);
    await this.ensureDirectory();
    const targetPath = this.profilePath(profileId);
    const temporaryPath = join(this.options.directory, `.${profileId}.${randomUUID()}.tmp`);

    try {
      const envelope = encrypt(sessionData.data, this.encryptionKey);
      await writeFile(temporaryPath, JSON.stringify(envelope), {
        encoding: 'utf8',
        mode: 0o600,
        flag: 'wx',
      });
      await rename(temporaryPath, targetPath);
    } catch (error) {
      await rm(temporaryPath, { force: true }).catch(() => undefined);
      if (error instanceof AaeError) {
        throw error;
      }
      throw new AaeError({
        code: 'PROFILE_STORAGE_FAILURE',
        kind: 'profile',
        retryable: false,
        message: 'Profile data could not be stored',
        safeMessage: 'Profile data could not be saved',
        cause: error,
      });
    }
  }

  public async delete(profileId: string): Promise<void> {
    validateProfileId(profileId);

    try {
      await rm(this.profilePath(profileId), { force: true });
    } catch (error) {
      throw new AaeError({
        code: 'PROFILE_STORAGE_FAILURE',
        kind: 'profile',
        retryable: false,
        message: 'Profile data could not be deleted',
        safeMessage: 'Profile data could not be deleted',
        cause: error,
      });
    }
  }

  private async ensureDirectory(): Promise<void> {
    try {
      await mkdir(this.options.directory, { recursive: true, mode: 0o700 });
      await chmod(this.options.directory, 0o700);
    } catch (error) {
      throw new AaeError({
        code: 'PROFILE_STORAGE_FAILURE',
        kind: 'profile',
        retryable: false,
        message: 'Profile storage directory could not be secured',
        safeMessage: 'Profile storage is unavailable',
        cause: error,
      });
    }
  }

  private profilePath(profileId: string): string {
    return join(this.options.directory, `${profileId}.profile`);
  }
}

function encrypt(data: Uint8Array, key: Buffer): EncryptedProfileEnvelope {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);

  return {
    version: ENVELOPE_VERSION,
    algorithm: ALGORITHM,
    iv: iv.toString('base64'),
    authTag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
}

function decrypt(envelope: EncryptedProfileEnvelope, key: Buffer): Uint8Array {
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(envelope.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(envelope.authTag, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext, 'base64')),
    decipher.final(),
  ]);
  return new Uint8Array(plaintext);
}

function parseEnvelope(contents: string): EncryptedProfileEnvelope {
  const parsed: unknown = JSON.parse(contents);
  if (!isEnvelope(parsed)) {
    throw new Error('Profile envelope is invalid');
  }
  return parsed;
}

function isEnvelope(value: unknown): value is EncryptedProfileEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const envelope = value as Record<string, unknown>;
  return (
    envelope.version === ENVELOPE_VERSION &&
    envelope.algorithm === ALGORITHM &&
    typeof envelope.iv === 'string' &&
    typeof envelope.authTag === 'string' &&
    typeof envelope.ciphertext === 'string'
  );
}

function isNotFoundError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}
