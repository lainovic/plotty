import { Coordinates } from "./Coordinates";

/**
 * Represents a geographic point along a route, with optional metadata such as speed, timestamp, and heading.
 *
 * @property {number | null} speed - The speed at the geographic point, initially null.
 * @property {number | null} timestamp - The timestamp at the geographic point, initially null.
 * @property {number | null} heading - The heading at the geographic point, initially null.
 */
export class RoutePoint extends Coordinates {
  constructor(
    latitude: number,
    longitude: number,
    public readonly speed: number | null,
    public readonly timestamp: number | null,
    public readonly heading: number | null
  ) {
    super(latitude, longitude);
  }
}
