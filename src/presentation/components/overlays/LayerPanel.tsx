import Checkbox from "@mui/material/Checkbox";
import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { Path } from "../../../domain/entities/Path";
import {
  Layer,
  LayerChangeListener,
} from "../../../domain/entities/Layer";
import { ListenerId } from "../../../domain/value-objects/ListenerId";
import L from "leaflet";
import "./LayerPanel.css";
import { IconButton } from "@mui/material";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import EditIcon from "@mui/icons-material/Edit";

interface LayerPanelProps<T extends Path<any>> {
  style?: React.CSSProperties;
  layers: Layer<T>[];
  onLayerClicked: (layer: Layer<T>) => void;
  onLayerZoomedIn: (layer: Layer<T>) => void;
  onNameChange: (layer: Layer<T>, newName: string) => void;
}

export const LayerPanel = <T extends Path<any>>({
  style,
  layers,
  onLayerClicked,
  onLayerZoomedIn,
  onNameChange,
}: LayerPanelProps<T>) => {
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [, setRenderTrigger] = React.useState({});
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Prevent Leaflet from reacting to scroll and click events
    L.DomEvent.disableScrollPropagation(panel);
    L.DomEvent.disableClickPropagation(panel);
  }, []);

  React.useEffect(() => {
    const listener: LayerChangeListener = {
      id: new ListenerId(),
      onLayerChange: () => setRenderTrigger({}),
    };

    layers.forEach((layer) => layer.addLayerChangeListener(listener));
    return () =>
      layers.forEach((layer) => layer.removeLayerChangeListener(listener));
  }, [layers]);

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
                key={layer.id.toString()}
                checked={layer.isVisible()}
                onValueChange={(newValue) => {
                  layer.setVisible(newValue);
                }}
                name={layer.getName()}
                onNameChange={(newName) => {
                  layer.setName(newName);
                  onNameChange(layer, newName);
                }}
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

interface CheckboxProps {
  name: string;
  checked: boolean;
  onValueChange: (newValue: boolean) => void;
  onNameChange: (newName: string) => void;
  onClicked: (e?: React.MouseEvent) => void;
  onZoomedIn: () => void;
}

const LayerItem: React.FC<CheckboxProps> = ({
  name,
  checked,
  onValueChange,
  onNameChange,
  onClicked,
  onZoomedIn,
}) => {
  return (
    <div style={styles.layerItem}>
      <Checkbox
        sx={{
          color: `${tomtomSecondaryColor}`,
          "&.Mui-checked": {
            color: `${tomtomSecondaryColor}`,
          },
        }}
        checked={checked}
        onChange={(event) => {
          onValueChange(event.target.checked);
        }}
        inputProps={{ "aria-label": "controlled" }}
      />
      <div className="layer-name" onClick={onClicked} style={styles.layerName}>
        {name}
      </div>
      <IconButton aria-label="center" onClick={onZoomedIn}>
        <AdsClickIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="edit"
        onClick={() => {
          const newName = prompt("Enter new name", name);
          if (newName && newName !== name) {
            onNameChange(newName);
          }
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    fontSize: "1.1rem",
    color: `${tomtomSecondaryColor}`,
    padding: "0 10px 10px",
    // marginBottom: "16px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    width: "100%",
    textAlign: "center",
    userSelect: "none",
    fontWeight: 600,
  },
  layerItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: "12px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    width: "100%",
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
  layerName: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "12px",
    transition: "background-color 0.4s ease",
    borderRadius: "10px",
    width: "100%",
  },
};
