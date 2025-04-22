import { GeoPath } from "../types/geo_types";
import Point from "../points/Point";
import { LayerGroup, useMap } from "react-leaflet";
import React from "react";

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
  const map = useMap();
  const layerGroupRef = React.useRef<L.LayerGroup | null>(null);
  const markers = React.useRef<(L.Layer | null)[]>(
    new Array(path.points.length).fill(null)
  );

  const [activePointIndex, setActivePointIndex] = React.useState<number>(0);
  const isLayerFocused = React.useRef(false);

  React.useEffect(() => {
    const handleMapClick = () => {
      isLayerFocused.current = false;
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map]);

  React.useEffect(() => {
    if (!map) return;

    if (visible) {
      layerGroupRef.current?.addTo(map);
    } else {
      layerGroupRef.current?.removeFrom(map);
    }
  }, [visible, map]);

  const handleClick = (index: number) => {
    setActivePointIndex(index);
    isLayerFocused.current = true;
  };

  const handleGoingForward = () => {
    markers.current[activePointIndex]?.closePopup();

    const newIndex = (activePointIndex + 1) % path.points.length;
    setActivePointIndex(newIndex);

    markers.current[newIndex]?.openPopup();
  };

  const handleGoingBackward = () => {
    markers.current[activePointIndex]?.closePopup();

    const newIndex =
      (activePointIndex - 1 + path.points.length) % path.points.length;
    setActivePointIndex(newIndex);

    markers.current[newIndex]?.openPopup();
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLayerFocused.current) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "l") {
        handleGoingForward();
      } else if (key === "h") {
        handleGoingBackward();
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
        layerGroupRef.current = r;
        onLayerReady(r);
      }}
    >
      {path.points.map((point, index) => (
        <Point
          index={index}
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
