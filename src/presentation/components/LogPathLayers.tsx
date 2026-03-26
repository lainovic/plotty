import React from "react";
import {
  arePathComponentsPropsEqual,
  PathComponentsProps,
} from "../shared/PathComponentsProps";
import { onlyInDevelopment, useRenderTime } from "../hooks/useRenderTime";
import { LogPath } from "../../domain/entities/LogPath";
import { LogPathLayer } from "./LogPathLayer";

export const LogPathLayers: React.FC<PathComponentsProps<LogPath>> = React.memo(
  ({ layers }) => {
    useRenderTime("LogPathLayers", onlyInDevelopment);

    return layers
      .filter((layer) => layer.visible)
      .map((layer) => <LogPathLayer key={layer.id} layer={layer} />);
  },
  arePathComponentsPropsEqual
);
