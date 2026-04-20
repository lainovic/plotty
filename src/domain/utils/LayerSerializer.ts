import { Layer, createLayer } from "../entities/Layer";
import { GeoPath } from "../entities/GeoPath";
import { LogPath } from "../entities/LogPath";
import { TtpPath } from "../entities/TtpPath";
import { Route } from "../entities/Route";
import { Path } from "../entities/Path";
import { Color } from "../value-objects/Color";
import { Coordinates } from "../value-objects/Coordinates";
import { TtpPoint, TtpPointType } from "../value-objects/TtpPoint";
import { LogPoint } from "../value-objects/LogPoint";
import { LogLevel } from "../value-objects/LogLevel";
import { RouteSource } from "../value-objects/RoutingModel";

type SerializedGeoPath = {
  type: "geo";
  points: { latitude: number; longitude: number }[];
};

type SerializedTtpPath = {
  type: "ttp";
  points: {
    latitude: number;
    longitude: number;
    ttpType: string;
    speed: number | null;
    timestamp: number | null;
    heading: number | null;
  }[];
};

type SerializedLogPath = {
  type: "log";
  points: {
    latitude: number;
    longitude: number;
    level: string;
    tag: string;
    line: number;
    extra: Record<string, string>;
    timestamp: number | null;
    speed: number | null;
    heading: number | null;
  }[];
};

type SerializedRoute = {
  type: "route";
  source: RouteSource;
};

type SerializedPath =
  | SerializedGeoPath
  | SerializedTtpPath
  | SerializedLogPath
  | SerializedRoute;

type SerializedLayer = {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  path: SerializedPath;
};

function serializePath(path: Path<any>): SerializedPath {
  if (path instanceof Route) {
    return { type: "route", source: path.source };
  }
  if (path instanceof TtpPath) {
    return {
      type: "ttp",
      points: path.points.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
        ttpType: p.type,
        speed: p.speed,
        timestamp: p.timestamp,
        heading: p.heading,
      })),
    };
  }
  if (path instanceof LogPath) {
    return {
      type: "log",
      points: path.points.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
        level: p.level,
        tag: p.tag,
        line: p.line,
        extra: Object.fromEntries(p.extra),
        timestamp: p.timestamp,
        speed: p.speed,
        heading: p.heading,
      })),
    };
  }
  return {
    type: "geo",
    points: path.points.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
    })),
  };
}

function deserializePath(serialized: SerializedPath): Path<any> {
  switch (serialized.type) {
    case "route":
      return new Route(serialized.source);
    case "ttp":
      return new TtpPath(
        serialized.points.map(
          (p) =>
            new TtpPoint(
              p.ttpType as TtpPointType,
              p.latitude,
              p.longitude,
              p.speed,
              p.timestamp,
              p.heading
            )
        )
      );
    case "log":
      return new LogPath(
        serialized.points.map(
          (p) =>
            new LogPoint(
              p.latitude,
              p.longitude,
              p.level as LogLevel,
              p.tag,
              p.line,
              new Map(Object.entries(p.extra)),
              p.timestamp,
              p.speed,
              p.heading
            )
        )
      );
    case "geo":
      return new GeoPath(
        serialized.points.map((p) => new Coordinates(p.latitude, p.longitude))
      );
  }
}

export function serializeLayers(layers: Layer<any>[]): string {
  const serialized: SerializedLayer[] = layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    color: layer.color.toHex(),
    visible: layer.visible,
    path: serializePath(layer.path),
  }));
  return JSON.stringify(serialized);
}

export function deserializeLayers(json: string): Layer<any>[] {
  const serialized: SerializedLayer[] = JSON.parse(json);
  return serialized.map((s) => {
    const path = deserializePath(s.path);
    const layer = createLayer(s.name, Color.fromHex(s.color), path);
    return { ...layer, id: s.id, visible: s.visible };
  });
}
