import { DomainEvent } from "./DomainEvent";
import { EventId } from "../value-objects/EventId";

export class ApiKeyChangedEvent implements DomainEvent {
  public readonly eventId: EventId;
  public readonly occurredOn: Date;
  public readonly eventType: string = "API_KEY_CHANGED";
  public readonly version: number = 1;
  public readonly keyLastFourDigits: string;

  constructor(apiKey: string) {
    this.eventId = new EventId();
    this.occurredOn = new Date();
    this.keyLastFourDigits =
      apiKey.length <= 4 ? "****" : apiKey.substring(apiKey.length - 4);
  }
}
