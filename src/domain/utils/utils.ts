import { Layer } from "../entities/Layer";
import { AnyPath } from "../entities/Path";

type PathConstructor<T extends AnyPath> = abstract new (...args: unknown[]) => T;

export function filterLayers<T extends AnyPath>(
  layers: Layer<AnyPath>[],
  type: PathConstructor<T>
): Layer<T>[] {
  return layers.filter(
    (layer): layer is Layer<T> => layer.path instanceof type
  );
}

export function areLayersEqual<T extends AnyPath>(
  prevLayers: Layer<T>[],
  nextLayers: Layer<T>[]
): boolean {
  if (prevLayers.length !== nextLayers.length) return false;

  return prevLayers.every((prevLayer, index) => {
    const nextLayer = nextLayers[index];
    return (
      prevLayer.id === nextLayer.id &&
      prevLayer.visible === nextLayer.visible &&
      prevLayer.color.equals(nextLayer.color)
    );
  });
}
