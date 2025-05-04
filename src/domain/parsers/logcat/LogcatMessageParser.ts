import { Optional } from "../../../shared/Optional";
import { LogcatEntry } from "../../value-objects/LogcatEntry";
import { ExtraMap } from "../../value-objects/LogPoint";
import {
  LogcatTagMatcher,
  SupportedTag,
  supportedTags,
} from "./LogcatTagMatcher";

export type LogcatMessage = {
  latitude: number;
  longitude: number;
  extra: ExtraMap;
};

interface MessageParser {
  parse(message: string): Optional<LogcatMessage>;
}

/**
 * e.g.:
 * MatchLocation result: lat: 35.69364400, lon: 139.77488353, arc_key: 2011983134088262593, on road: true, route_id: 6903 (optional)
 */
class MapMatcherParser implements MessageParser {
  parse(message: string): Optional<LogcatMessage> {
    const extra = new Map();
    const regex =
      /MatchLocation result.*lat:\s*([-\d.]+),\s*lon:\s*([-\d.]+).*on road:\s(true|false)(?:,.*route_id:\s(\d.*))?/;
    const match = message.match(regex);
    if (match) {
      const [, latitude, longitude, onRoad, routeId] = match;
      extra.set("on road", onRoad);
      if (routeId) extra.set("matched route ID", routeId);
      return Optional.some({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        extra,
      });
    }

    return Optional.none();
  }
}

/**
 * e.g.:
 * 20th progress for the route (6903) calculated: RouteProgress(distanceAlongRoute=2069.239953 m, remainingRouteStopsProgress=[RouteStopProgress(routeStopId=RouteStopId(value=30796833-aaa7-4a9a-a633-03d02130bdff), remainingTime=6m 0.245033944s, remainingDistance=1504.110047 m, remainingTrafficDelay=2m 3.300940597s), RouteStopProgress(routeStopId=RouteStopId(value=20ab3431-9768-48f2-805d-ee348bd81870), remainingTime=1h 1m 2.245033944s, remainingDistance=35341.820047 m, remainingTrafficDelay=7m 48.300940597s), RouteStopProgress(routeStopId=RouteStopId(value=56658ae2-5240-4a90-badf-c58f14c8eb73), remainingTime=1h 16m 24.245033944s, remainingDistance=41905.710047 m, remainingTrafficDelay=7m 48.300940597s)])
 */
class NavigationParser implements MessageParser {
  parse(message: string): Optional<LogcatMessage> {
    const extra = new Map();
    const regex =
      /latitude=(-?\d+\.\d+).*?longitude=(-?\d+\.\d+).*?distanceAlongRoute\s+(\d+\.\d+)\s+m/;
    const match = message.match(regex);
    if (match) {
      const [, latitude, longitude, distanceAlongRoute] = match;
      extra.set("distanceAlongRoute", distanceAlongRoute);
      return Optional.some({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        extra,
      });
    }

    return Optional.none();
  }
}

/**
 * e.g.:
 * Planning route with: RoutePlanningOptions(...
 */
class RoutePlannerParser implements MessageParser {
  parse(message: string): Optional<LogcatMessage> {
    const extra = new Map();
    const regex =
      /origin=ItineraryPoint\(.*?coordinate=GeoPoint\(latitude=([-\d.]+),\s*longitude=([-\d.]+)\).*?destination=ItineraryPoint\(.*?coordinate=GeoPoint\(latitude=([-\d.]+),\s*longitude=([-\d.]+)\)/;
    const match = message.match(regex);
    if (match) {
      console.log(`RoutePlannerParser match found!`, match);

      const [, originLat, originLon, destLat, destLon] = match;
      extra.set("planning origin", `${originLat}, ${originLon}`);
      extra.set("planning destination", `${destLat}, ${destLon}`);
      return Optional.some({
        latitude: parseFloat(originLat), // Use origin coordinates
        longitude: parseFloat(originLon),
        extra,
      });
    }

    return Optional.none();
  }
}

export type ParsePattern = {
  name: string;
  regex: RegExp;
};

class PatternParser implements LogcatMessageParser {
  constructor(private readonly patterns: ParsePattern[]) {}

  parse(message: string): Optional<LogcatMessage> {
    const extra = new Map();
    for (const { name, regex } of this.patterns) {
      const match = message.match(regex);
      if (match) {
        extra.set(name, highlightCaptureGroups(match));
      }
    }

    if (extra.size > 0) {
      return Optional.some({
        latitude: 0, // Pattern parser doesn't extract coordinates
        longitude: 0,
        extra,
      });
    }

    return Optional.none();
  }
}

function highlightCaptureGroups(match: RegExpMatchArray): string {
  if (!match || match.length === 0) return "";

  let result = match[0];
  // Start from 1 because match[0] is the full string
  for (let i = 1; i < match.length; i++) {
    const group = match[i];
    if (group) {
      // Replace each capture group with a red version
      result = result.replace(group, `\x1b[31m${group}\x1b[0m`);
    }
  }
  return result;
}

const tagToParser: Record<SupportedTag, new () => MessageParser> = {
  MapMatcher: MapMatcherParser,
  TomTomNavigation: NavigationParser,
  DistanceAlongRouteCalculator: NavigationParser,
  RoutePlanner: RoutePlannerParser,
};

export class LogcatMessageParser {
  static parse(logcatEntry: LogcatEntry): Optional<LogcatMessage> {
    const messageParsers = new Map(
      supportedTags.map((tag) => [tag, new tagToParser[tag]()])
    );

    return LogcatTagMatcher.getMatchingTag(logcatEntry.tag).flatMap(
      (matchingTag) => {
        const parser = messageParsers.get(matchingTag)!;
        return parser.parse(logcatEntry.message);
      }
    );
  }
}
