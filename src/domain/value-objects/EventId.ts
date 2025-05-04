import { UuidChecker } from "../../shared/UuidChecker";
import { v4 as uuid } from "uuid";

export class EventId {
  private readonly uuid: string;

  constructor() {
    this.uuid = uuid();
    UuidChecker.validate(this.uuid);
  }

  public equals(other: EventId) {
    return this.uuid === other.uuid;
  }
}
