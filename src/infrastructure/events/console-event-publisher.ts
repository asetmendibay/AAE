import type { EventPublisher, RuntimeEvent } from '../../core/observability/event.types.js';
import type { Logger } from '../../core/observability/logger.types.js';

export class ConsoleEventPublisher implements EventPublisher {
  public constructor(private readonly logger: Logger) {}

  public publish(event: RuntimeEvent): void {
    this.logger.info(`Runtime event: ${event.name}`, {
      correlationId: event.correlationId,
      eventName: event.name,
      occurredAt: event.occurredAt,
      data: event.payload,
    });
  }
}
