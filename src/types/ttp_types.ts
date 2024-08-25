import { GeoPoint } from "./geo_types";
import { Path } from "./common";

/**
 * Represents the type of a TTP point, either "Outgoing" or "Incoming".
 * Both represent the input to the map-matching algorithm.
 */
export enum TtpPointType {
  Outgoing = "237",
  Incoming = "245",
}

/**
 * Represents a point along a route coming from a TTP file.
 *
 * @property {TtpPointType} type - The type, either "Outgoing" or "Incoming".
 * @property {GeoPoint} point - The geographic coordinates.
 * @property {number} timestamp - The timestamp of a raw data point.
 * @property {number} speed - The speed at the given point.
 * @property {number} heading - The heading at the given point.
 */
export interface TtpPoint extends GeoPoint {
  type: TtpPointType;
  timestamp: number;
  speed: number;
  heading: number;
}

/**
 * A counter to keep track of the number of TTP paths created.
 */
let counter = 0;

/**
 * Represents a path coming from a TTP file.
 * Can't be just Path<TtpPoint> because instanceof doesn't work with types.
 */
export class TtpPath extends Path<TtpPoint> {
  constructor(points: TtpPoint[]) {
    super(points, `TTP Path ${++counter}`);
  }
}
