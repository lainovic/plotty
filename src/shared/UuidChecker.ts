import { InvalidUuidError } from "./exceptions/InvalidUuidError";

export class UuidChecker {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  public static verify(uuid: string): boolean {
    return UuidChecker.UUID_REGEX.test(uuid);
  }

  public static validate(uuid: string) {
    if (!UuidChecker.verify(uuid)) {
      throw new InvalidUuidError();
    }
  }
}
