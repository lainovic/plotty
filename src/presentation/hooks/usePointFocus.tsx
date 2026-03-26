import { useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";
import { useFocusContext } from "../contexts/useFocusContext";

export interface PointFocusHookReturnType {
  handlePointClick: (index: number) => void;
  handleGoingForward: () => number;
  handleGoingBackward: () => number;
  handlePointReady: (index: number, marker: L.Layer | null) => void;
}

export function usePointFocus(
  pointCount: number,
  layerId: string
): PointFocusHookReturnType {
  const { focusedLayerId, setFocusedLayerId } = useFocusContext();
  const isFocused = focusedLayerId === layerId;

  const currentIndex = React.useRef<number>(0);
  const map = useMap();
  const markers = React.useRef<(L.Layer | null)[]>(
    new Array(pointCount).fill(null)
  );

  // Close popups when this layer loses focus
  React.useEffect(() => {
    if (!isFocused) {
      markers.current.forEach((marker) => marker?.closePopup());
    }
  }, [isFocused]);

  // Unfocus on map click
  React.useEffect(() => {
    const handleMapClick = () => setFocusedLayerId(null);
    map.on("click", handleMapClick);
    return () => { map.off("click", handleMapClick); };
  }, [map]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused) return;
      const key = event.key.toLowerCase();
      if (key === "l") { event.preventDefault(); handleGoingForward(); }
      else if (key === "h") { event.preventDefault(); handleGoingBackward(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => { window.removeEventListener("keydown", handleKeyDown); };
  }, [isFocused]);

  const handlePointClick = (index: number) => {
    setFocusedLayerId(layerId);
    currentIndex.current = index;
  };

  const handleGoingForward = () => {
    if (!isFocused) return;
    const index = currentIndex.current;
    markers.current[index]?.closePopup();
    const newIndex = (index + 1) % pointCount;
    markers.current[newIndex]?.openPopup();
    currentIndex.current = newIndex;
    return newIndex;
  };

  const handleGoingBackward = () => {
    if (!isFocused) return;
    const index = currentIndex.current;
    markers.current[index]?.closePopup();
    const newIndex = (index - 1 + pointCount) % pointCount;
    markers.current[newIndex]?.openPopup();
    currentIndex.current = newIndex;
    return newIndex;
  };

  const handlePointReady = (index: number, marker: L.Layer | null) => {
    markers.current[index] = marker;
  };

  return {
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    handlePointReady,
  } as PointFocusHookReturnType;
}
