import React from "react";
import { Layer } from "../../domain/entities/Layer";
import { Color } from "../../domain/value-objects/Color";
import { useMapContext } from "../contexts/useMapContext";
import { LayerId } from "../../domain/value-objects/LayerId";
import { Path } from "../../domain/entities/Path";

export const useLayers = <T extends Path<any>>() => {
  const { layerService } = useMapContext();
  const [layers, setLayers] = React.useState<Layer<T>[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadLayers();
  }, []);

  const loadLayers = async () => {
    try {
      setLoading(true);
      const loadedLayers = await layerService.getAllLayers();
      setLayers(loadedLayers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load layers");
    } finally {
      setLoading(false);
    }
  };

  const createLayer = async (name: string, color: Color, path: T) => {
    try {
      setLoading(true);
      const newLayer = await layerService.createLayer<T>(name, color, path);
      setLayers((prev) => [...prev, newLayer]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create layer");
    } finally {
      setLoading(false);
    }
  };

  const deleteLayer = async (id: LayerId) => {
    try {
      setLoading(true);
      await layerService.deleteLayer(id);
      setLayers((prev) => prev.filter((layer) => layer.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete layer");
    } finally {
      setLoading(false);
    }
  };

  const toggleLayerVisibility = async (id: LayerId) => {
    try {
      setLoading(true);
      await layerService.toggleLayerVisibility(id);
      const layer = await layerService.getLayerById<T>(id);
      if (layer)
        setLayers((prev) => prev.map((l) => (l.id === id ? layer : l)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle layer visibility"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    layers,
    loading,
    error,
    createLayer,
    deleteLayer,
    toggleLayerVisibility,
  };
};
