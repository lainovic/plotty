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
  const isFocusedRef = React.useRef(isFocused);
  const pointCountRef = React.useRef(pointCount);
  const layerIdRef = React.useRef(layerId);
  const map = useMap();
  const markers = React.useRef<(L.Layer | null)[]>(
    new Array(pointCount).fill(null)
  );

  React.useEffect(() => { isFocusedRef.current = isFocused; }, [isFocused]);
  React.useEffect(() => { pointCountRef.current = pointCount; }, [pointCount]);
  React.useEffect(() => { layerIdRef.current = layerId; }, [layerId]);

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
      if (!isFocusedRef.current) return;
      const key = event.key.toLowerCase();
      if (key === "l") { event.preventDefault(); handleGoingForward(); }
      else if (key === "h") { event.preventDefault(); handleGoingBackward(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => { window.removeEventListener("keydown", handleKeyDown); };
  }, []);

  const handlePointClick = React.useCallback((index: number) => {
    setFocusedLayerId(layerIdRef.current);
    currentIndex.current = index;
  }, [setFocusedLayerId]);

  const handleGoingForward = React.useCallback(() => {
    if (!isFocusedRef.current) return;
    const index = currentIndex.current;
    markers.current[index]?.closePopup();
    const newIndex = (index + 1) % pointCountRef.current;
    markers.current[newIndex]?.openPopup();
    currentIndex.current = newIndex;
    return newIndex;
  }, []);

  const handleGoingBackward = React.useCallback(() => {
    if (!isFocusedRef.current) return;
    const index = currentIndex.current;
    markers.current[index]?.closePopup();
    const newIndex = (index - 1 + pointCountRef.current) % pointCountRef.current;
    markers.current[newIndex]?.openPopup();
    currentIndex.current = newIndex;
    return newIndex;
  }, []);

  const handlePointReady = React.useCallback(
    (index: number, marker: L.Layer | null) => {
      markers.current[index] = marker;
    },
    []
  );

  return {
    handlePointClick,
    handleGoingForward,
    handleGoingBackward,
    handlePointReady,
  } as PointFocusHookReturnType;
}
