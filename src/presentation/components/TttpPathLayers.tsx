import React from "react";
import { TtpPath } from "../../domain/entities/TtpPath";
import { TtpPathLayer } from "./TtpPathLayer";
import {
  arePathComponentsPropsEqual,
  PathComponentsProps,
} from "../shared/PathComponentsProps";

export const TtpPathLayers: React.FC<PathComponentsProps<TtpPath>> = React.memo(
  ({ layers }) => {
    return layers.map((layer) => (
      <TtpPathLayer key={layer.id.toString()} layer={layer} />
    ));
  },
  arePathComponentsPropsEqual
);
