import { LogcatEntry } from "../../value-objects/LogcatEntry";
import { ExtraMap } from "../../value-objects/LogPoint";
import {
  LogcatTagMatcher,
  SupportedTag,
} from "./LogcatTagMatcher";

export type LogcatMessage = {
  latitude: number;
  longitude: number;
  extra: ExtraMap;
};

interface MessageParser {
  parse(message: string): LogcatMessage | null;
}

/**
 * e.g.:
 * MatchLocation result: lat: 35.69364400, lon: 139.77488353, arc_key: 2011983134088262593, on road: true, route_id: 6903 (optional)
 */
class MapMatcherParser implements MessageParser {
  parse(message: string): LogcatMessage | null {
    const extra = new Map();
    const regex =
      /MatchLocation result.*lat:\s*([-\d.]+),\s*lon:\s*([-\d.]+).*on road:\s(true|false)(?:,.*route_id:\s(\d.*))?/;
    const match = message.match(regex);
    if (match) {
      const [, latitude, longitude, onRoad, routeId] = match;
      extra.set("on road", onRoad);
      if (routeId) extra.set("matched route ID", routeId);
      return { latitude: parseFloat(latitude), longitude: parseFloat(longitude), extra };
    }
    return null;
  }
}

/**
 * e.g.:
 * 20th progress for the route (6903) calculated: RouteProgress(distanceAlongRoute=2069.239953 m, ...
 */
class NavigationParser implements MessageParser {
  parse(message: string): LogcatMessage | null {
    const extra = new Map();
    const regex =
      /latitude=(-?\d+\.\d+).*?longitude=(-?\d+\.\d+).*?distanceAlongRoute\s+(\d+\.\d+)\s+m/;
    const match = message.match(regex);
    if (match) {
      const [, latitude, longitude, distanceAlongRoute] = match;
      extra.set("distanceAlongRoute", distanceAlongRoute);
      return { latitude: parseFloat(latitude), longitude: parseFloat(longitude), extra };
    }
    return null;
  }
}

/**
 * e.g.:
 * Planning route with: RoutePlanningOptions(...
 */
class RoutePlannerParser implements MessageParser {
  parse(message: string): LogcatMessage | null {
    const extra = new Map();
    const regex =
      /origin=ItineraryPoint\(.*?coordinate=GeoPoint\(latitude=([-\d.]+),\s*longitude=([-\d.]+)\).*?destination=ItineraryPoint\(.*?coordinate=GeoPoint\(latitude=([-\d.]+),\s*longitude=([-\d.]+)\)/;
    const match = message.match(regex);
    if (match) {
      const [, originLat, originLon, destLat, destLon] = match;
      extra.set("planning origin", `${originLat}, ${originLon}`);
      extra.set("planning destination", `${destLat}, ${destLon}`);
      return { latitude: parseFloat(originLat), longitude: parseFloat(originLon), extra };
    }
    return null;
  }
}

const tagToParser: Record<SupportedTag, new () => MessageParser> = {
  MapMatcher: MapMatcherParser,
  TomTomNavigation: NavigationParser,
  DistanceAlongRouteCalculator: NavigationParser,
  RoutePlanner: RoutePlannerParser,
};

export class LogcatMessageParser {
  static parse(logcatEntry: LogcatEntry): LogcatMessage | null {
    const matchingTag = LogcatTagMatcher.getMatchingTag(logcatEntry.tag);
    if (matchingTag === null) return null;
    const parser = new tagToParser[matchingTag]();
    return parser.parse(logcatEntry.message);
  }
}
