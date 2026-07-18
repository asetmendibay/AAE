import { AaeError } from '../errors/aae-error.js';

export class ConfigValidationError extends AaeError {
  public readonly issues: readonly string[];

  public constructor(issues: readonly string[]) {
    super({
      code: 'CONFIG_INVALID',
      kind: 'configuration',
      retryable: false,
      message: `Invalid runtime configuration: ${issues.join('; ')}`,
      safeMessage: 'Runtime configuration is invalid',
    });
    this.name = 'ConfigValidationError';
    this.issues = issues;
  }
}
