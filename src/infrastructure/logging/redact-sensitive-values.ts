const SENSITIVE_KEY_PATTERN =
  /password|secret|token|cookie|session|authorization|(?:api|encryption|private)[-_]?key/i;
const SENSITIVE_TEXT_PATTERN =
  /((?:password|secret|token|cookie|session|authorization|(?:api|encryption|private)[-_]?key)\s*[:=]\s*)([^\s,;]+)/gi;
const BEARER_TOKEN_PATTERN = /(bearer\s+)([^\s,;]+)/gi;

export function redactSensitiveValue(value: unknown, key?: string): unknown {
  if (key !== undefined && SENSITIVE_KEY_PATTERN.test(key)) {
    return '[REDACTED]';
  }

  if (typeof value === 'string') {
    return redactSensitiveText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveValue(item));
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        redactSensitiveValue(entryValue, entryKey),
      ]),
    );
  }

  return value;
}

export function redactSensitiveText(value: string): string {
  return value
    .replace(SENSITIVE_TEXT_PATTERN, '$1[REDACTED]')
    .replace(BEARER_TOKEN_PATTERN, '$1[REDACTED]');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
