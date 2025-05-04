import { Layer } from "../entities/Layer";
import { Path } from "../entities/Path";
import { Coordinates } from "../value-objects/Coordinates";

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
      prevLayer.isVisible === nextLayer.isVisible &&
      prevLayer.getColor().equals(nextLayer.getColor())
    );
  });
}

export function getTypeInfo<T extends Coordinates>(path: Path<T>): string {
  const pathType = path.constructor.name;
  const coordType = path.points[0]?.constructor.name || "Unknown";
  const pointCount = path.points.length;
  return `Path: ${pathType}, Coordinates: ${coordType}, Points: ${pointCount}`;
}
