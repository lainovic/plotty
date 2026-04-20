import React from "react";
import { Checkbox, IconButton } from "@mui/material";

import { tomtomSecondaryColor } from "../../../shared/colors";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

interface LayerItemProps {
  name: string;
  pointCount: number;
  checked: boolean;
  onVisibilityChange: (newValue: boolean) => void;
  onNameChange: (newName: string) => void;
  onClicked: (e?: React.MouseEvent) => void;
  onZoomedIn: () => void;
  onDelete: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  name,
  pointCount,
  checked,
  onVisibilityChange,
  onNameChange,
  onClicked,
  onZoomedIn,
  onDelete,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [draft, setDraft] = React.useState(name);
  const inputRef = React.useRef<HTMLInputElement>(null);

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
      <Checkbox
        sx={{
          color: `${tomtomSecondaryColor}`,
          "&.Mui-checked": { color: `${tomtomSecondaryColor}` },
        }}
        checked={checked}
        onChange={(event) => onVisibilityChange(event.target.checked)}
        inputProps={{ "aria-label": "Toggle layer visibility" }}
      />
      {hovered || editing ? (
        <div style={styles.actions}>
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitEdit}
              style={styles.nameInput}
            />
          ) : (
            <IconButton aria-label="locate layer on map" onClick={onZoomedIn}>
              <AdsClickIcon fontSize="small" />
            </IconButton>
          )}
          {editing ? (
            <IconButton aria-label="confirm rename" onClick={commitEdit}>
              <CheckIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton aria-label="rename layer" onClick={startEditing}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton aria-label="delete layer" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ) : (
        <div style={styles.nameColumn}>
          <button style={styles.layerName} onClick={onClicked}>
            {name}
          </button>
          <span style={styles.pointCount}>{pointCount} pts</span>
        </div>
      )}
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
  nameColumn: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  actions: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  layerName: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    width: "100%",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "inherit",
    fontFamily: "inherit",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
