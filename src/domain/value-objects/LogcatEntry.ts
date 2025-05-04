/**
 * Represents a parsed logcat entry.
 */
export class LogcatEntry {
  constructor(
    public readonly level: string,
    public readonly tag: string,
    public readonly pid: number,
    public readonly tid: number,
    public readonly timestamp: number,
    public readonly message: string
  ) {
    this.validate(timestamp);
  }

  private validate(timestamp: number) {
    if (timestamp <= 0) {
      console.error(
        `Given timestamp is invalid (${timestamp}), but will continue with the creation of LogcatEntry.`
      );
    }
  }
}
