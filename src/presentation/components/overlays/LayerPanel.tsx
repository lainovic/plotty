import { IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { Path } from "../../../domain/entities/Path";
import {
  Layer,
  VisibilityChangeListener,
} from "../../../domain/entities/Layer";
import { ListenerId } from "../../../domain/value-objects/ListenerId";
import L from "leaflet";

interface LayerPanelProps<T extends Path<any>> {
  style?: React.CSSProperties;
  layers: Layer<T>[];
  onLayerClicked: (layer: Layer<T>) => void;
}

export const LayerPanel = <T extends Path<any>>({
  style,
  layers,
  onLayerClicked,
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
    const listener: VisibilityChangeListener = {
      id: new ListenerId(),
      onVisibilityChange: () => setRenderTrigger({}),
    };

    layers.forEach((layer) => layer.addVisibilityChangeListener(listener));
    return () =>
      layers.forEach((layer) => layer.removeVisibilityChangeListener(listener));
  }, [layers]);

  return (
    <div ref={panelRef} style={style}>
      {layers.length > 0 && (
        <>
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
                ? "inset 0 -10px 15px -10px rgba(0, 0, 0, 0.3)"
                : "none",
            }}
          >
            {layers.map((layer) => (
              <LayerCheckbox
                key={layer.id.toString()}
                checked={layer.isVisible()}
                onValueChange={(newValue) => {
                  layer.setVisible(newValue);
                }}
                name={layer.getName()}
                onClicked={onLayerClicked.bind(null, layer)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface CheckboxProps {
  name: string;
  checked: boolean;
  onValueChange: (newValue: boolean) => void;
  onClicked: (e?: React.MouseEvent) => void;
}

const LayerCheckbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  onValueChange,
  onClicked,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: isHovered ? "rgba(0, 0, 0, 0.05)" : "transparent",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
      {name}
      <IconButton aria-label="center" onClick={onClicked} size="small">
        <AdsClickIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    fontSize: "1.2em",
    color: `${tomtomSecondaryColor}`,
    padding: "0 10px 10px",
    margin: 0,
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    width: "100%",
    textAlign: "center",
    userSelect: "none",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    cursor: "pointer",
  },
  layerList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "start",
    gap: "4px",
    padding: "10px",
    overflowY: "auto",
    maxHeight: "250px",
    scrollbarWidth: "thin",
    scrollbarColor: `${tomtomSecondaryColor}CC transparent`,
  },
};
