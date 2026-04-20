import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { Path } from "../../../domain/entities/Path";
import { Layer } from "../../../domain/entities/Layer";
import L from "leaflet";
import "./LayerPanel.css";
import LayerItem from "./LayerItem";
import { IconButton } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

interface LayerPanelProps<T extends Path<any>> {
  style?: React.CSSProperties;
  layers: Layer<T>[];
  onLayerClicked: (layer: Layer<T>) => void;
  onLayerZoomedIn: (layer: Layer<T>) => void;
  onVisibilityChange: (layer: Layer<T>) => void;
  onNameChange: (layer: Layer<T>, newName: string) => void;
  onDelete: (layer: Layer<T>) => void;
  onClearAll: () => void;
  onColorChange: (layer: Layer<T>, hex: string) => void;
}

export const LayerPanel = <T extends Path<any>>({
  style,
  layers,
  onLayerClicked,
  onLayerZoomedIn,
  onVisibilityChange,
  onNameChange,
  onDelete,
  onClearAll,
  onColorChange,
}: LayerPanelProps<T>) => {
  const [isScrollable, setIsScrollable] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    L.DomEvent.disableScrollPropagation(panel);
    L.DomEvent.disableClickPropagation(panel);
  }, []);

  return (
    <div ref={panelRef}>
      {layers.length > 0 && (
        <div style={style}>
          <div style={styles.header}>
            <h3 style={styles.title}>Layers</h3>
            <IconButton
              aria-label="clear all layers"
              size="small"
              onClick={onClearAll}
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </div>
          <div
            ref={(ref) => {
              if (ref) {
                setIsScrollable(ref.scrollHeight > ref.clientHeight);
              }
            }}
            style={{
              ...styles.layerList,
              boxShadow: isScrollable
                ? "inset 0 10px 15px -10px rgba(0, 0, 0, 0.2), inset 0 -10px 15px -10px rgba(0, 0, 0, 0.2)"
                : "none",
            }}
          >
            {layers.map((layer) => (
              <LayerItem
                key={layer.id}
                checked={layer.visible}
                color={layer.color.toHex().slice(0, 7)}
                pointCount={layer.path.points.length}
                onVisibilityChange={() => onVisibilityChange(layer)}
                name={layer.name}
                onNameChange={(newName) => onNameChange(layer, newName)}
                onClicked={onLayerClicked.bind(null, layer)}
                onZoomedIn={() => onLayerZoomedIn(layer)}
                onDelete={() => onDelete(layer)}
                onColorChange={(hex) => onColorChange(layer, hex)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px 10px 10px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
  title: {
    fontSize: "1.1rem",
    color: `${tomtomSecondaryColor}`,
    userSelect: "none",
    fontWeight: 600,
    margin: 0,
  },
  layerList: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "0 0 12px 12px",
    alignItems: "flex-start",
    justifyContent: "start",
    overflowY: "auto",
    maxHeight: "250px",
    scrollbarWidth: "thin",
    scrollbarColor: `${tomtomSecondaryColor}CC transparent`,
    width: "100%",
  },
};
