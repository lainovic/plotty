import { GeoPath } from "../types/geo_types";
import Point from "../points/Point";
import { LayerGroup } from "react-leaflet";
import React from "react";
import { useLayerVisibility } from "./useLayerVisibility";
import { usePointFocus } from "./usePointFocus";

export default function PointLayer({
  path,
  onLayerReady = () => {},
  color,
  visible = true,
}: {
  path: GeoPath;
  onLayerReady?: (layer: L.LayerGroup | null) => void;
  color?: string;
  visible?: boolean;
}) {
  const layerRef = React.useRef<L.LayerGroup | null>(null);
  const [layerReady, setLayerReady] = React.useState(false);

  useLayerVisibility({
    visible,
    onLayerReady,
    layerRef,
    ready: layerReady,
  });

  const {
    isLayerFocused,
    currentIndex,
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    setMarkerRef,
  } = usePointFocus(path.points.length);

  return (
    <LayerGroup
      ref={(r) => {
        layerRef.current = r;
        if (r) setLayerReady(true);
      }}
    >
      {path.points.map((point, index) => (
        <Point
          index={index}
          key={index}
          point={point}
          onMarkerReady={(marker) => setMarkerRef(index, marker)}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onClick={handlePointClick}
          color={color}
          radius={8}
          highlighted={currentIndex.current === index && isLayerFocused.current}
        />
      ))}
    </LayerGroup>
  );
}
