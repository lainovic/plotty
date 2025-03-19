import { GeoPoint } from "./geo_types";
import { Path } from "./common";
import {
  dropFirst,
  last,
  dropLast,
  first,
  GooglePolylineEncodingUtil,
} from "../utils";

/**
 * Represents a geographic point along a route, with optional metadata such as speed, timestamp, and heading.
 *
 * @property {number | null} speed - The speed at the geographic point, initially null.
 * @property {number | null} timestamp - The timestamp at the geographic point, initially null.
 * @property {number | null} heading - The heading at the geographic point, initially null.
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
 * @property {number} index - The index in the route points array.
 * @property {string | null} name - The name of the route stop, or null if not available.
 */
export type RouteStop = {
  point: GeoPoint;
  index: number;
  name: string | null;
  isChargingStation: boolean;
};

/**
 * Represents a leg of a route, which is a sequence of geographic points with a summary.
 *
 * @property {Summary} summary - The summary of the route leg.
 * @property {GeoPoint[]} points - The geographic points that make up the route leg.
 */
type RouteLeg = {
  summary: Summary;
  points: GeoPoint[];
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
  legs: RouteLeg[];
  stops: RouteStop[];
  instructions: RouteInstruction[];
  readonly source: RouteModel;

  constructor(source: RouteModel) {
    super([], `Route ${++counter}`);
    this.legs = legsFromSource(source);
    this.points = toRoutePoints(pointsFromLegs(this.legs));
    this.stops = stopsFromPath(this);
    this.instructions = instructionsFromSource(source);
    this.source = source;
  }
}

function legsFromSource(source: RouteModel): RouteLeg[] {
  if (isEncodedPolyline(source)) {
    return decodeRouteLegs(source);
  } else {
    return extractRouteLegs(source);
  }
}

function isEncodedPolyline(source: RouteModel): boolean {
  return source.legs.length > 0 && source.legs[0].encodedPolyline !== undefined;
}

function pointsFromLegs(legs: RouteLeg[]): GeoPoint[] {
  return legs.flatMap((leg, index) => {
    return index === 0 ? leg.points : dropFirst(leg.points);
  });
}

function toRoutePoints(points: GeoPoint[]): RoutePoint[] {
  return points.map((point) => ({
    ...point,
    speed: null,
    timestamp: null,
    heading: null,
  }));
}

function decodeRouteLegs(source: RouteModel): RouteLeg[] {
  return source.legs.map((leg) => {
    const decodedPolyline = GooglePolylineEncodingUtil.decode(
      leg.encodedPolyline ?? "",
      leg.encodedPolylinePrecision ?? 5
    );
    return {
      summary: leg.summary,
      points: decodedPolyline,
    };
  });
}

function extractRouteLegs(source: RouteModel): RouteLeg[] {
  return source.legs.map((leg) => ({
    summary: leg.summary,
    points: leg.points,
  }));
}

function stopsFromPath(path: RoutePath): RouteStop[] {
  const legs = path.legs;

  const origin = {
    point: first(first(legs).points),
    index: 0,
    name: "Departure",
    isChargingStation: false
  };

  const destination = {
    point: last(last(legs).points),
    index: path.points.length - 1,
    name: "Destination",
    isChargingStation: false,
  };

  const waypoints = waypointsFromPath(path);

  return [origin, ...waypoints, destination];
}

function waypointsFromPath(path: RoutePath): RouteStop[] {
  let index = 0;

  const seekPointIndex = (index: number, point: GeoPoint) => {
    while (index < path.points.length && 
      path.points[index].latitude !== point.latitude &&
      path.points[index].longitude !== point.longitude
    ) {
      index++;
    }
    return index;
  };

  const stops = dropLast(
      path.legs.map(
        (leg) => ({ isCs: leg.summary.chargingInformationAtEndOfLeg !== undefined, point: last(leg.points) })
      )
    ).map(({ isCs,  point }) => {
    index = seekPointIndex(index, point);
    return {
      point,
      index,
      name: "Waypoint",
      isChargingStation: isCs
    };
  });

  return stops;
}

function instructionsFromSource(source: RouteModel): RouteInstruction[] {
  try {
    return source.guidance.instructions.map((instruction) => ({
      point: instruction.maneuverPoint,
      instruction: instruction.maneuver,
    }));
  } catch (error) {
    console.error("Error parsing instructions from source: ", error);
    return [];
  }
}

export interface RouteModel {
  legs: {
    encodedPolyline?: string;
    encodedPolylinePrecision?: number;
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
  lengthInMeters: number;
  trafficDelayInSeconds: number;
  trafficLengthInMeters: number;
  travelTimeInSeconds: number;
  remainingChargeAtArrivalInkWh?: number;
  totalChargingTimeInSeconds?: number;
  chargingInformationAtEndOfLeg?: Record<string, unknown>
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
