import { ConfigValidationError } from '../../core/config/config.errors.js';
import type {
  LogLevel,
  RuntimeConfig,
  RuntimeEnvironment,
} from '../../core/config/config.types.js';

export type EnvironmentSource = Readonly<Record<string, string | undefined>>;

const DEFAULT_TIMEOUT_MS = 30_000;
const VALID_ENVIRONMENTS: readonly RuntimeEnvironment[] = ['development', 'test', 'production'];
const VALID_LOG_LEVELS: readonly LogLevel[] = ['debug', 'info', 'warn', 'error'];

export function loadConfig(source: EnvironmentSource = process.env): RuntimeConfig {
  const issues: string[] = [];
  const environment = parseEnvironment(source.AAE_ENVIRONMENT, issues);
  const logLevel = parseLogLevel(source.AAE_LOG_LEVEL, issues);
  const defaultTimeoutMs = parseTimeout(source.AAE_DEFAULT_TIMEOUT_MS, issues);

  if (issues.length > 0) {
    throw new ConfigValidationError(issues);
  }

  return {
    environment,
    logLevel,
    defaultTimeoutMs,
  };
}

function parseEnvironment(value: string | undefined, issues: string[]): RuntimeEnvironment {
  const candidate = value?.trim() || 'development';

  if (VALID_ENVIRONMENTS.includes(candidate as RuntimeEnvironment)) {
    return candidate as RuntimeEnvironment;
  }

  issues.push('AAE_ENVIRONMENT must be development, test, or production');
  return 'development';
}

function parseLogLevel(value: string | undefined, issues: string[]): LogLevel {
  const candidate = value?.trim() || 'info';

  if (VALID_LOG_LEVELS.includes(candidate as LogLevel)) {
    return candidate as LogLevel;
  }

  issues.push('AAE_LOG_LEVEL must be debug, info, warn, or error');
  return 'info';
}

function parseTimeout(value: string | undefined, issues: string[]): number {
  if (value === undefined || value.trim() === '') {
    return DEFAULT_TIMEOUT_MS;
  }

  const candidate = Number(value.trim());

  if (Number.isInteger(candidate) && candidate > 0) {
    return candidate;
  }

  issues.push('AAE_DEFAULT_TIMEOUT_MS must be a positive integer in milliseconds');
  return DEFAULT_TIMEOUT_MS;
}
