import React from "react";
import { LayerGroup } from "react-leaflet";
import { usePointFocus } from "../hooks/usePointFocus";
import { Point } from "./points/Point";
import { GeoPath } from "../../domain/entities/GeoPath";
import { PathComponentProps } from "../shared/PathComponentsProps";

export const GeoPathLayer: React.FC<PathComponentProps<GeoPath>> = ({
  layer,
}) => {
  const points = layer.path.points;

  const {
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    handlePointReady,
    focusedPointIndex,
  } = usePointFocus(points.length, layer.id);

  return (
    <LayerGroup>
      {points.map((point, index) => (
        <Point
          key={`${index}-${point.latitude},${point.longitude}`}
          title={`${index}`}
          point={point}
          onReady={(marker) => handlePointReady(index, marker)}
          onRight={handleGoingForward}
          onLeft={handleGoingBackward}
          onClick={() => {
            handlePointClick(index);
          }}
          highlighted={index === focusedPointIndex}
          color={layer.color.toHex()}
          radius={8}
        />
      ))}
    </LayerGroup>
  );
};
