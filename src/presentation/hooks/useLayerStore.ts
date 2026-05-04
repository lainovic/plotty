import React from "react";
import { Layer } from "../../domain/entities/Layer";
import { AnyPath } from "../../domain/entities/Path";
import { Color } from "../../domain/value-objects/Color";
import { usePersistedLayers } from "./usePersistedLayers";

export interface LayerStore {
  layers: Layer<AnyPath>[];
  addLayers(layers: Layer<AnyPath>[]): void;
  toggleVisibility(id: string): void;
  rename(id: string, newName: string): void;
  remove(id: string): void;
  recolor(id: string, hex: string): void;
  reorder(fromIndex: number, toIndex: number): void;
  clearAll(): void;
}

export function useLayerStore(): LayerStore {
  const [layers, setLayers] = usePersistedLayers();

  const addLayers = React.useCallback((newLayers: Layer<AnyPath>[]) => {
    setLayers((prev) => [...prev, ...newLayers]);
  }, [setLayers]);

  const toggleVisibility = React.useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, [setLayers]);

  const rename = React.useCallback((id: string, newName: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: newName } : l))
    );
  }, [setLayers]);

  const remove = React.useCallback((id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, [setLayers]);

  const recolor = React.useCallback((id: string, hex: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, color: Color.fromHex(hex) } : l))
    );
  }, [setLayers]);

  const reorder = React.useCallback((fromIndex: number, toIndex: number) => {
    setLayers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, [setLayers]);

  const clearAll = React.useCallback(() => {
    setLayers([]);
  }, [setLayers]);

  return { layers, addLayers, toggleVisibility, rename, remove, recolor, reorder, clearAll };
}
