import React from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import { LayerPanel } from "./overlays/LayerPanel";
import { GotoDialog } from "./overlays/GotoDialog";
import { Route } from "../../domain/entities/Route";
import { RouteLayers } from "./RouteLayers";
import { filterLayers } from "../../domain/utils/layer-utils";
import { useMapContext } from "../contexts/MapContext";
import { Layer } from "../../domain/entities/Layer";
import { GeoPathLayers } from "./GeoPathLayers";
import { GeoPath } from "../../domain/entities/GeoPath";
import { TtpPathLayers } from "./TttpPathLayers";
import { useMapUtils } from "../hooks/useMapUtils";
import { ZoomText } from "./overlays/ZoomText";
import { RulerPanel } from "./overlays/RulerPanel";
import { TtpPath } from "../../domain/entities/TtpPath";

export const MapLayers = () => {
  const map = useMap();
  const { layerService } = useMapContext();

  const [layers, setLayers] = React.useState<Layer<any>[]>([]);

  React.useEffect(() => {
    const loadLayers = async () => {
      const loadedLayers = await layerService.getAllLayers();
      setLayers(loadedLayers);
    };
    loadLayers();
  }, [layerService]);

  useInputHandling();
  const routeLayers = filterLayers(layers, Route);
  const geoPathLayers = filterLayers(layers, GeoPath);
  const ttpPathLayers = filterLayers(layers, TtpPath);

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

  const { flyToBoundingBox, flyToCoordinates } = useMapUtils();

  return (
    <>
      <GotoDialog onCoordinatesChange={flyToCoordinates} />
      <ZoomText />
      <RulerPanel />
      <RouteLayers layers={routeLayers} />
      <GeoPathLayers layers={geoPathLayers} />
      <TtpPathLayers layers={ttpPathLayers} />
      <LayerPanel
        style={styles.layerPanel}
        layers={layers}
        onLayerClicked={(layer: Layer<any>) =>
          flyToBoundingBox(layer.getPoints())
        }
      />
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layerPanel: {
    position: "fixed",
    top: "50%",
    right: "10px",
    paddingTop: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "hsl(0, 0%, 100%, 0.8)",
    fontFamily: "'Roboto', sans-serif",
    borderRadius: "12px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "250px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1002,
    pointerEvents: "none",
  },
};
