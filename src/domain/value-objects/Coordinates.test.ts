import { describe, expect, it } from "vitest";
import { Coordinates } from "./Coordinates";

describe("Coordinates", () => {
  it("rejects NaN latitude and longitude", () => {
    expect(() => new Coordinates(Number.NaN, 20)).toThrow(/finite number/);
    expect(() => new Coordinates(44.82, Number.NaN)).toThrow(/finite number/);
  });
});
