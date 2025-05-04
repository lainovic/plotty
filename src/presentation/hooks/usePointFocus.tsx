import { useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";

export function usePointFocus(pointCount: number) {
  const isLayerFocused = React.useRef(false);
  const currentIndex = React.useRef<number>(0);
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
    isLayerFocused.current = true;
    currentIndex.current = index;
  };

  const handleGoingForward = () => {
    const index = currentIndex.current;
    markers.current[index]?.closePopup();

    const newIndex = (index + 1) % pointCount;
    markers.current[newIndex]?.openPopup();

    currentIndex.current = newIndex;
    return newIndex;
  };

  const handleGoingBackward = () => {
    const index = currentIndex.current;
    markers.current[index]?.closePopup();

    const newIndex = (index - 1 + pointCount) % pointCount;
    markers.current[newIndex]?.openPopup();

    currentIndex.current = newIndex;
    return newIndex;
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
  }, []);

  const setMarker = (index: number, marker: L.Layer | null) => {
    markers.current[index] = marker;
  };

  return {
    isLayerFocused,
    markers,
    currentIndex,
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    setMarker,
  };
}
