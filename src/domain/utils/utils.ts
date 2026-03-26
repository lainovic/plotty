import { Layer } from "../entities/Layer";
import { Path } from "../entities/Path";

export function filterLayers<T extends Path<any>>(
  layers: Layer<any>[],
  type: new (...args: any[]) => T
): Layer<T>[] {
  return layers.filter(
    (layer): layer is Layer<T> => layer.path instanceof type
  );
}

export function areLayersEqual<T extends Path<any>>(
  prevLayers: Layer<T>[],
  nextLayers: Layer<T>[]
): boolean {
  if (prevLayers.length !== nextLayers.length) return false;

  return prevLayers.every((prevLayer, index) => {
    const nextLayer = nextLayers[index];
    return prevLayer.id === nextLayer.id && prevLayer.visible === nextLayer.visible;
  });
}
