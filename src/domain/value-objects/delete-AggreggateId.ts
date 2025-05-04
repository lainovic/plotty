import { UuidChecker } from "../../shared/UuidChecker";
import { v4 as uuid } from "uuid";

export class AggreggateId {
  private readonly uuid: string;

  constructor() {
    this.uuid = uuid();
    UuidChecker.validate(this.uuid);
  }

  public equals(other: AggreggateId) {
    return this.uuid === other.uuid;
  }
}
