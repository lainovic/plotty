import { Color } from "../value-objects/Color";
import { EventId } from "../value-objects/EventId";
import { LayerId } from "../value-objects/LayerId";
import { DomainEvent } from "./DomainEvent";

export class LayerVisibilityToggled implements DomainEvent {
  eventId: EventId;
  occurredOn: Date;
  eventType: string = "LayerVisibilityToggled";
  version: number = 1;

  constructor(
    public readonly layerId: LayerId,
    public readonly newVisibility: boolean
  ) {
    this.eventId = new EventId();
    this.occurredOn = new Date();
  }
}

export class LayerCreated implements DomainEvent {
  eventId: EventId;
  occurredOn: Date;
  eventType: string = "LayerCreated";
  version: number = 1;

  constructor(
    public readonly layerId: LayerId,
    public readonly name: string,
    public readonly color: Color
  ) {
    this.eventId = new EventId();
    this.occurredOn = new Date();
  }
}

export class LayerRemoved implements DomainEvent {
  eventId: EventId;
  occurredOn: Date;
  eventType: string = "LayerRemoved";
  version: number = 1;

  constructor(public readonly layerId: LayerId) {
    this.eventId = new EventId();
    this.occurredOn = new Date();
  }
}
