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
    isLayerFocused,
    currentIndex,
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    setMarker,
  } = usePointFocus(points.length);

  return (
    <LayerGroup
      ref={(r) => {
        if (r) setLayerGroup(r);
      }}
    >
      {points.map((point, index) => (
        <Point
          index={index}
          key={index}
          point={point}
          onReady={(marker) => setMarker(index, marker)}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onPointClick={() => {
            handlePointClick(index);
          }}
          color={layer.getColor().toHex()}
          radius={8}
          highlighted={currentIndex.current === index && isLayerFocused.current}
        />
      ))}
    </LayerGroup>
  );
};
