import { describe, it, expect } from "vitest";
import { LogcatParser } from "./LogcatParser";
import { LogPath } from "../../entities/LogPath";
import { Maybe } from "../../../shared/Maybe";

const parser = new LogcatParser();

// MM-DD HH:MM:SS.SSS PID TID LEVEL TAG: message
const mapMatcherLine =
  "04-19 10:00:00.000 1234 1234 I MapMatcher: MatchLocation result: lat: 52.37403, lon: 4.88969, arc_key: 123, on road: true";

const navigationLine =
  "04-19 10:00:01.000 1234 1234 I TomTomNavigation: 5th progress for the route (100) calculated: RouteProgress(latitude=52.38000 longitude=4.89000 distanceAlongRoute 500.0 m)";

const fatalExceptionLine =
  "04-19 10:00:05.000 1234 1235 E AndroidRuntime: FATAL EXCEPTION: main";

const fatalSignalLine =
  "04-19 10:00:06.000 1234 1235 E libc: Fatal signal 11 (SIGSEGV), code 1, fault addr 0x0 in tid 1234";

const anrLine =
  "04-19 10:00:07.000 1234 1235 E ActivityManager: ANR in com.example.app (com.example.app/.MainActivity)";

describe("LogcatParser", () => {
  it("parses a MapMatcher logcat line", () => {
    const result = parser.parse(mapMatcherLine);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths).toHaveLength(1);
      const points = result.value.paths[0].points;
      expect(points[0].latitude).toBeCloseTo(52.37403);
      expect(points[0].longitude).toBeCloseTo(4.88969);
    }
  });

  it("parses a TomTomNavigation logcat line", () => {
    const result = parser.parse(navigationLine);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(1);
    }
  });

  it("parses multiple points from multiple lines", () => {
    const text = [mapMatcherLine, mapMatcherLine, mapMatcherLine].join("\n");
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(3);
    }
  });

  it("returns failure when no recognized lines are found", () => {
    const result = parser.parse("some random log line without matching tags");
    expect(Maybe.isFailure(result)).toBe(true);
  });

  it("returns failure on empty input", () => {
    const result = parser.parse("");
    expect(Maybe.isFailure(result)).toBe(true);
  });

  it("skips malformed lines and parses the rest", () => {
    const text = ["garbage ??? !!!", mapMatcherLine].join("\n");
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(1);
    }
  });
});

describe("LogcatParser — crash detection", () => {
  it("detects FATAL EXCEPTION and sets nearestPointIndex to last point before crash", () => {
    const text = [mapMatcherLine, fatalExceptionLine].join("\n");
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      const path = result.value.paths[0] as LogPath;
      expect(path.crashes).toHaveLength(1);
      expect(path.crashes[0].type).toBe("fatal-exception");
      expect(path.crashes[0].nearestPointIndex).toBe(0);
      expect(path.crashes[0].description).toMatch(/FATAL EXCEPTION/);
    }
  });

  it("assigns nearestPointIndex -1 when crash precedes all points", () => {
    const text = [fatalExceptionLine, mapMatcherLine].join("\n");
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      const path = result.value.paths[0] as LogPath;
      expect(path.crashes).toHaveLength(1);
      expect(path.crashes[0].nearestPointIndex).toBe(-1);
    }
  });

  it("detects Fatal signal with correct type", () => {
    const text = [mapMatcherLine, fatalSignalLine].join("\n");
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      const path = result.value.paths[0] as LogPath;
      expect(path.crashes).toHaveLength(1);
      expect(path.crashes[0].type).toBe("fatal-signal");
      expect(path.crashes[0].description).toMatch(/Fatal signal 11/);
    }
  });

  it("detects ANR with correct type", () => {
    const text = [mapMatcherLine, anrLine].join("\n");
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      const path = result.value.paths[0] as LogPath;
      expect(path.crashes).toHaveLength(1);
      expect(path.crashes[0].type).toBe("anr");
      expect(path.crashes[0].description).toMatch(/ANR in com\.example/);
    }
  });

  it("tracks nearestPointIndex across multiple points", () => {
    const text = [mapMatcherLine, mapMatcherLine, fatalExceptionLine].join("\n");
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      const path = result.value.paths[0] as LogPath;
      expect(path.crashes[0].nearestPointIndex).toBe(1);
    }
  });

  it("produces no crashes when none are present", () => {
    const result = parser.parse(mapMatcherLine);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      const path = result.value.paths[0] as LogPath;
      expect(path.crashes).toHaveLength(0);
    }
  });
});
