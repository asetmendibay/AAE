export type EventPayload = Readonly<Record<string, unknown>>;

export interface RuntimeEvent {
  readonly name: string;
  readonly correlationId: string;
  readonly occurredAt: string;
  readonly payload?: EventPayload;
}

export interface EventPublisher {
  publish(event: RuntimeEvent): void;
}
