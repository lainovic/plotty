import { Path } from "../entities/Path";
import { getTypeInfo } from "../utils/utils";
import { Coordinates } from "../value-objects/Coordinates";
import { EventId } from "../value-objects/EventId";
import { DomainEvent } from "./DomainEvent";

export class PathCreatedEvent<T extends Coordinates> implements DomainEvent {
  eventId: EventId;
  occurredOn: Date;
  eventType: string;
  version: number = 1;
  typeInfo: string;

  constructor(public readonly path: Path<T>) {
    this.eventId = new EventId();
    this.occurredOn = new Date();
    this.eventType = `PathCreated-${path.constructor.name}-${
      path.points[0]?.constructor.name || "Unknown"
    }`;
    this.typeInfo = getTypeInfo(path);
  }
}
