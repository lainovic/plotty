import React from "react";
import { Route } from "../../domain/entities/Route";
import { RouteLayer } from "./RouteLayer";
import {
  arePathComponentsPropsEqual,
  PathComponentsProps,
} from "../shared/PathComponentsProps";
import { onlyInDevelopment, useRenderTime } from "../hooks/useRenderTime";

export const RouteLayers: React.FC<PathComponentsProps<Route>> = React.memo(
  ({ layers }) => {
    useRenderTime("RouteLayers", onlyInDevelopment);

    return layers.map((layer) => (
      <RouteLayer key={layer.id.toString()} layer={layer} />
    ));
  },
  arePathComponentsPropsEqual
);
