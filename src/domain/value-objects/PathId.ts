import { UuidChecker } from "../../shared/UuidChecker";
import { v4 as uuid } from "uuid";

export class PathId {
  private readonly uuid: string;

  constructor() {
    this.uuid = uuid();
    UuidChecker.validate(this.uuid);
  }

  public equals(other: PathId) {
    return this.uuid === other.uuid;
  }
}
