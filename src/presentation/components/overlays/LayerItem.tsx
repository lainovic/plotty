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
import CloseIcon from "@mui/icons-material/Close";

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

  const displayName = name.trim() || "Untitled layer";

  return (
    <div style={styles.layerItem}>
      <div style={styles.rowTop}>
        <div style={styles.leadingRail}>
          <DragIndicatorIcon style={styles.dragHandle} />
          <Checkbox
            sx={{
              color: `${tomtomSecondaryColor}`,
              "&.Mui-checked": { color: `${tomtomSecondaryColor}` },
              padding: "2px",
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
        </div>
        <div style={styles.metaColumn}>
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
              {displayName}
            </button>
          )}
          <span style={styles.pointCount}>{pointCount} <abbr title="points">pts</abbr></span>
        </div>
      </div>
      <div style={styles.actionsRow}>
          <div style={styles.primaryActions}>
          {editing ? (
            <>
              <button style={styles.primaryAction} type="button" onClick={commitEdit}>
                <CheckIcon style={styles.primaryIcon} />
                Save
              </button>
              <button style={styles.secondaryAction} type="button" onClick={() => setEditing(false)}>
                <CloseIcon style={styles.primaryIcon} />
                Cancel
              </button>
              <IconButton aria-label="confirm rename" size="small" onClick={commitEdit} sx={styles.utilityButtonSx}>
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
            </>
          )}
          </div>
          {!editing && (
            <div style={styles.trailingActions}>
              <IconButton
                aria-label="move layer up"
                size="small"
                onClick={onMoveUp}
                disabled={!onMoveUp}
                sx={styles.utilityButtonSx}
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="move layer down"
                size="small"
                onClick={onMoveDown}
                disabled={!onMoveDown}
                sx={styles.utilityButtonSx}
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="delete layer" size="small" onClick={onDelete} style={styles.deleteAction} sx={styles.deleteButtonSx}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties | Record<string, unknown> } = {
  layerItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: "9px 12px 8px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "8px",
    fontSize: "0.92rem",
    width: "100%",
    gap: "5px",
  },
  leadingRail: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flexShrink: 0,
  },
  dragHandle: {
    fontSize: "16px",
    flexShrink: 0,
    cursor: "grab",
    color: "rgba(0,0,0,0.18)",
    marginLeft: "-2px",
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
  metaColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    minWidth: 0,
    flex: 1,
  },
  rowTop: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
  },
  actionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%",
    paddingLeft: "59px",
  },
  primaryActions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "5px",
    minWidth: 0,
  },
  trailingActions: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
  },
  layerName: {
    display: "block",
    padding: 0,
    borderRadius: "6px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "inherit",
    fontFamily: "inherit",
    fontWeight: 500,
    lineHeight: 1.25,
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
    minWidth: 0,
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
    gap: "5px",
    border: `1px solid ${tomtomSecondaryColor}26`,
    background: `${tomtomSecondaryColor}12`,
    color: "rgba(0,0,0,0.76)",
    borderRadius: "999px",
    padding: "3px 9px",
    fontSize: "0.69rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryAction: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    border: "1px solid rgba(0,0,0,0.08)",
    background: "transparent",
    color: "rgba(0,0,0,0.64)",
    borderRadius: "999px",
    padding: "3px 9px",
    fontSize: "0.69rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryIcon: {
    fontSize: "0.86rem",
  },
  deleteAction: {
    color: "rgba(125,0,0,0.75)",
  },
  utilityButtonSx: {
    color: "rgba(0,0,0,0.52)",
    padding: "4px",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  deleteButtonSx: {
    marginLeft: "2px",
  },
  pointCount: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 7px",
    fontSize: "0.64rem",
    color: "rgba(0,0,0,0.54)",
    borderRadius: "999px",
    background: "rgba(0,0,0,0.06)",
    whiteSpace: "nowrap",
    flexShrink: 0,
    minHeight: "20px",
  },
};

export default LayerItem;
