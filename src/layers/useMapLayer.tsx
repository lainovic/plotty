import { useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";

interface UseMapLayerOptions {
  visible: boolean;
  onLayerReady?: (layerGroup: L.LayerGroup | null) => void;
  layerRef?: React.MutableRefObject<L.LayerGroup | null>;
  ready?: boolean;
}

export function useMapLayer({
  visible = true,
  onLayerReady,
  layerRef,
  ready = false,
}: UseMapLayerOptions) {
  const map = useMap();
  const internalLayerGroupRef = React.useRef<L.LayerGroup | null>(null);
  const effectiveLayerRef =
    (layerRef as React.MutableRefObject<L.LayerGroup | null>) ||
    internalLayerGroupRef;

  React.useEffect(() => {
    if (!ready || !map) return;
    if (!layerRef) {
      // Only create a new layer group if we're not given an external one.
      const layerGroup = new L.LayerGroup();
      effectiveLayerRef.current = layerGroup;
    }

    const layerGroup = effectiveLayerRef.current;

    if (layerGroup && onLayerReady) {
      onLayerReady(layerGroup);
    }

    if (visible) {
      layerGroup?.addTo(map);
    }

    return () => {
      if (!layerRef) {
        // Only clean up if we created it.
        layerGroup?.removeFrom(map);
      }
    };
  }, [ready, map, onLayerReady]);

  React.useEffect(() => {
    if (!ready || !map) return;

    if (visible) {
      effectiveLayerRef.current?.addTo(map);
    } else {
      effectiveLayerRef.current?.removeFrom(map);
    }
  }, [ready, visible, map]);

  return {
    layerGroup: effectiveLayerRef.current,
    map,
  };
}
