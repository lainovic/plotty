import React from "react";
import { Checkbox, IconButton } from "@mui/material";
import "./LayerPanel.css";

import { tomtomSecondaryColor } from "../../../shared/colors";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import AndroidIcon from "@mui/icons-material/Android";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

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
  showColorPicker = true,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
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
    <div
      style={styles.layerItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DragIndicatorIcon style={{ ...styles.dragHandle, opacity: hovered ? 0.35 : 0.12 }} />
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
          <>
            <button className="layer-name" style={styles.layerName} title="Fly to layer" onClick={onClicked}>
              {name}
            </button>
            <span style={styles.pointCount}>{pointCount} <abbr title="points">pts</abbr></span>
          </>
        )}
        {(hovered || editing) && (
          <div style={styles.actionsOverlay}>
            {editing ? (
              <IconButton aria-label="confirm rename" size="small" onClick={commitEdit}>
                <CheckIcon fontSize="small" />
              </IconButton>
            ) : (
              <>
                <IconButton aria-label="locate layer on map" size="small" onClick={onClicked}>
                  <AdsClickIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="rename layer" size="small" onClick={startEditing}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete layer" size="small" onClick={onDelete}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </div>
        )}
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
    padding: "8px 12px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    fontSize: "0.95rem",
    width: "100%",
  },
  dragHandle: {
    fontSize: "16px",
    flexShrink: 0,
    cursor: "grab",
    color: "rgba(0,0,0,1)",
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
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  actionsOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(to right, transparent, hsla(0,0%,100%,0.97) 16px)",
    paddingLeft: "16px",
  },
  layerName: {
    display: "block",
    paddingLeft: "12px",
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
    marginLeft: "12px",
    fontSize: "inherit",
    fontFamily: "inherit",
    border: "none",
    borderBottom: `1px solid ${tomtomSecondaryColor}`,
    outline: "none",
    background: "transparent",
    width: "100%",
  },
  pointCount: {
    paddingLeft: "12px",
    fontSize: "0.75rem",
    color: "rgba(0,0,0,0.4)",
  },
};

export default LayerItem;
