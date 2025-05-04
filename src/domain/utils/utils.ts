import { Maybe } from "../../shared/Maybe";
import { Layer } from "../entities/Layer";
import { Path } from "../entities/Path";
import { Coordinates } from "../value-objects/Coordinates";
import { LogcatEntry } from "../value-objects/LogcatEntry";
import { LogPoint } from "../value-objects/LogPoint";

export function filterPaths<T extends Coordinates, U extends Path<any>>(
  paths: Path<T>[],
  type: new (...args: any[]) => U
): U[] {
  return paths.filter((path): path is U => path instanceof type);
}

export function filterLayers<T extends Path<any>>(
  layers: Layer<T>[],
  type: new (...args: any[]) => T
): Layer<T>[] {
  return layers.filter(
    (layer): layer is Layer<T> => layer.getPath() instanceof type
  );
}

export function areLayersEqual<T extends Path<any>>(
  prevLayers: Layer<T>[],
  nextLayers: Layer<T>[]
): boolean {
  if (prevLayers.length !== nextLayers.length) return false;

  return prevLayers.every((prevLayer, index) => {
    const nextLayer = prevLayers[index];
    return (
      prevLayer.id === nextLayer.id &&
      prevLayer.isVisible === nextLayer.isVisible
    );
  });
}

export function getTypeInfo<T extends Coordinates>(path: Path<T>): string {
  const pathType = path.constructor.name;
  const coordType = path.points[0]?.constructor.name || "Unknown";
  const pointCount = path.points.length;
  return `Path: ${pathType}, Coordinates: ${coordType}, Points: ${pointCount}`;
}

export function createLogPoint(
  date: string,
  time: string,
  level: string,
  tag: string,
  line: number,
  message: string,
  timezone?: string
): Maybe<string, LogPoint> {
  try {
    const logLevel = toLogLevel(level);
    const logDate = toDate(date, time, timezone);
    const coordinates = toCoordinates(message, tag);
    return Maybe.success(
      new LogPoint(
        logLevel,
        tag,
        line,
        coordinates.latitude,
        coordinates.longitude,
        logDate.getTIme()
      )
    );
  } catch (error: any) {
    return Maybe.failure(error.message);
  }
}

export function toLogPoint(
  entry: LogcatEntry,
  lineNumber: number,
  latitude: number,
  longitude: number
): LogPoint {
  const extra = parseMessage(entry.message);
  return new LogPoint(
    entry.level,
    entry.tag,
    lineNumber,
    latitude,
    longitude,
    extra
  );
}

export function parseMessage(message: string): Map<string, string> {
  return new Map();
}
