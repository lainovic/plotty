import { Coordinates } from "../value-objects/Coordinates";
import { Path } from "./Path";

/**
 * Represents a path composed of a sequence of geographic points.
 * Can't be just Path<GeoPoint> because instanceof doesn't work with types.
 */
export class GeoPath extends Path<Coordinates> {
  /**
   * A counter to keep track of the number of geo paths created.
   */
  private static counter = 0;

  constructor(points: Coordinates[]) {
    super(
      points,
      `${points.length == 1 ? "Point" : "Points"} ${++GeoPath.counter}`
    );
  }
}
