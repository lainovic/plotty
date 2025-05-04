import { TtpPoint } from "../value-objects/TtpPoint";
import { Path } from "./Path";

/**
 * Represents a path coming from a TTP file.
 */
export class TtpPath extends Path<TtpPoint> {
  /**
   * A counter to keep track of the number of TTP paths created.
   */
  private static counter = 0;

  constructor(points: TtpPoint[]) {
    super(points, `TTP Path ${++TtpPath.counter}`);
  }
}
