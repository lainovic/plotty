import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { AnyPath } from "../../../domain/entities/Path";
import { Layer } from "../../../domain/entities/Layer";
import L from "leaflet";
import "./LayerPanel.css";
import LayerItem from "./LayerItem";
import { LogPath } from "../../../domain/entities/LogPath";
import { IconButton } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

interface LayerPanelProps<T extends AnyPath> {
  style?: React.CSSProperties;
  layers: Layer<T>[];
  onLayerClicked: (layer: Layer<T>) => void;
  onVisibilityChange: (layer: Layer<T>) => void;
  onNameChange: (layer: Layer<T>, newName: string) => void;
  onDelete: (layer: Layer<T>) => void;
  onClearAll: () => void;
  onColorChange: (layer: Layer<T>, hex: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const LayerPanel = <T extends AnyPath>({
  style,
  layers,
  onLayerClicked,
  onVisibilityChange,
  onNameChange,
  onDelete,
  onClearAll,
  onColorChange,
  onReorder,
}: LayerPanelProps<T>) => {
  const [isScrollable, setIsScrollable] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const scrollListRef = React.useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    L.DomEvent.disableScrollPropagation(panel);
    L.DomEvent.disableClickPropagation(panel);
  }, []);

  React.useEffect(() => {
    const el = scrollListRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setIsScrollable(el.scrollHeight > el.clientHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={panelRef}>
      {layers.length === 0 ? (
        <div style={style}>
          <div style={styles.emptyState}>
            <FileUploadOutlinedIcon style={styles.emptyIcon} />
            <div style={styles.emptyBadge}>Step 1</div>
            <p style={styles.emptyTitle}>Import something to start exploring.</p>
            <div style={styles.emptySteps}>
              <div>Drop a file directly on the map.</div>
              <div>Or focus the map and paste coordinates, GeoJSON, route JSON, TTP, or logcat.</div>
              <div>Your imported results will appear here as layers.</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={style}>
          <div style={styles.header}>
            <div>
              <h3 style={styles.title}>Layers</h3>
              <p style={styles.subtitle}>Imported paths and routes</p>
            </div>
            <IconButton
              aria-label="clear all layers"
              size="small"
              onClick={onClearAll}
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </div>
          <div
            ref={scrollListRef}
            role="list"
            style={{
              ...styles.layerList,
              boxShadow: isScrollable
                ? "inset 0 10px 15px -10px rgba(0, 0, 0, 0.2), inset 0 -10px 15px -10px rgba(0, 0, 0, 0.2)"
                : "none",
            }}
          >
            {layers.map((layer, i) => (
              <div
                key={layer.id}
                role="listitem"
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== i) onReorder(dragIndex, i);
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                style={{
                  width: "100%",
                  opacity: dragIndex === i ? 0.4 : 1,
                  userSelect: dragIndex !== null ? "none" : undefined,
                  borderTop: overIndex === i && dragIndex !== i
                    ? `2px solid ${tomtomSecondaryColor}`
                    : "2px solid transparent",
                }}
              >
                <LayerItem
                  checked={layer.visible}
                  color={layer.color.toHex().slice(0, 7)}
                  pointCount={layer.path.points.length}
                  onVisibilityChange={() => onVisibilityChange(layer)}
                  name={layer.name}
                  onNameChange={(newName) => onNameChange(layer, newName)}
                  onClicked={onLayerClicked.bind(null, layer)}
                  onDelete={() => onDelete(layer)}
                  onColorChange={(hex) => onColorChange(layer, hex)}
                  onMoveUp={i > 0 ? () => onReorder(i, i - 1) : undefined}
                  onMoveDown={i < layers.length - 1 ? () => onReorder(i, i + 1) : undefined}
                  showColorPicker={!(layer.path instanceof LogPath)}
                />
              </div>
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
    padding: "0 8px 8px 10px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    width: "100%",
  },
  title: {
    fontSize: "0.98rem",
    color: `${tomtomSecondaryColor}`,
    userSelect: "none",
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    margin: "1px 0 0",
    fontSize: "0.66rem",
    color: "rgba(0,0,0,0.45)",
    lineHeight: 1.2,
    maxWidth: "190px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 16px",
    gap: "8px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "2rem",
    color: "rgba(0,0,0,0.2)",
  },
  emptyText: {
    margin: 0,
    fontSize: "0.78rem",
    color: "rgba(0,0,0,0.4)",
    lineHeight: 1.4,
    maxWidth: "170px",
  },
  emptyBadge: {
    fontSize: "0.64rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: `${tomtomSecondaryColor}`,
  },
  emptyTitle: {
    margin: 0,
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "rgba(0,0,0,0.72)",
    maxWidth: "240px",
    lineHeight: 1.35,
  },
  emptySteps: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "0.76rem",
    color: "rgba(0,0,0,0.48)",
    lineHeight: 1.45,
    maxWidth: "248px",
  },
  layerList: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "0 0 12px 12px",
    alignItems: "flex-start",
    justifyContent: "start",
    overflowY: "auto",
    maxHeight: "336px",
    scrollbarWidth: "thin",
    scrollbarColor: `${tomtomSecondaryColor}CC transparent`,
    width: "100%",
  },
};
