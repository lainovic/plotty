import { describe, expect, it } from "vitest";
import { serializeLayers, deserializeLayers } from "./LayerSerializer";
import { createLayer } from "../entities/Layer";
import { LogPath } from "../entities/LogPath";
import { Color } from "../value-objects/Color";
import { Path } from "../entities/Path";
import { Coordinates } from "../value-objects/Coordinates";
import { LogPoint } from "../value-objects/LogPoint";
import { LogLevel } from "../value-objects/LogLevel";
import { CrashEvent } from "../value-objects/CrashEvent";

class UnsupportedPath extends Path<Coordinates> {}

const samplePoint = new LogPoint(52.37, 4.89, LogLevel.Info, "MapMatcher", 1, new Map(), null, null, null);

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

describe("LayerSerializer — LogPath crash round-trip", () => {
  it("serializes and deserializes crashes correctly", () => {
    const crash: CrashEvent = {
      type: "fatal-exception",
      description: "FATAL EXCEPTION: main",
      lineNumber: 5,
      timestamp: 1000,
      nearestPointIndex: 0,
    };
    const path = new LogPath([samplePoint], [crash]);
    const layer = createLayer("test", Color.fromHex("#ff0000"), path);

    const json = serializeLayers([layer]);
    const restored = deserializeLayers(json);
    const restoredPath = restored[0].path as LogPath;

    expect(restoredPath.crashes).toHaveLength(1);
    expect(restoredPath.crashes[0].type).toBe("fatal-exception");
    expect(restoredPath.crashes[0].description).toBe("FATAL EXCEPTION: main");
    expect(restoredPath.crashes[0].nearestPointIndex).toBe(0);
  });

  it("deserializes legacy LogPath (no crashes field) as empty array", () => {
    const legacyJson = JSON.stringify([{
      id: "legacy-id",
      name: "Legacy",
      color: "#ff0000",
      visible: true,
      path: {
        type: "log",
        points: [{
          latitude: 52.37,
          longitude: 4.89,
          level: "INFO",
          tag: "MapMatcher",
          line: 1,
          extra: {},
          timestamp: null,
          speed: null,
          heading: null,
        }],
        // no crashes field
      },
    }]);

    const layers = deserializeLayers(legacyJson);
    expect((layers[0].path as LogPath).crashes).toEqual([]);
  });
});
