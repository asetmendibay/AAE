import type { LogLevel } from '../config/config.types.js';

export interface LogContext {
  readonly correlationId?: string;
  readonly eventName?: string;
  readonly occurredAt?: string;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly error?: {
    readonly name: string;
    readonly message: string;
    readonly stack?: string;
  };
}

export interface LogRecord {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly message: string;
  readonly correlationId?: string;
  readonly eventName?: string;
  readonly occurredAt?: string;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly error?: {
    readonly name: string;
    readonly message: string;
    readonly stack?: string;
  };
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}
