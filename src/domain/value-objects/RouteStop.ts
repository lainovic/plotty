import { Coordinates } from "./Coordinates";

/**
 * Represents a stop along a route, which can be a start, end, or intermediate stop,
 * also known as a waypoint.
 *
 * @property {number} latitude - The latitude coordinate of the stop.
 * @property {number} longitude - The longitude coordinate of the stop.
 * @property {number} index - The index in the route points array.
 * @property {string | null} name - The name of the route stop, or null if not available.
 * @property {boolean} isChargingStation - The flag indicating if the given stop is a charging stop.
 */
export class RouteStop extends Coordinates {
  constructor(
    latitude: number,
    longitude: number,
    public readonly index: number,
    public readonly name: string | null,
    public readonly isChargingStation: boolean
  ) {
    super(latitude, longitude);
  }
}
