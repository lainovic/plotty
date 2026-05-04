import { describe, expect, it } from "vitest";
import { serializeLayers } from "./LayerSerializer";
import { createLayer } from "../entities/Layer";
import { Color } from "../value-objects/Color";
import { Path } from "../entities/Path";
import { Coordinates } from "../value-objects/Coordinates";

class UnsupportedPath extends Path<Coordinates> {}

describe("LayerSerializer", () => {
  it("throws for unsupported path subtypes instead of silently serializing them as geo", () => {
    const layer = createLayer(
      "Unsupported",
      Color.fromHex("#ff0000"),
      new UnsupportedPath([new Coordinates(1, 2)], "Unsupported")
    );

    expect(() => serializeLayers([layer])).toThrow(/Unsupported path type/);
  });
});
