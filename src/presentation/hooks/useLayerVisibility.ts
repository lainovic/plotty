import React from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { LayerId } from "../../domain/value-objects/LayerId";
import { ListenerId } from "../../domain/value-objects/ListenerId";
import { Layer, VisibilityChangeListener } from "../../domain/entities/Layer";
import { Path } from "../../domain/entities/Path";

class LayerVisibilityChangeListener implements VisibilityChangeListener {
  public readonly id: ListenerId = new ListenerId();

  constructor(
    private readonly setVisibility: (newVisibility: boolean) => void
  ) {}

  onVisibilityChange(newVisibility: boolean): void {
    this.setVisibility(newVisibility);
  }
}

export function useLayerVisibility<T extends Path<any>>(layer: Layer<T>) {
  const map = useMap();
  const layerGroups = React.useRef<Map<LayerId, L.LayerGroup>>(new Map());

  const setVisibility = React.useCallback(
    (id: LayerId, visibility: boolean) => {
      const layerGroup = layerGroups.current.get(id);
      if (visibility) {
        layerGroup?.addTo(map);
      } else {
        layerGroup?.removeFrom(map);
      }
    },
    []
  );

  const setLayerGroup = React.useCallback((layerGroup: L.LayerGroup) => {
    layerGroups.current.set(layer.id, layerGroup);
  }, []);

  React.useEffect(() => {
    const setLayerVisibility = (newVisibility: boolean) => {
      setVisibility(layer.id, newVisibility);
    };
    const listener = new LayerVisibilityChangeListener(setLayerVisibility);

    layer.addVisibilityChangeListener(listener);
    return () => {
      layer.removeVisibilityChangeListener(listener);
    };
  }, [layer]);

  return {
    setLayerGroup,
  };
}
