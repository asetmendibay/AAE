export type RuntimeEnvironment = 'development' | 'test' | 'production';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface RuntimeConfig {
  readonly environment: RuntimeEnvironment;
  readonly logLevel: LogLevel;
  readonly defaultTimeoutMs: number;
}
