import React from "react";
import { GeoPath } from "../../domain/entities/GeoPath";
import { GeoPathLayer } from "./GeoPathLayer";
import {
  arePathComponentsPropsEqual,
  PathComponentsProps,
} from "../shared/PathComponentsProps";

export const GeoPathLayers: React.FC<PathComponentsProps<GeoPath>> = React.memo(
  ({ layers }) => {
    return layers.map((layer) => (
      <GeoPathLayer key={layer.id.toString()} layer={layer} />
    ));
  },
  arePathComponentsPropsEqual
);
