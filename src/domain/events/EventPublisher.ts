import { DomainEvent } from "./DomainEvent";

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export class EventPublisher {
  private handlers: Map<string, EventHandler<DomainEvent>[]> = new Map();

  public subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as EventHandler<DomainEvent>);
  }

  public async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    await Promise.all(handlers.map((handler) => handler.handle(event)));
  }
}
