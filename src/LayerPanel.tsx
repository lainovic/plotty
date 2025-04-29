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
  const [isScrollable, setIsScrollable] = React.useState(false);

  const layerListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const layerList = layerListRef.current;
    if (layerList) {
      // Check if the content is scrollable
      setIsScrollable(layerList.scrollHeight > layerList.clientHeight);
    }
  }, [paths]);

  // TODO current hack before trying external state management
  const [visibility, setVisibility] = React.useState<Map<number, boolean>>(
    new Map()
  );
  paths.forEach((_, index) =>
    visibility.set(index, initialVisibility.get(index) || false)
  );

  return (
    <>
      <div style={style}>
        {paths.length > 0 && <h3 style={styles.header}>Layers</h3>}
        <div
          ref={layerListRef}
          style={{
            ...styles.layerList,
            boxShadow: isScrollable
              ? "inset 0 -10px 10px -10px rgba(0, 0, 0, 0.3)"
              : "none",
          }}
        >
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
      </div>
    </>
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
  header: {
    fontSize: "1.2em",
    color: `${tomtomSecondaryColor}`,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "10px",
    width: "100%",
  },
  layerList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "start",
    gap: "10px",
    padding: "10px",
    borderRadius: "12px",
    overflowY: "scroll",
    scrollbarWidth: "thin",
  },
};
export default LayerPanel;
