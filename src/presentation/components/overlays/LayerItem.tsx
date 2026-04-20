import React from "react";
import { Checkbox, IconButton } from "@mui/material";

import { tomtomSecondaryColor } from "../../../shared/colors";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

interface LayerItemProps {
  name: string;
  checked: boolean;
  onVisibilityChange: (newValue: boolean) => void;
  onNameChange: (newName: string) => void;
  onClicked: (e?: React.MouseEvent) => void;
  onZoomedIn: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  name,
  checked,
  onVisibilityChange,
  onNameChange,
  onClicked,
  onZoomedIn,
}) => {
  const [editing, setEditing] = React.useState(false);
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
    <div style={styles.layerItem}>
      <Checkbox
        sx={{
          color: `${tomtomSecondaryColor}`,
          "&.Mui-checked": { color: `${tomtomSecondaryColor}` },
        }}
        checked={checked}
        onChange={(event) => onVisibilityChange(event.target.checked)}
        inputProps={{ "aria-label": "Toggle layer visibility" }}
      />
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
        <button style={styles.layerName} onClick={onClicked}>
          {name}
        </button>
      )}
      <IconButton aria-label="locate layer on map" onClick={onZoomedIn}>
        <AdsClickIcon fontSize="small" />
      </IconButton>
      {editing ? (
        <IconButton aria-label="confirm rename" onClick={commitEdit}>
          <CheckIcon fontSize="small" />
        </IconButton>
      ) : (
        <IconButton aria-label="rename layer" onClick={startEditing}>
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layerItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: "12px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    fontSize: "0.95rem",
    width: "100%",
  },
  layerName: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "12px",
    borderRadius: "10px",
    width: "100%",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "inherit",
    fontFamily: "inherit",
    textAlign: "left",
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
};

export default LayerItem;
