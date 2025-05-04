import { RoutePoint } from "./RoutePoint";

/**
 * Represents a point along a route coming from a TTP file.
 *
 * @property {TtpPointType} type - The type of a TTP point.
 * @property {GeoPoint} point - The geographic coordinates.
 * @property {number} timestamp - The timestamp of a raw data point.
 * @property {number} speed - The speed at the given point.
 * @property {number} heading - The heading at the given point.
 */
export class TtpPoint extends RoutePoint {
  constructor(
    public readonly type: TtpPointType,
    latitude: number,
    longitude: number,
    public readonly speed: number | null,
    public readonly timestamp: number | null,
    public readonly heading: number | null
  ) {
    super(latitude, longitude, speed, timestamp, heading);
  }
}

/**
 * Represents the type of a TTP point.
 * Represents the input to the map-matching algorithm.
 */
export enum TtpPointType {
  Outgoing = "237",
  Incoming = "245",
}
