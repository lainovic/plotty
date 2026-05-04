import { describe, it, expect } from "vitest";
import TtpParser from "./TtpParser";
import { Maybe } from "../../shared/Maybe";
import { TtpPointType } from "../value-objects/TtpPoint";

const parser = new TtpParser();

// fields: timestamp,type,_,lon,_,lat,_,_,_,heading,_,speed
const ttpPoint = (ts: number, type: TtpPointType, lat: number, lon: number) =>
  `${ts},${type},x,${lon},x,${lat},x,x,x,180.0,x,30.5`;

const header = "BEGIN:ApplicationVersion=TomTom Positioning 0.7";

const validTtp = (lines: string[]) => [header, ...lines].join("\n");

describe("TtpParser", () => {
  it("parses incoming points from a valid TTP file", () => {
    const text = validTtp([
      ttpPoint(1000000, TtpPointType.Incoming, 52.37403, 4.88969),
      ttpPoint(1000001, TtpPointType.Incoming, 52.38000, 4.89000),
    ]);
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths).toHaveLength(1);
      expect(result.value.paths[0].points).toHaveLength(2);
    }
  });

  it("parses outgoing points when no incoming points exist", () => {
    const text = validTtp([
      ttpPoint(1000000, TtpPointType.Outgoing, 52.37403, 4.88969),
    ]);
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(1);
      expect(result.value.message).toContain("outgoing");
    }
  });

  it("stores numeric speed values", () => {
    const text = validTtp([
      ttpPoint(1000000, TtpPointType.Incoming, 52.37403, 4.88969),
    ]);
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(typeof result.value.paths[0].points[0].speed).toBe("number");
      expect(result.value.paths[0].points[0].speed).toBeCloseTo(30.5);
    }
  });

  it("skips duplicate timestamps", () => {
    const text = validTtp([
      ttpPoint(1000000, TtpPointType.Incoming, 52.37403, 4.88969),
      ttpPoint(1000000, TtpPointType.Incoming, 52.38000, 4.89000),
    ]);
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(1);
    }
  });

  it("skips comment lines", () => {
    const text = validTtp([
      "# this is a comment",
      ttpPoint(1000000, TtpPointType.Incoming, 52.37403, 4.88969),
    ]);
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths[0].points).toHaveLength(1);
    }
  });

  it("returns success with empty paths when TTP has no points", () => {
    const text = validTtp(["# only a comment"]);
    const result = parser.parse(text);
    expect(Maybe.isSuccess(result)).toBe(true);
    if (Maybe.isSuccess(result)) {
      expect(result.value.paths).toHaveLength(0);
    }
  });

  it("returns failure for wrong header", () => {
    const result = parser.parse("NOT A TTP FILE\n" + ttpPoint(1, TtpPointType.Incoming, 52, 4));
    expect(Maybe.isFailure(result)).toBe(true);
    if (Maybe.isFailure(result)) {
      expect(result.error).toContain("Error parsing as TTP");
    }
  });

  it("returns failure for unsupported version", () => {
    const result = parser.parse(
      "BEGIN:ApplicationVersion=TomTom Positioning 0.6\n" +
        ttpPoint(1, TtpPointType.Incoming, 52, 4)
    );
    expect(Maybe.isFailure(result)).toBe(true);
    if (Maybe.isFailure(result)) {
      expect(result.error).toContain("Unsupported TTP version");
    }
  });
});
