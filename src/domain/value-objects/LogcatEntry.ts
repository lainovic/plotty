export class LogcatEntry {
  constructor(
    public readonly level: string,
    public readonly tag: string,
    public readonly pid: number,
    public readonly tid: number,
    public readonly timestamp: number,
    public readonly message: string
  ) {}
}
