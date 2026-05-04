import React from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LayerPanel } from "./overlays/LayerPanel";
import { GotoDialog } from "./overlays/GotoDialog";
import { filterLayers } from "../../domain/utils/utils";
import { createLayer } from "../../domain/entities/Layer";
import { FocusProvider } from "../contexts/FocusContext";
import { GeoPath } from "../../domain/entities/GeoPath";
import { TtpPath } from "../../domain/entities/TtpPath";
import { Route } from "../../domain/entities/Route";
import { LogPath } from "../../domain/entities/LogPath";
import { useMapUtils } from "../hooks/useMapUtils";
import { RulerPanel } from "./overlays/RulerPanel";
import { usePathImport } from "../hooks/usePathImport";
import { AnyPath } from "../../domain/entities/Path";
import { Color } from "../../domain/value-objects/Color";
import { useColors } from "../hooks/useLayerColors";
import { useLayerStore } from "../hooks/useLayerStore";
import { onlyInDevelopment, useRenderTime } from "../hooks/useRenderTime";
import { Z_INDEX } from "../constants/zIndex";
import { Coordinates } from "../../domain/value-objects/Coordinates";
import { GeoPathLayers, LogPathLayers, TtpPathLayers, RouteLayers } from "./LayersRenderer";
import { copyToClipboard } from "../utils/clipboard";

export const MapLayers = () => {
  useRenderTime("MapLayers", onlyInDevelopment);

  const map = useMap();
  const store = useLayerStore();
  const { getNextColor } = useColors();

  const { importing } = usePathImport({
    target: map.getContainer(),
    onPathsImported: (paths: AnyPath[]) => {
      store.addLayers(
        paths.map((path) =>
          createLayer(path.getName(), Color.fromHex(getNextColor()), path)
        )
      );
    },
  });

  const routeLayers = filterLayers(store.layers, Route);
  const geoPathLayers = filterLayers(store.layers, GeoPath);
  const ttpPathLayers = filterLayers(store.layers, TtpPath);
  const logPathLayers = filterLayers(store.layers, LogPath);

  React.useEffect(() => {
    const handleRightClick = (e: L.LeafletMouseEvent) => {
      const latlng = map.mouseEventToLatLng(e.originalEvent);
      const coordinates = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
      void copyToClipboard(
        coordinates,
        "Coordinates copied to clipboard.",
        "Failed to copy coordinates."
      );
    };

    map.on("contextmenu", handleRightClick);

    return () => {
      map.off("contextmenu", handleRightClick);
    };
  }, [map]);

  const { flyToBoundingBox, flyToCoordinates } = useMapUtils();

  return (
    <FocusProvider>
      {importing && (
        <div style={styles.overlay}>
          <div style={styles.spinner}>Importing...</div>
        </div>
      )}
      <LayerPanel
        style={styles.layerPanel}
        layers={store.layers}
        onLayerClicked={(layer) => flyToBoundingBox([...layer.path.points])}
        onVisibilityChange={(layer) => store.toggleVisibility(layer.id)}
        onNameChange={(layer, newName) => store.rename(layer.id, newName)}
        onDelete={(layer) => store.remove(layer.id)}
        onClearAll={store.clearAll}
        onColorChange={(layer, hex) => store.recolor(layer.id, hex)}
        onReorder={store.reorder}
      />
      <GotoDialog
        onCoordinatesChange={(coordinates: Coordinates) => {
          flyToCoordinates(coordinates, map.getZoom());
        }}
      />
      <RulerPanel />
      <RouteLayers layers={routeLayers} />
      <GeoPathLayers layers={geoPathLayers} />
      <TtpPathLayers layers={ttpPathLayers} />
      <LogPathLayers layers={logPathLayers} />
    </FocusProvider>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layerPanel: {
    position: "fixed",
    top: "50%",
    right: "10px",
    width: "clamp(280px, 24vw, 360px)",
    paddingTop: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "hsla(0, 0%, 100%, 0.8)",
    fontFamily: "'Roboto', sans-serif",
    borderRadius: "12px",
    zIndex: Z_INDEX.LAYER_PANEL,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)",
    border: "1px solid rgba(0,0,0,0.06)",
    backdropFilter: "blur(14px)",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: Z_INDEX.OVERLAY,
    pointerEvents: "none",
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "24px",
    color: "#fff",
  },
};
