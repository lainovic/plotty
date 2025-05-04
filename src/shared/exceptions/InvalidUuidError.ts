export class InvalidUuidError extends Error {
  constructor(message: string = "Invalid UUID format.") {
    super(message);
  }
}
