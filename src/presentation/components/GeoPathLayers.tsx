import React from "react";
import { GeoPath } from "../../domain/entities/GeoPath";
import { GeoPathLayer } from "./GeoPathLayer";
import {
  arePathComponentsPropsEqual,
  PathComponentsProps,
} from "../shared/PathComponentsProps";
import { onlyInDevelopment, useRenderTime } from "../hooks/useRenderTime";

export const GeoPathLayers: React.FC<PathComponentsProps<GeoPath>> = React.memo(
  ({ layers }) => {
    useRenderTime("GeoPathLayers", onlyInDevelopment);

    return layers.map((layer) => (
      <GeoPathLayer key={layer.id.toString()} layer={layer} />
    ));
  },
  arePathComponentsPropsEqual
);
