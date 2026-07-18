export type ErrorKind =
  | 'configuration'
  | 'validation'
  | 'timeout'
  | 'cancelled'
  | 'dependency'
  | 'browser'
  | 'profile'
  | 'module'
  | 'unexpected';

export type ErrorCode =
  | 'CONFIG_INVALID'
  | 'INPUT_INVALID'
  | 'TIMEOUT'
  | 'CANCELLED'
  | 'DEPENDENCY_UNAVAILABLE'
  | 'BROWSER_LAUNCH_FAILED'
  | 'BROWSER_CLEANUP_FAILED'
  | 'BROWSER_SESSION_CLOSED'
  | 'PROFILE_ENCRYPTION_KEY_INVALID'
  | 'PROFILE_STORAGE_FAILURE'
  | 'PROFILE_DECRYPTION_FAILED'
  | 'MODULE_VERIFICATION_FAILED'
  | 'UNEXPECTED_FAILURE';

export interface FailureClassification {
  readonly code: ErrorCode;
  readonly kind: ErrorKind;
  readonly retryable: boolean;
  readonly message: string;
}
