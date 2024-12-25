import { LayerGroup, useMap } from "react-leaflet";
import { RoutePath } from "../types/paths";
import Point from "../points/Point";
import Origin from "../points/Origin";
import Destination from "../points/Destination";
import L from "leaflet";
import React from "react";

export default function RouteLayer({
  path,
  onLayerReady = () => {},
  color,
}: {
  path: RoutePath;
  onLayerReady?: (layer: L.LayerGroup | null) => void;
  color?: string;
}) {
  const origin = path.points[0];
  const destination = path.points[path.points.length - 1];

  const markers = React.useRef<(L.Layer | null)[]>(
    new Array(path.points.length).fill(null)
  );

  let currentFocusedIndex: number = 0;
  const isLayerFocused = React.useRef(false);

  useMap().on("click", () => {
    isLayerFocused.current = false;
  });

  const handleClick = (index: number) => {
    currentFocusedIndex = index;
    isLayerFocused.current = true;
  };

  const handleGoingForward = () => {
    markers.current[currentFocusedIndex]!.closePopup();
    currentFocusedIndex = (currentFocusedIndex + 1) % path.points.length;
    markers.current[currentFocusedIndex]!.openPopup();
  };

  const handleGoingBackward = () => {
    markers.current[currentFocusedIndex]!.closePopup();
    currentFocusedIndex =
      (currentFocusedIndex - 1 + path.points.length) % path.points.length;
    markers.current[currentFocusedIndex]!.openPopup();
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (isLayerFocused.current) {
        if (key === "l") {
          handleGoingForward();
        } else if (key === "h") {
          handleGoingBackward();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <LayerGroup
      ref={(r) => {
        onLayerReady(r);
      }}
    >
      {path.points.slice(1, -1).map((point, index) => (
        <Point
          index={index + 1} // adjust index to match the original array
          key={index + 1}
          point={point}
          onMarkerReady={(marker) => {
            markers.current[index + 1] = marker;
          }}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onClick={handleClick}
          color={color}
        />
      ))}
      <Origin
        key={0}
        point={origin}
        onMarkerReady={(marker) => {
          markers.current[0] = marker;
        }}
        onGoingForward={handleGoingForward}
        onGoingBackward={handleGoingBackward}
        onOriginClick={() => {
          currentFocusedIndex = 0;
          isLayerFocused.current = true;
        }}
      />
      <Destination
        key={path.points.length - 1}
        point={destination}
        onMarkerReady={(marker) => {
          markers.current[path.points.length - 1] = marker;
        }}
        onGoingForward={handleGoingForward}
        onGoingBackward={handleGoingBackward}
        onDestinationClick={() => {
          currentFocusedIndex = path.points.length - 1;
          isLayerFocused.current = true;
        }}
      />
    </LayerGroup>
  );
}
