import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { Path } from "../../../domain/entities/Path";
import { Layer } from "../../../domain/entities/Layer";
import L from "leaflet";
import "./LayerPanel.css";
import LayerItem from "./LayerItem";

interface LayerPanelProps<T extends Path<any>> {
  style?: React.CSSProperties;
  layers: Layer<T>[];
  onLayerClicked: (layer: Layer<T>) => void;
  onLayerZoomedIn: (layer: Layer<T>) => void;
  onVisibilityChange: (layer: Layer<T>) => void;
  onNameChange: (layer: Layer<T>, newName: string) => void;
}

export const LayerPanel = <T extends Path<any>>({
  style,
  layers,
  onLayerClicked,
  onLayerZoomedIn,
  onVisibilityChange,
  onNameChange,
}: LayerPanelProps<T>) => {
  const [isScrollable, setIsScrollable] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Prevent Leaflet from reacting to scroll and click events
    L.DomEvent.disableScrollPropagation(panel);
    L.DomEvent.disableClickPropagation(panel);
  }, []);

  return (
    <div ref={panelRef}>
      {layers.length > 0 && (
        <div style={style}>
          <h3 style={styles.header}>Layers</h3>
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
                onVisibilityChange={() => onVisibilityChange(layer)}
                name={layer.name}
                onNameChange={(newName) => onNameChange(layer, newName)}
                onClicked={onLayerClicked.bind(null, layer)}
                onZoomedIn={() => onLayerZoomedIn(layer)}
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
    fontSize: "1.1rem",
    color: `${tomtomSecondaryColor}`,
    padding: "0 10px 10px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    width: "100%",
    textAlign: "center",
    userSelect: "none",
    fontWeight: 600,
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
