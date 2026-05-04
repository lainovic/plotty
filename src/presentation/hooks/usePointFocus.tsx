import { useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";
import { useFocusContext } from "../contexts/useFocusContext";
import { isTypingInInput } from "../utils/keyboardUtils";

export interface PointFocusHookReturnType {
  handlePointClick: (index: number) => void;
  handleGoingForward: () => number;
  handleGoingBackward: () => number;
  handlePointReady: (index: number, marker: L.Layer | null) => void;
  focusedPointIndex: number | null;
}

export function usePointFocus(
  pointCount: number,
  layerId: string
): PointFocusHookReturnType {
  const { focusLayer, blur, isFocused } = useFocusContext();
  const isLayerFocused = isFocused(layerId);

  const currentIndex = React.useRef<number>(0);
  const isFocusedRef = React.useRef(isLayerFocused);
  const pointCountRef = React.useRef(pointCount);
  const layerIdRef = React.useRef(layerId);
  const map = useMap();
  const markers = React.useRef<(L.Layer | null)[]>(
    new Array(pointCount).fill(null)
  );

  const [focusedPointIndex, setFocusedPointIndex] = React.useState<number | null>(null);

  React.useEffect(() => { isFocusedRef.current = isLayerFocused; }, [isLayerFocused]);
  React.useEffect(() => { pointCountRef.current = pointCount; }, [pointCount]);
  React.useEffect(() => { layerIdRef.current = layerId; }, [layerId]);

  // Close popups and clear highlight when this layer loses focus
  React.useEffect(() => {
    if (!isLayerFocused) {
      markers.current.forEach((marker) => marker?.closePopup());
      setFocusedPointIndex(null);
    }
  }, [isLayerFocused]);

  // Unfocus on map click
  React.useEffect(() => {
    const handleMapClick = () => blur();
    map.on("click", handleMapClick);
    return () => { map.off("click", handleMapClick); };
  }, [map, blur]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocusedRef.current || isTypingInInput(event)) return;
      const key = event.key.toLowerCase();
      if (key === "l") { event.preventDefault(); handleGoingForward(); }
      else if (key === "h") { event.preventDefault(); handleGoingBackward(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => { window.removeEventListener("keydown", handleKeyDown); };
  }, []);

  const handlePointClick = React.useCallback((index: number) => {
    focusLayer(layerIdRef.current);
    currentIndex.current = index;
    setFocusedPointIndex(index);
  }, [focusLayer]);

  const handleGoingForward = React.useCallback(() => {
    if (!isFocusedRef.current) return;
    const index = currentIndex.current;
    markers.current[index]?.closePopup();
    const newIndex = (index + 1) % pointCountRef.current;
    markers.current[newIndex]?.openPopup();
    currentIndex.current = newIndex;
    setFocusedPointIndex(newIndex);
    return newIndex;
  }, []);

  const handleGoingBackward = React.useCallback(() => {
    if (!isFocusedRef.current) return;
    const index = currentIndex.current;
    markers.current[index]?.closePopup();
    const newIndex = (index - 1 + pointCountRef.current) % pointCountRef.current;
    markers.current[newIndex]?.openPopup();
    currentIndex.current = newIndex;
    setFocusedPointIndex(newIndex);
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
    focusedPointIndex,
  } as PointFocusHookReturnType;
}
