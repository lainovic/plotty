import React from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import { LayerPanel } from "./overlays/LayerPanel";
import { GotoDialog } from "./overlays/GotoDialog";
import { filterLayers } from "../../domain/utils/utils";
import { Layer, createLayer } from "../../domain/entities/Layer";
import { FocusProvider } from "../contexts/useFocusContext";
import { GeoPath } from "../../domain/entities/GeoPath";
import { TtpPath } from "../../domain/entities/TtpPath";
import { Route } from "../../domain/entities/Route";
import { LogPath } from "../../domain/entities/LogPath";
import { useMapUtils } from "../hooks/useMapUtils";
import { ZoomText } from "./overlays/ZoomText";
import { RulerPanel } from "./overlays/RulerPanel";
import { usePathImport } from "../hooks/usePathImport";
import { Path } from "../../domain/entities/Path";
import { Color } from "../../domain/value-objects/Color";
import { useColors } from "../hooks/useLayerColors";
import { onlyInDevelopment, useRenderTime } from "../hooks/useRenderTime";
import { Z_INDEX } from "../constants/zIndex";
import { Coordinates } from "../../domain/value-objects/Coordinates";
import { GeoPathLayers, LogPathLayers, TtpPathLayers, RouteLayers } from "./LayersRenderer";

export const MapLayers = () => {
  useRenderTime("MapLayers", onlyInDevelopment);

  const map = useMap();
  const [layers, setLayers] = React.useState<Layer<any>[]>([]);
  const [focusedLayerId, setFocusedLayerId] = React.useState<string | null>(null);
  const { getNextColor } = useColors();

  const { importing } = usePathImport({
    onPathsImported: (paths: Path<any>[]) => {
      const newLayers = paths.map((path) =>
        createLayer(path.getName(), Color.fromHex(getNextColor()), path)
      );
      setLayers((prev) => [...prev, ...newLayers]);
    },
  });

  const routeLayers = filterLayers(layers, Route);
  const geoPathLayers = filterLayers(layers, GeoPath);
  const ttpPathLayers = filterLayers(layers, TtpPath);
  const logPathLayers = filterLayers(layers, LogPath);

  React.useEffect(() => {
    const handleRightClick = (e: L.LeafletMouseEvent) => {
      const latlng = map.mouseEventToLatLng(e.originalEvent);
      const coordinates = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
      navigator.clipboard.writeText(coordinates);
      toast.success("Coordinates copied to clipboard.");
    };

    map.on("contextmenu", handleRightClick);

    return () => {
      map.off("contextmenu");
    };
  }, []);

  const { flyToBoundingBox, zoomToBoundingBox, flyToCoordinates } =
    useMapUtils();

  const toggleVisibility = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const renameLayer = (id: string, newName: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, name: newName } : l))
    );
  };

  return (
    <FocusProvider focusedLayerId={focusedLayerId} setFocusedLayerId={setFocusedLayerId}>
      {importing && (
        <div style={styles.overlay}>
          <div style={styles.spinner}>Importing...</div>
        </div>
      )}
      <LayerPanel
        style={styles.layerPanel}
        layers={layers}
        onLayerClicked={(layer: Layer<any>) =>
          flyToBoundingBox([...layer.path.points])
        }
        onLayerZoomedIn={(layer: Layer<any>) =>
          zoomToBoundingBox([...layer.path.points])
        }
        onVisibilityChange={(layer) => toggleVisibility(layer.id)}
        onNameChange={(layer, newName) => renameLayer(layer.id, newName)}
      />
      <GotoDialog
        onCoordinatesChange={(coordinates: Coordinates) => {
          flyToCoordinates(coordinates, map.getZoom());
        }}
      />
      <ZoomText />
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
    width: "200px",
    paddingTop: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "hsl(0, 0%, 100%, 0.8)",
    fontFamily: "'Roboto', sans-serif",
    borderRadius: "12px",
    zIndex: Z_INDEX.LAYER_PANEL,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
