import { LayerGroup } from "react-leaflet";
import { RoutePath } from "../types/paths";
import Point from "../points/Point";
import Origin from "../points/Origin";
import Destination from "../points/Destination";
import L from "leaflet";
import React from "react";
import Stop from "../points/Stop";
import { useLayerVisibility } from "./useLayerVisibility";
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

  const layerRef = React.useRef<L.LayerGroup | null>(null);
  const [layerReady, setLayerReady] = React.useState(false);

  useLayerVisibility({
    visible,
    onLayerReady,
    layerRef,
    ready: layerReady,
  });

  const {
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
      {path.points.slice(1, -1).map((point, index) => (
        <Point
          index={index + 1} // adjust index to match the original array
          key={index + 1}
          point={point}
          onMarkerReady={(marker) => setMarkerRef(index + 1, marker)}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onPointClick={() => {
            handlePointClick(index + 1);
          }}
          color={color}
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
          onStopClick={() => {
            handlePointClick(stop.index);
          }}
        />
      ))}
      <Origin
        key={0}
        point={origin}
        onMarkerReady={(marker) => {
          setMarkerRef(0, marker);
        }}
        onGoingForward={handleGoingForward}
        onGoingBackward={handleGoingBackward}
        onOriginClick={() => {
          handlePointClick(0);
        }}
      />
      <Destination
        key={path.points.length - 1}
        point={destination}
        onMarkerReady={(marker) => {
          setMarkerRef(path.points.length - 1, marker);
        }}
        onGoingForward={handleGoingForward}
        onGoingBackward={handleGoingBackward}
        onDestinationClick={() => {
          handlePointClick(path.points.length - 1);
        }}
      />
    </LayerGroup>
  );
}
