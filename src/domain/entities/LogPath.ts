import { LogPoint } from "../value-objects/LogPoint";
import { Path } from "./Path";

/**
 * Represents a path coming from a TTP file.
 */
export class LogPath extends Path<LogPoint> {
  /**
   * A counter to keep track of the number of TTP paths created.
   */
  private static counter = 0;

  constructor(points: LogPoint[]) {
    super(points, `Log Path ${++LogPath.counter}`);
  }
}
