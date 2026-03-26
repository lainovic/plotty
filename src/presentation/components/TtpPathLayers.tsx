import React from "react";
import { TtpPath } from "../../domain/entities/TtpPath";
import { TtpPathLayer } from "./TtpPathLayer";
import {
  arePathComponentsPropsEqual,
  PathComponentsProps,
} from "../shared/PathComponentsProps";
import { onlyInDevelopment, useRenderTime } from "../hooks/useRenderTime";

export const TtpPathLayers: React.FC<PathComponentsProps<TtpPath>> = React.memo(
  ({ layers }) => {
    useRenderTime("TtpPathLayers", onlyInDevelopment);

    return layers
      .filter((layer) => layer.visible)
      .map((layer) => <TtpPathLayer key={layer.id} layer={layer} />);
  },
  arePathComponentsPropsEqual
);
