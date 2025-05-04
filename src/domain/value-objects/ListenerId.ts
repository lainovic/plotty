import { UuidChecker } from "../../shared/UuidChecker";
import { v4 as uuid } from "uuid";

export class ListenerId {
  private readonly uuid: string;

  constructor() {
    this.uuid = uuid();
    UuidChecker.validate(this.uuid);
  }

  public equals(other: ListenerId) {
    return this.uuid === other.uuid;
  }
}
