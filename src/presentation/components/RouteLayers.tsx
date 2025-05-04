import React from "react";
import { Route } from "../../domain/entities/Route";
import { RouteLayer } from "./RouteLayer";
import {
  arePathComponentsPropsEqual,
  PathComponentsProps,
} from "../shared/PathComponentsProps";

export const RouteLayers: React.FC<PathComponentsProps<Route>> = React.memo(
  ({ layers }) => {
    return layers.map((layer) => (
      <RouteLayer key={layer.id.toString()} layer={layer} />
    ));
  },
  arePathComponentsPropsEqual
);
