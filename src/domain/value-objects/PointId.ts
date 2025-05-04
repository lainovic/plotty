import { UuidChecker } from "../../shared/UuidChecker";
import { v4 as uuid } from "uuid";

export class PointId {
  private readonly uuid: string;

  constructor() {
    this.uuid = uuid();
    UuidChecker.validate(this.uuid);
  }

  public equals(other: PointId) {
    return this.uuid === other.uuid;
  }
}
