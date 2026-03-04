import React from "react";
import { Checkbox, IconButton } from "@mui/material";

import { tomtomSecondaryColor } from "../../../shared/colors";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import EditIcon from "@mui/icons-material/Edit";

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
          onVisibilityChange(event.target.checked);
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

export default LayerItem;
