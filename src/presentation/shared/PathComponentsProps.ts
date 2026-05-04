import { Layer } from "../../domain/entities/Layer";
import { AnyPath } from "../../domain/entities/Path";
import { areLayersEqual } from "../../domain/utils/utils";

export interface PathComponentProps<T extends AnyPath> {
  layer: Layer<T>;
}

export interface PathComponentsProps<T extends AnyPath> {
  layers: Layer<T>[];
}

// Intentionally only compares id and visible — layer name changes do not
// affect rendering in *Layer components, so they don't trigger a re-render.
export function arePathComponentsPropsEqual<T extends AnyPath>(
  prevProps: PathComponentsProps<T>,
  nextProps: PathComponentsProps<T>
) {
  return areLayersEqual(prevProps.layers, nextProps.layers);
}
