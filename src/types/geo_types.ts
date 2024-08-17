import { Path } from "./common";

/**
 * Represents a geographic point with latitude and longitude coordinates.
 */
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Represents a path composed of a sequence of geographic points.
 * Can't be just Path<GeoPoint> because instanceof doesn't work with types.
 */
export class GeoPath extends Path<GeoPoint> {
  constructor(points: GeoPoint[]) {
    super(points);
  }
}
