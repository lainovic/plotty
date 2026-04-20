import { Coordinates } from "../value-objects/Coordinates";
import { Path } from "./Path";

/**
 * Represents a path composed of a sequence of geographic points.
 * Can't be just Path<GeoPoint> because instanceof doesn't work with types.
 */
export type GeoRenderHint = "points" | "line" | "polygon";

export class GeoPath extends Path<Coordinates> {
  private static counter = 0;
  readonly renderHint: GeoRenderHint;
  readonly properties?: Record<string, unknown>;

  constructor(
    points: Coordinates[],
    name?: string,
    renderHint: GeoRenderHint = "points",
    properties?: Record<string, unknown>,
  ) {
    const label = renderHint === "line" ? "Line"
                : renderHint === "polygon" ? "Polygon"
                : points.length === 1 ? "Point" : "Points";
    super(points, name ?? `${label} ${++GeoPath.counter}`);
    this.renderHint = renderHint;
    this.properties = properties;
  }
}
