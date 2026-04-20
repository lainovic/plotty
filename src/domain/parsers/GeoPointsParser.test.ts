import { describe, it, expect } from "vitest";
import GeoPointsParser from "./GeoPointsParser";
import { Maybe } from "../../shared/Maybe";

const parser = new GeoPointsParser();

describe("GeoPointsParser", () => {
  it("parses bare lat/lon pair", () => {
    const result = parser.parse("52.37403, 4.88969");
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths).toHaveLength(1);
      const points = result.value.paths[0].points;
      expect(points[0].latitude).toBeCloseTo(52.37403);
      expect(points[0].longitude).toBeCloseTo(4.88969);
    }
  });

  it("parses named lat=/lon= format", () => {
    const result = parser.parse("lat=52.37403, lon=4.88969");
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(1);
    }
  });

  it("parses named latitude:/longitude: format", () => {
    const result = parser.parse("latitude: 52.37403, longitude: 4.88969");
    expect(Maybe.isSuccess(result)).toBe(true);
  });

  it("parses multiple coordinate pairs", () => {
    const result = parser.parse("52.0, 4.0\n53.0, 5.0\n54.0, 6.0");
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(3);
    }
  });

  it("returns failure on garbage input", () => {
    const result = parser.parse("hello world, no coordinates here");
    expect(Maybe.isFailure(result)).toBe(true);
  });

  it("returns failure on empty string", () => {
    const result = parser.parse("");
    expect(Maybe.isFailure(result)).toBe(true);
  });
});
