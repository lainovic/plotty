import { IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import React from "react";
import { Path } from "./types/paths";
import { tomtomSecondaryColor } from "./colors";

const LayerPanel: React.FC<{
  style?: React.CSSProperties;
  paths: Path[];
  initialVisibility: Map<number, boolean>;
  onVisibilityChange: (index: number) => void;
  onView: (path: Path) => void;
}> = ({ style, paths, initialVisibility, onVisibilityChange, onView }) => {
  // TODO current hack before trying external state management
  const [visibility, setVisibility] = React.useState<Map<number, boolean>>(
    new Map()
  );
  paths.forEach((_, index) =>
    visibility.set(index, initialVisibility.get(index) || false)
  );

  return (
    <div style={style}>
      {paths.length > 0 && <h3 style={styles.header}>Layers</h3>}
      {paths.map((path, index) => (
        <LayerCheckbox
          key={path.name}
          index={index}
          checked={visibility.get(index) || false}
          onChange={() => {
            onVisibilityChange(index);
            setVisibility((prev) => {
              const newVisibility = new Map(prev);
              newVisibility.set(index, !newVisibility.get(index));
              return newVisibility;
            });
          }}
          name={path.name}
          onView={() => onView(path)}
        />
      ))}
    </div>
  );
};

interface CheckboxProps {
  index: number;
  name: string;
  checked: boolean;
  onChange: (index: number) => void;
  onView: () => void;
}

const LayerCheckbox: React.FC<CheckboxProps> = ({
  index,
  name,
  checked,
  onChange,
  onView,
}) => {
  return (
    <div style={styles.container}>
      <Checkbox
        sx={{
          color: `${tomtomSecondaryColor}`,
          "&.Mui-checked": {
            color: `${tomtomSecondaryColor}`,
          },
        }}
        checked={checked}
        onChange={() => onChange(index)}
        inputProps={{ "aria-label": "controlled" }}
      />
      {name}
      {/* <button onClick={onView}>Overview</button> */}
      <IconButton aria-label="center" onClick={onView}>
        <AdsClickIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    margin: "5px 0",
  },
  header: {
    fontSize: "1.2em",
    color: `${tomtomSecondaryColor}`,
  },
};
export default LayerPanel;
