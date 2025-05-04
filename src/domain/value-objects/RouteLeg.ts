import { Coordinates } from "./Coordinates";
import { Summary } from "./RoutingModel";

/**
 * Represents a leg of a route, which is a sequence of geographic points with a summary.
 *
 * @property {Summary} summary - The summary of the route leg.
 * @property {Coordinates[]} points - The geographic points that make up the route leg.
 */
export class RouteLeg {
  constructor(
    public readonly summary: Summary,
    public readonly points: Coordinates[]
  ) {}
}
