import React from "react";
import { Checkbox, IconButton } from "@mui/material";
import "./LayerPanel.css";

import { tomtomSecondaryColor } from "../../../shared/colors";
import AndroidIcon from "@mui/icons-material/Android";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";

interface LayerItemProps {
  name: string;
  pointCount: number;
  color: string;
  checked: boolean;
  onVisibilityChange: (newValue: boolean) => void;
  onNameChange: (newName: string) => void;
  onColorChange: (hex: string) => void;
  onClicked: (e?: React.MouseEvent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  showColorPicker?: boolean;
}

const LayerItem: React.FC<LayerItemProps> = ({
  name,
  pointCount,
  color,
  checked,
  onVisibilityChange,
  onNameChange,
  onColorChange,
  onClicked,
  onDelete,
  onMoveUp,
  onMoveDown,
  showColorPicker = true,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(name);
  const [localColor, setLocalColor] = React.useState(color);
  const colorDebounce = React.useRef<ReturnType<typeof setTimeout>>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleColorChange = (hex: string) => {
    setLocalColor(hex);
    clearTimeout(colorDebounce.current);
    colorDebounce.current = setTimeout(() => onColorChange(hex), 150);
  };

  const startEditing = () => {
    setDraft(name);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (draft.trim() && draft !== name) onNameChange(draft.trim());
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div style={styles.layerItem}>
      <DragIndicatorIcon style={styles.dragHandle} />
      <Checkbox
        sx={{
          color: `${tomtomSecondaryColor}`,
          "&.Mui-checked": { color: `${tomtomSecondaryColor}` },
        }}
        checked={checked}
        onChange={(event) => onVisibilityChange(event.target.checked)}
        inputProps={{ "aria-label": "Toggle layer visibility" }}
      />
      {showColorPicker ? (
        <label
          style={{ ...styles.colorSwatch, background: localColor }}
          title="Change layer color"
        >
          <input
            type="color"
            value={localColor}
            onChange={(e) => handleColorChange(e.target.value)}
            style={styles.colorInput}
            aria-label="Layer color"
          />
        </label>
      ) : (
        <AndroidIcon style={styles.androidIcon} aria-hidden="true" />
      )}
      <div style={styles.nameColumn}>
        <div style={styles.rowTop}>
          {editing ? (
            <input
              ref={inputRef}
              className="layer-name-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitEdit}
              style={styles.nameInput}
              aria-label="Layer name"
            />
          ) : (
            <button className="layer-name" style={styles.layerName} title="Fly to layer" onClick={onClicked}>
              {name}
            </button>
          )}
          <span style={styles.pointCount}>{pointCount} <abbr title="points">pts</abbr></span>
        </div>
        <div style={styles.actionsRow}>
          {editing ? (
            <>
              <button style={styles.primaryAction} type="button" onClick={commitEdit}>
                Save
              </button>
              <IconButton aria-label="confirm rename" size="small" onClick={commitEdit}>
                <CheckIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <button style={styles.primaryAction} type="button" onClick={onClicked}>
                <EditLocationAltIcon style={styles.primaryIcon} />
                View
              </button>
              <button style={styles.secondaryAction} type="button" onClick={startEditing}>
                <EditIcon style={styles.primaryIcon} />
                Rename
              </button>
              <div style={styles.reorderGroup}>
                <span style={styles.reorderLabel}>Order</span>
                <IconButton aria-label="move layer up" size="small" onClick={onMoveUp} disabled={!onMoveUp}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="move layer down" size="small" onClick={onMoveDown} disabled={!onMoveDown}>
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </div>
              <IconButton aria-label="delete layer" size="small" onClick={onDelete} style={styles.deleteAction}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layerItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    fontSize: "0.95rem",
    width: "100%",
  },
  dragHandle: {
    fontSize: "16px",
    flexShrink: 0,
    cursor: "grab",
    color: "rgba(0,0,0,0.18)",
    marginLeft: "-4px",
  },
  androidIcon: {
    width: "16px",
    height: "16px",
    fontSize: "16px",
    flexShrink: 0,
    color: "rgba(0,0,0,0.3)",
  },
  colorSwatch: {
    position: "relative",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    flexShrink: 0,
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  colorInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    padding: 0,
    border: "none",
  },
  nameColumn: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  rowTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  actionsRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "6px",
    marginLeft: "10px",
  },
  layerName: {
    display: "block",
    paddingLeft: "2px",
    borderRadius: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "inherit",
    fontFamily: "inherit",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  },
  nameInput: {
    flex: 1,
    fontSize: "inherit",
    fontFamily: "inherit",
    border: "none",
    borderBottom: `1px solid ${tomtomSecondaryColor}`,
    outline: "none",
    background: "transparent",
    width: "100%",
  },
  primaryAction: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: `1px solid ${tomtomSecondaryColor}26`,
    background: `${tomtomSecondaryColor}12`,
    color: "rgba(0,0,0,0.76)",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "0.72rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryAction: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid rgba(0,0,0,0.08)",
    background: "transparent",
    color: "rgba(0,0,0,0.64)",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "0.72rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryIcon: {
    fontSize: "0.9rem",
  },
  reorderGroup: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "999px",
    padding: "2px 4px 2px 8px",
  },
  reorderLabel: {
    fontSize: "0.68rem",
    color: "rgba(0,0,0,0.42)",
    fontWeight: 700,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  deleteAction: {
    marginLeft: "auto",
    color: "rgba(125,0,0,0.75)",
  },
  pointCount: {
    padding: "3px 8px",
    fontSize: "0.68rem",
    color: "rgba(0,0,0,0.45)",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.04)",
    whiteSpace: "nowrap",
  },
};

export default LayerItem;
