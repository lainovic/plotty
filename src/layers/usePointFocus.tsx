import { useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";

export function usePointFocus(pointCount: number) {
  const [activePointIndex, setActivePointIndex] = React.useState<number>(0);
  const isLayerFocused = React.useRef(false);
  const map = useMap();
  const markers = React.useRef<(L.Layer | null)[]>(
    new Array(pointCount).fill(null)
  );

  // Handle map click to unfocus the layer.
  React.useEffect(() => {
    const handleMapClick = () => {
      isLayerFocused.current = false;
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map]);

  const handlePointClick = (index: number) => {
    setActivePointIndex(index);
    isLayerFocused.current = true;
  };

  const handleGoingForward = () => {
    markers.current[activePointIndex]?.closePopup();

    const newIndex = (activePointIndex + 1) % pointCount;
    setActivePointIndex(newIndex);

    markers.current[newIndex]?.openPopup();
  };

  const handleGoingBackward = () => {
    markers.current[activePointIndex]?.closePopup();

    const newIndex = (activePointIndex - 1 + pointCount) % pointCount;
    setActivePointIndex(newIndex);

    markers.current[newIndex]?.openPopup();
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!isLayerFocused.current) {
        return;
      }
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
  }, [activePointIndex]);

  return {
    activePointIndex,
    isLayerFocused,
    markers,
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    setMarkerRef: (index: number, marker: L.Layer | null) => {
      markers.current[index] = marker;
    },
  };
}
