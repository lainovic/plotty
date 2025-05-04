import { LogLevel } from "./LogLevel";
import { RoutePoint } from "./RoutePoint";

export type ExtraMap = Map<string, string>;

/**
 * Represents a point along a route coming from a TTP file.
 *
 * @property {GeoPoint} point - The geographic coordinates.
 * @property {number} timestamp - The timestamp of a raw data point.
 * @property {number} speed - The speed at the given point.
 * @property {number} heading - The heading at the given point.
 */
export class LogPoint extends RoutePoint {
  constructor(
    latitude: number,
    longitude: number,
    public readonly level: LogLevel,
    public readonly tag: string,
    public readonly line: number,
    public readonly extra: ExtraMap = new Map(),
    public readonly timestamp: number | null = null,
    public readonly speed: number | null = null,
    public readonly heading: number | null = null
  ) {
    super(latitude, longitude, timestamp, speed, heading);
  }
}
