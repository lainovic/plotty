import { CrashEvent } from "../value-objects/CrashEvent";
import { LogPoint } from "../value-objects/LogPoint";
import { Path } from "./Path";

export class LogPath extends Path<LogPoint> {
  private static counter = 0;

  constructor(
    points: LogPoint[],
    public readonly crashes: CrashEvent[] = []
  ) {
    super(points, `Log Path ${++LogPath.counter}`);
  }
}
