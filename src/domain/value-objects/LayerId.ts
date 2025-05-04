import { UuidChecker } from "../../shared/UuidChecker";
import { v4 as uuid } from "uuid";

export class LayerId {
  private readonly uuid: string;

  constructor() {
    this.uuid = uuid();
    UuidChecker.validate(this.uuid);
  }

  public equals(other: LayerId) {
    return this.uuid === other.uuid;
  }
}
