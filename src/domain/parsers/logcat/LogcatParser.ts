import { Maybe } from "../../../shared/Maybe";
import { LogPath } from "../../entities/LogPath";
import { LogcatEntry } from "../../value-objects/LogcatEntry";
import { LogLevel } from "../../value-objects/LogLevel";
import { LogPoint, ExtraMap } from "../../value-objects/LogPoint";
import { MaybeParsed, Parser } from "../Parser";

// --- Tag matching ---

const supportedTags = [
  "MapMatcher",
  "TomTomNavigation",
  "DistanceAlongRouteCalculator",
  "RoutePlanner",
] as const;

type SupportedTag = (typeof supportedTags)[number];

function getMatchingTag(tag: string): SupportedTag | null {
  return supportedTags.find((t) => tag.includes(t)) ?? null;
}

// --- Entry parsing (log line → LogcatEntry) ---

interface LogcatFormat {
  regex: RegExp;
  createFromMatch(match: RegExpMatchArray): LogcatEntry;
}

const logcatFormats: LogcatFormat[] = [
  // YYYY-MM-DD HH:MM:SS.SSS +HHMM PID TID I TAG: message
  {
    regex:
      /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\s+([+-]\d{4})\s+(\d+)\s+(\d+)\s+([VDIWEF])\s+([^:]+):\s+(.*)$/,
    createFromMatch: ([, date, time, timezone, pid, tid, level, tag, message]) =>
      buildEntry(date, time, pid, tid, level, tag, message, timezone),
  },
  // YYYY-MM-DD HH:MM:SS.mmm+TZ LEVEL TAG: MESSAGE
  {
    regex:
      /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\+(\d{4})\s+([VDIWEF])\s+([^:]+):\s+(.*)$/,
    createFromMatch: ([, date, time, timezone, level, tag, message]) =>
      buildEntry(date, time, "0", "0", level, tag, message, "+" + timezone),
  },
  // MM-DD HH:MM:SS.SSS PID TID I TAG: message
  {
    regex:
      /^(\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\s+(\d+)\s+(\d+)\s+([VDIWEF])\s+([^:]+):\s+(.*)$/,
    createFromMatch: ([, date, time, pid, tid, level, tag, message]) =>
      buildEntry(date, time, pid, tid, level, tag, message),
  },
  // HH:MM:SS.SSS [thread] INFO TAG - message
  {
    regex:
      /^(\d{2}:\d{2}:\d{2}\.\d{3})\s+\[([^\]]+)\]\s+([A-Z]+)\s+([^-]+)\s+-\s+(.*)$/,
    createFromMatch: ([, time, , level, tag, message]) =>
      buildEntry("", time, "0", "0", level, tag, message),
  },
];

function toUtcTimestamp(date: string, time: string, timezone?: string): number {
  if (date.length === 0 || time.length === 0) return -1;

  const result = new Date();
  if (date.includes("-")) {
    const [month, day] = date.split("-").map(Number);
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const [sec, ms] = seconds.toString().split(".").map(Number);

    result.setMonth(month - 1);
    result.setDate(day);
    result.setHours(hours, minutes, sec, ms);

    if (timezone) {
      const tzOffset = parseInt(timezone);
      const localOffset = result.getTimezoneOffset();
      result.setMinutes(result.getMinutes() + localOffset - tzOffset);
    }
  } else {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const [sec, ms] = seconds.toString().split(".").map(Number);
    result.setHours(hours, minutes, sec, ms);
  }

  return result.getTime();
}

function buildEntry(
  date: string,
  time: string,
  pid: string,
  tid: string,
  level: string,
  tag: string,
  message: string,
  timezone?: string
): LogcatEntry {
  return new LogcatEntry(
    level,
    tag,
    parseInt(pid),
    parseInt(tid),
    toUtcTimestamp(date, time, timezone),
    message
  );
}

function parseEntry(line: string): LogcatEntry | null {
  if (!line.trim()) return null;
  for (const fmt of logcatFormats) {
    const match = line.match(fmt.regex);
    if (match) return fmt.createFromMatch(match);
  }
  return null;
}

// --- Message parsing (LogcatEntry → lat/lng/extra) ---

type LogcatMessage = {
  latitude: number;
  longitude: number;
  extra: ExtraMap;
};

interface MessageParser {
  parse(message: string): LogcatMessage | null;
}

class MapMatcherParser implements MessageParser {
  parse(message: string): LogcatMessage | null {
    const extra = new Map<string, string>();
    const regex =
      /MatchLocation result.*lat:\s*([-\d.]+),\s*lon:\s*([-\d.]+).*on road:\s(true|false)(?:,.*route_id:\s(\d.*))?/;
    const match = message.match(regex);
    if (!match) return null;
    const [, latitude, longitude, onRoad, routeId] = match;
    extra.set("on road", onRoad);
    if (routeId) extra.set("matched route ID", routeId);
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude), extra };
  }
}

class NavigationParser implements MessageParser {
  parse(message: string): LogcatMessage | null {
    const extra = new Map<string, string>();
    const regex =
      /latitude=(-?\d+\.\d+).*?longitude=(-?\d+\.\d+).*?distanceAlongRoute\s+(\d+\.\d+)\s+m/;
    const match = message.match(regex);
    if (!match) return null;
    const [, latitude, longitude, distanceAlongRoute] = match;
    extra.set("distanceAlongRoute", distanceAlongRoute);
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude), extra };
  }
}

class RoutePlannerParser implements MessageParser {
  parse(message: string): LogcatMessage | null {
    const extra = new Map<string, string>();
    const regex =
      /origin=ItineraryPoint\(.*?coordinate=GeoPoint\(latitude=([-\d.]+),\s*longitude=([-\d.]+)\).*?destination=ItineraryPoint\(.*?coordinate=GeoPoint\(latitude=([-\d.]+),\s*longitude=([-\d.]+)\)/;
    const match = message.match(regex);
    if (!match) return null;
    const [, originLat, originLon, destLat, destLon] = match;
    extra.set("planning origin", `${originLat}, ${originLon}`);
    extra.set("planning destination", `${destLat}, ${destLon}`);
    return { latitude: parseFloat(originLat), longitude: parseFloat(originLon), extra };
  }
}

const tagToParser: Record<SupportedTag, new () => MessageParser> = {
  MapMatcher: MapMatcherParser,
  TomTomNavigation: NavigationParser,
  DistanceAlongRouteCalculator: NavigationParser,
  RoutePlanner: RoutePlannerParser,
};

function parseMessage(entry: LogcatEntry): LogcatMessage | null {
  const tag = getMatchingTag(entry.tag);
  if (tag === null) return null;
  return new tagToParser[tag]().parse(entry.message);
}

// --- Point conversion (entry + message → LogPoint) ---

function extractLogLevel(text: string): LogLevel {
  switch (text) {
    case "I": case "INFO":    return LogLevel.Info;
    case "W": case "WARN":    return LogLevel.Warn;
    case "E": case "ERROR":   return LogLevel.Error;
    case "D": case "DEBUG":   return LogLevel.Debug;
    case "T": case "TRACE":   return LogLevel.Trace;
    case "V": case "VERBOSE": return LogLevel.Verbose;
    default: throw new Error(`Unknown log level: ${text}`);
  }
}

function toLogPoint(entry: LogcatEntry, message: LogcatMessage, lineNumber: number): LogPoint | null {
  try {
    return new LogPoint(
      message.latitude,
      message.longitude,
      extractLogLevel(entry.level),
      entry.tag,
      lineNumber,
      message.extra,
      entry.timestamp
    );
  } catch {
    return null;
  }
}

// --- Public parser ---

export class LogcatParser implements Parser<LogPath> {
  parse(text: string): MaybeParsed<LogPath> {
    try {
      const points: LogPoint[] = [];

      text.split("\n").forEach((line, lineNumber) => {
        try {
          const entry = parseEntry(line);
          if (entry === null) return;
          const message = parseMessage(entry);
          if (message === null) return;
          const point = toLogPoint(entry, message, lineNumber);
          if (point !== null) points.push(point);
        } catch {
          // skip malformed entries
        }
      });

      if (points.length === 0) {
        return Maybe.failure("No routes found in the given logcat.");
      }

      return Maybe.success({
        paths: [new LogPath(points)],
        message: "Parsed Logcat successfully.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return Maybe.failure(`Error parsing as logcat: ${message}`);
    }
  }
}
