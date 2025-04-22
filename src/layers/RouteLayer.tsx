import { LayerGroup } from "react-leaflet";
import { RoutePath } from "../types/paths";
import Point from "../points/Point";
import Origin from "../points/Origin";
import Destination from "../points/Destination";
import L from "leaflet";
import React from "react";
import Stop from "../points/Stop";
import { useMapLayer } from "./useMapLayer";
import { usePointFocus } from "./usePointFocus";

export default function RouteLayer({
  path,
  onLayerReady = () => {},
  color,
  visible = true,
}: {
  path: RoutePath;
  onLayerReady?: (layer: L.LayerGroup | null) => void;
  color?: string;
  visible?: boolean;
}) {
  const origin = path.points[0];
  const destination = path.points[path.points.length - 1];

  const pointMarkers = React.useRef<(L.Layer | null)[]>(
    new Array(path.points.length).fill(null)
  );

  const layerRef = React.useRef<L.LayerGroup | null>(null);
  const [layerReady, setLayerReady] = React.useState(false);

  useMapLayer({
    visible,
    onLayerReady,
    layerRef,
    ready: layerReady,
  });

  const {
    activePointIndex,
    isLayerFocused,
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
        onLayerReady(r);
      }}
    >
      {path.points.slice(1, -1).map((point, index) => (
        <Point
          index={index + 1} // adjust index to match the original array
          key={index + 1}
          point={point}
          onMarkerReady={(marker) => setMarkerRef(index + 1, marker)}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onClick={handlePointClick}
          color={color}
          highlighted={activePointIndex === index + 1 && isLayerFocused.current}
        />
      ))}
      {path.stops.map((stop, index) => (
        <Stop
          key={index}
          index={stop.index}
          point={stop.point}
          isChargingStation={stop.isChargingStation}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onClick={() => {
            handlePointClick(stop.index);
            isLayerFocused.current = true;
          }}
        />
      ))}
      <Origin
        key={0}
        point={origin}
        onMarkerReady={(marker) => {
          pointMarkers.current[0] = marker;
        }}
        onGoingForward={handleGoingForward}
        onGoingBackward={handleGoingBackward}
        onClick={() => {
          handlePointClick(0);
          isLayerFocused.current = true;
        }}
      />
      <Destination
        key={path.points.length - 1}
        point={destination}
        onMarkerReady={(marker) => {
          pointMarkers.current[path.points.length - 1] = marker;
        }}
        onGoingForward={handleGoingForward}
        onGoingBackward={handleGoingBackward}
        onClick={() => {
          handlePointClick(path.points.length - 1);
          isLayerFocused.current = true;
        }}
      />
    </LayerGroup>
  );
}
