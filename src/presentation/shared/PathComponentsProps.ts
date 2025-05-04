import { Layer } from "../../domain/entities/Layer";
import { Path } from "../../domain/entities/Path";
import { areLayersEqual } from "../../domain/utils/utils";

export interface PathComponentProps<T extends Path<any>> {
  layer: Layer<T>;
}

export interface PathComponentsProps<T extends Path<any>> {
  layers: Layer<T>[];
}

export function arePathComponentsPropsEqual<T extends Path<any>>(
  prevProps: PathComponentsProps<T>,
  nextProps: PathComponentsProps<T>
) {
  return areLayersEqual(prevProps.layers, nextProps.layers);
}
