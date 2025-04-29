import { Path } from "./common";

/**
 * Represents a geographic point with latitude and longitude coordinates.
 */
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * A counter to keep track of the number of geo paths created.
 */
let counter = 0;

/**
 * Represents a path composed of a sequence of geographic points.
 * Can't be just Path<GeoPoint> because instanceof doesn't work with types.
 */
export class GeoPath extends Path<GeoPoint> {
  constructor(points: GeoPoint[]) {
    super(points, `${points.length == 1 ? "Point" : "Points"} ${++counter}`);
  }
}
