import { useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";

interface useLayerVisibilityOptions {
  visible: boolean;
  onLayerReady?: (layerGroup: L.LayerGroup | null) => void;
  layerRef: React.MutableRefObject<L.LayerGroup | null>;
  ready?: boolean;
}

export function useLayerVisibility({
  visible = true,
  onLayerReady,
  layerRef,
  ready = false,
}: useLayerVisibilityOptions) {
  const map = useMap();

  React.useEffect(() => {
    if (!ready || !map) return;

    const layerGroup = layerRef.current;

    if (layerGroup && onLayerReady) {
      onLayerReady(layerGroup);
    }

    if (visible) {
      layerGroup?.addTo(map);
    }

    return () => {
      layerGroup?.removeFrom(map);
    };
  }, [ready, map, onLayerReady]);

  React.useEffect(() => {
    if (!ready || !map) return;

    if (visible) {
      layerRef.current?.addTo(map);
    } else {
      layerRef.current?.removeFrom(map);
    }
  }, [ready, visible, map]);
}
