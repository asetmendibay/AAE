import { AaeError } from '../../core/errors/aae-error.js';
import type { NetworkResource } from '../../core/resources/network.types.js';

const PROFILE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export function validateProfileId(profileId: string): void {
  if (!PROFILE_ID_PATTERN.test(profileId)) {
    throw new AaeError({
      code: 'INPUT_INVALID',
      kind: 'validation',
      retryable: false,
      message: 'Profile id must use 1-64 letters, numbers, underscores, or hyphens',
      safeMessage: 'Profile identifier is invalid',
    });
  }
}

export function validateNetworkResource(resource: NetworkResource): void {
  const proxy = resource.proxy;

  if (proxy === undefined) {
    return;
  }

  if (proxy.host.trim() === '') {
    throw invalidNetworkResource('Proxy host must not be empty');
  }

  if (!Number.isInteger(proxy.port) || proxy.port < 1 || proxy.port > 65_535) {
    throw invalidNetworkResource('Proxy port must be an integer from 1 to 65535');
  }

  const credentials = proxy.credentials;
  if (
    credentials !== undefined &&
    (credentials.username.trim() === '' || credentials.password === '')
  ) {
    throw invalidNetworkResource('Proxy credentials must contain a username and password');
  }
}

function invalidNetworkResource(message: string): AaeError {
  return new AaeError({
    code: 'INPUT_INVALID',
    kind: 'validation',
    retryable: false,
    message,
    safeMessage: 'Network resource is invalid',
  });
}
