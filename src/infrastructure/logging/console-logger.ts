import type { LogLevel } from '../../core/config/config.types.js';
import type { LogContext, LogRecord, Logger } from '../../core/observability/logger.types.js';
import { redactSensitiveText, redactSensitiveValue } from './redact-sensitive-values.js';

export interface ConsoleSink {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export class ConsoleLogger implements Logger {
  public constructor(private readonly sink: ConsoleSink = console) {}

  public debug(message: string, context?: LogContext): void {
    this.write('debug', message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.write('info', message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.write('warn', message, context);
  }

  public error(message: string, context?: LogContext): void {
    this.write('error', message, context);
  }

  private write(level: LogLevel, message: string, context?: LogContext): void {
    const record: LogRecord = {
      timestamp: new Date().toISOString(),
      level,
      message: redactSensitiveText(message),
      ...(context?.correlationId === undefined ? {} : { correlationId: context.correlationId }),
      ...(context?.eventName === undefined ? {} : { eventName: context.eventName }),
      ...(context?.occurredAt === undefined ? {} : { occurredAt: context.occurredAt }),
      ...(context?.data === undefined
        ? {}
        : { data: redactSensitiveValue(context.data) as Record<string, unknown> }),
      ...(context?.error === undefined
        ? {}
        : {
            error: {
              name: redactSensitiveText(context.error.name),
              message: redactSensitiveText(context.error.message),
              ...(context.error.stack === undefined
                ? {}
                : { stack: redactSensitiveText(context.error.stack) }),
            },
          }),
    };

    this.sink[level](JSON.stringify(record));
  }
}
