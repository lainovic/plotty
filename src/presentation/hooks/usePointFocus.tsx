import { useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";

// Shared state to track which layer is currently focused
let currentFocusedLayerId: string | null = null;
let previousFocusedLayerId: string | null = null;

export interface PointFocusHookReturnType {
  handlePointClick: (index: number) => void;
  handleGoingForward: () => number;
  handleGoingBackward: () => number;
  handlePointReady: (index: number, marker: L.Layer | null) => void;
}

export function usePointFocus(
  pointCount: number,
  layerId?: string
): PointFocusHookReturnType {
  const currentIndex = React.useRef<number>(0);
  const map = useMap();
  const markers = React.useRef<(L.Layer | null)[]>(
    new Array(pointCount).fill(null)
  );

  // Handle map click to unfocus the layer.
  React.useEffect(() => {
    const handleMapClick = () => {
      if (layerId) {
        currentFocusedLayerId = null;
        previousFocusedLayerId = null;
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, layerId]);

  // Listen for focus changes from other layers
  React.useEffect(() => {
    if (!layerId) return;

    const checkFocus = () => {
      // If this layer was previously focused but now another layer is focused
      if (
        previousFocusedLayerId === layerId &&
        currentFocusedLayerId !== layerId
      ) {
        // Close any open popups
        markers.current.forEach((marker) => marker?.closePopup());
      }
    };

    // Check focus state periodically
    const interval = setInterval(checkFocus, 100);

    return () => {
      clearInterval(interval);
    };
  }, [layerId]);

  const handlePointClick = (index: number) => {
    if (layerId) {
      previousFocusedLayerId = currentFocusedLayerId;
      currentFocusedLayerId = layerId;
    }
    currentIndex.current = index;
  };

  const handleGoingForward = () => {
    if (layerId !== currentFocusedLayerId) return;

    const index = currentIndex.current;
    markers.current[index]?.closePopup();

    const newIndex = (index + 1) % pointCount;
    markers.current[newIndex]?.openPopup();

    currentIndex.current = newIndex;
    return newIndex;
  };

  const handleGoingBackward = () => {
    if (layerId !== currentFocusedLayerId) return;

    const index = currentIndex.current;
    markers.current[index]?.closePopup();

    const newIndex = (index - 1 + pointCount) % pointCount;
    markers.current[newIndex]?.openPopup();

    currentIndex.current = newIndex;
    return newIndex;
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (layerId !== currentFocusedLayerId) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "l") {
        event.preventDefault();
        handleGoingForward();
      } else if (key === "h") {
        event.preventDefault();
        handleGoingBackward();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [layerId]);

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
