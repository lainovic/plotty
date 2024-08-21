import { GeoPoint } from "./geo_types";
import { Path } from "./common";
import { dropFirst, last, dropLast, first } from "../utils";

/**
 * Represents a geographic point along a route, with optional metadata such as speed, timestamp, and heading.
 *
 * @property {number | null} speed - The speed at the geographic point, or null if not available.
 * @property {number | null} timestamp - The timestamp at the geographic point, or null if not available.
 * @property {number | null} heading - The heading at the geographic point, or null if not available.
 */
export interface RoutePoint extends GeoPoint {
  speed: number | null;
  timestamp: number | null;
  heading: number | null;
}

/**
 * Represents a stop along a route, which can be a start, end, or intermediate stop,
 * also known as a waypoint.
 *
 * @property {GeoPoint} point - The geographic coordinates of the route stop.
 * @property {string | null} name - The name of the route stop, or null if not available.
 */
export type RouteStop = {
  point: GeoPoint;
  name: string | null;
};

/**
 * Represents a guidance instruction along a route.
 *
 * @property {GeoPoint} point - The geographic coordinates of the point where the instruction should be followed.
 * @property {string} instruction - The instruction to follow.
 */
export type RouteInstruction = {
  point: GeoPoint;
  instruction: string;
};

/**
 * A counter to keep track of the number of routes created.
 */
let counter = 0;

/**
 * Represents a route, which is a collection of geographic points, stops, and instructions.
 *
 * @property {RoutePoint[]} points - The geographic points that make up the route.
 * @property {RouteStop[]} stops - The stops along the route.
 * @property {RouteInstruction[]} instructions - The guidance instructions along the route.
 */
export class RoutePath extends Path<RoutePoint> {
  stops: RouteStop[];
  instructions: RouteInstruction[];
  readonly source: Route;

  constructor(source: Route) {
    super(pointsFromSource(source), `Route ${++counter}`);
    this.stops = stopsFromSource(source);
    this.instructions = instructionsFromSource(source);
    this.source = source;
  }
}

function pointsFromSource(source: Route): RoutePoint[] {
  return source.legs
    .flatMap((leg, index) => {
      if (index > 0) {
        return dropFirst(leg.points);
      } else {
        return leg.points;
      }
    })
    .map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
      speed: null,
      timestamp: null,
      heading: null,
    }));
}

function stopsFromSource(source: Route): RouteStop[] {
  const departure = {
    point: first(first(source.legs).points),
    name: "Departure",
  };
  const destination = {
    point: last(last(source.legs).points),
    name: "Destination",
  };
  const waypoints = dropLast(source.legs.map((leg) => last(leg.points))).map(
    (point) => ({
      point,
      name: "Waypoint",
    })
  );
  return [departure, ...waypoints, destination];
}

function instructionsFromSource(source: Route): RouteInstruction[] {
  return source.guidance.instructions.map((instruction) => ({
    point: instruction.maneuverPoint,
    instruction: instruction.maneuver,
  }));
}

export interface Route {
  legs: {
    points: {
      latitude: number;
      longitude: number;
    }[];
    summary: Summary;
  }[];
  summary: Summary;
  guidance: {
    instructions: GuidanceInstruction[];
  };
  progress: Progress[];
  sections: Section[];
}

interface Summary {
  departureTime: string;
  arrivalTime: string;
  historicTrafficTravelTimeInSeconds: number;
  lengthInMeters: number;
  liveTrafficIncidentsTravelTimeInSeconds: number;
  noTrafficTravelTimeInSeconds: number;
  trafficDelayInSeconds: number;
  trafficLengthInMeters: number;
  travelTimeInSeconds: number;
}

interface GuidanceInstruction {
  drivingSide: string;
  maneuver: string;
  maneuverPoint: {
    latitude: number;
    longitude: number;
  };
  routeOffsetInMeters: number;
  routePath: RoutePath[];
}

interface Progress {
  distanceInMeters: number;
  pointIndex: number;
  travelTimeInSeconds: number;
}

interface Section {
  delayInSeconds: number;
  effectiveSpeedInKmh: number;
  endPointIndex: number;
  magnitudeOfDelay: number;
  sectionType: string;
  simpleCategory: string;
  startPointIndex: number;
  tec: {
    effectCode: number;
    causes: {
      mainCauseCode: number;
    }[];
  };
}
