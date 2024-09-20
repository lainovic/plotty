import { tomtomPrimaryColor } from "../colors";
import { GeoPath } from "../types/geo_types";
import Point from "../points/Point";
import { LayerGroup, useMap } from "react-leaflet";
import React from "react";

export default function GeoLayer({
  path,
  onLayerReady = () => {},
  color = tomtomPrimaryColor,
}: {
  path: GeoPath;
  onLayerReady?: (layer: L.LayerGroup | null) => void;
  color?: string;
}) {
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
      {path.points.map((point, index) => (
        <Point
          index={index} // adjust index to match the original array
          key={index}
          point={point}
          onMarkerReady={(marker) => {
            markers.current[index] = marker;
          }}
          onGoingForward={handleGoingForward}
          onGoingBackward={handleGoingBackward}
          onClick={handleClick}
          color={color}
          radius={8}
        />
      ))}
    </LayerGroup>
  );
}
