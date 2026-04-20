import { describe, it, expect } from "vitest";
import RouteParser from "./RouteParser";
import { Maybe } from "../../shared/Maybe";

const parser = new RouteParser();

const summary = {
  departureTime: "2024-01-01T00:00:00Z",
  arrivalTime: "2024-01-01T01:00:00Z",
  lengthInMeters: 10000,
  trafficDelayInSeconds: 0,
  trafficLengthInMeters: 0,
  travelTimeInSeconds: 3600,
};

const validRoute = {
  legs: [
    {
      points: [
        { latitude: 52.0, longitude: 4.0 },
        { latitude: 52.1, longitude: 4.1 },
      ],
      summary,
    },
  ],
  summary,
  guidance: { instructions: [] },
  progress: [],
  sections: [],
};

const validJson = JSON.stringify({
  formatVersion: "0.0.12",
  routes: [validRoute],
});

describe("RouteParser", () => {
  it("parses a valid route JSON", () => {
    const result = parser.parse(validJson);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths).toHaveLength(1);
      expect(result.value.paths[0].points.length).toBeGreaterThan(0);
    }
  });

  it("returns failure for wrong format version", () => {
    const json = JSON.stringify({ formatVersion: "0.0.99", routes: [] });
    const result = parser.parse(json);
    expect(Maybe.isFailure(result)).toBe(true);
    if (Maybe.isFailure(result)) {
      expect(result.error).toContain("Unsupported JSON version");
    }
  });

  it("returns success with empty paths when routes array is absent", () => {
    const json = JSON.stringify({ formatVersion: "0.0.12" });
    const result = parser.parse(json);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths).toHaveLength(0);
    }
  });

  it("returns failure for invalid JSON", () => {
    const result = parser.parse("not json at all {{{");
    expect(Maybe.isFailure(result)).toBe(true);
    if (Maybe.isFailure(result)) {
      expect(result.error).toContain("Error parsing as JSON");
    }
  });

  it("returns failure for empty string", () => {
    const result = parser.parse("");
    expect(Maybe.isFailure(result)).toBe(true);
  });

  it("parses multiple routes", () => {
    const json = JSON.stringify({
      formatVersion: "0.0.12",
      routes: [validRoute, validRoute],
    });
    const result = parser.parse(json);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths).toHaveLength(2);
    }
  });
});
