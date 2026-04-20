import { describe, it, expect } from "vitest";
import { LogcatParser } from "./LogcatParser";
import { Maybe } from "../../../shared/Maybe";

const parser = new LogcatParser();

// MM-DD HH:MM:SS.SSS PID TID LEVEL TAG: message
const mapMatcherLine =
  "04-19 10:00:00.000 1234 1234 I MapMatcher: MatchLocation result: lat: 52.37403, lon: 4.88969, arc_key: 123, on road: true";

const navigationLine =
  "04-19 10:00:01.000 1234 1234 I TomTomNavigation: 5th progress for the route (100) calculated: RouteProgress(latitude=52.38000 longitude=4.89000 distanceAlongRoute 500.0 m)";

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
