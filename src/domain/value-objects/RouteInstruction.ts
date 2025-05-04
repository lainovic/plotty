import { Coordinates } from "./Coordinates";

/**
 * Represents a guidance instruction along a route.
 *
 * @property {Coordinates} point - The geographic coordinates of the point where the instruction should be followed.
 * @property {string} instruction - The instruction to follow.
 */
export class RouteInstruction {
  constructor(
    public readonly point: Coordinates,
    public readonly instruction: string
  ) {}
}
