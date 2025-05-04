import { EventId } from "../value-objects/EventId";

export interface DomainEvent {
  eventId: EventId;
  occurredOn: Date;
  eventType: string;
  version: number;
}
