import React from "react";
import { LayerGroup } from "react-leaflet";
import { useLayerVisibility } from "../hooks/useLayerVisibility";
import { usePointFocus } from "../hooks/usePointFocus";
import { Point } from "./points/Point";
import { GeoPath } from "../../domain/entities/GeoPath";
import { PathComponentProps } from "../shared/PathComponentsProps";

export const GeoPathLayer: React.FC<PathComponentProps<GeoPath>> = ({
  layer,
}) => {
  const geoPath = layer.getPath();
  const points = geoPath.points;

  const { setLayerGroup } = useLayerVisibility(layer);

  const {
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    handlePointReady,
  } = usePointFocus(points.length, layer.id.toString());

  return (
    <LayerGroup
      ref={(r) => {
        if (r) setLayerGroup(r);
      }}
    >
      {points.map((point, index) => (
        <Point
          key={index}
          title={`${index}`}
          point={point}
          onReady={(marker) => handlePointReady(index, marker)}
          onRight={handleGoingForward}
          onLeft={handleGoingBackward}
          onClick={() => {
            handlePointClick(index);
          }}
          color={layer.getColor().toHex()}
          radius={8}
        />
      ))}
    </LayerGroup>
  );
};
