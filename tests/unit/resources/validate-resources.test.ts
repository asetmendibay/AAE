import { describe, expect, it } from 'vitest';

import {
  validateNetworkResource,
  validateProfileId,
} from '../../../src/application/resources/validate-resources.js';
import { classifyError } from '../../../src/application/errors/classify-error.js';

describe('validateProfileId', () => {
  it('accepts a portable profile identifier', () => {
    expect(() => validateProfileId('account_01-production')).not.toThrow();
  });

  it('rejects traversal and unsupported characters', () => {
    expect(() => validateProfileId('../profile')).toThrow('Profile id must use');
    expect(() => validateProfileId('profile/one')).toThrow('Profile id must use');
  });
});

describe('validateNetworkResource', () => {
  it('accepts direct connections and validated proxy settings', () => {
    expect(() => validateNetworkResource({})).not.toThrow();
    expect(() =>
      validateNetworkResource({
        proxy: {
          protocol: 'https',
          host: 'proxy.example.test',
          port: 8443,
          credentials: { username: 'user', password: 'not-logged' },
        },
      }),
    ).not.toThrow();
  });

  it('returns safe errors without including credentials', () => {
    const resource = {
      proxy: {
        protocol: 'http' as const,
        host: 'proxy.example.test',
        port: 8080,
        credentials: { username: '', password: 'secret-password' },
      },
    };

    try {
      validateNetworkResource(resource);
      throw new Error('Expected network resource validation to fail');
    } catch (error) {
      const failure = classifyError(error);
      expect(failure.message).toBe('Network resource is invalid');
      expect(JSON.stringify(failure)).not.toContain('secret-password');
    }
  });
});
