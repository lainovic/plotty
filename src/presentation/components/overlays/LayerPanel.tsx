import { IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { Path } from "../../../domain/entities/Path";
import { Layer } from "../../../domain/entities/Layer";

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
  const layerListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const layerList = layerListRef.current;
    if (layerList) {
      // Check if the content is scrollable
      setIsScrollable(layerList.scrollHeight > layerList.clientHeight);
    }
  }, [layers]);

  return (
    <>
      <div style={style}>
        {layers.length > 0 && <h3 style={styles.header}>Layers</h3>}
        <div
          ref={layerListRef}
          style={{
            ...styles.layerList,
            boxShadow: isScrollable
              ? "inset 0 -10px 10px -10px rgba(0, 0, 0, 0.3)"
              : "none",
          }}
        >
          {layers.map((layer) => (
            <LayerCheckbox
              key={layer.getName()}
              checked={layer.isVisible()}
              onValueChange={(newValue) => {
                layer.setVisible(newValue);
              }}
              name={layer.getName()}
              onClicked={() => onLayerClicked(layer)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

interface CheckboxProps {
  name: string;
  checked: boolean;
  onValueChange: (newValue: boolean) => void;
  onClicked: () => void;
}

const LayerCheckbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  onValueChange,
  onClicked,
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
        onChange={(event) => {
          onValueChange(event.target.checked);
        }}
        inputProps={{ "aria-label": "controlled" }}
      />
      {name}
      <IconButton aria-label="center" onClick={onClicked}>
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
