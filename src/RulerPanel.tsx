import { tomtomSecondaryColor } from "./colors";
import StraightenIcon from "@mui/icons-material/Straighten";

interface RulerPanelProps {
  distance: number;
}

const RulerPanel: React.FC<RulerPanelProps> = ({ distance }) => {
  console.log(">>> rendering ruler panel with distance", distance);
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "rgb(255 255 255 / 0.8)",
        padding: "10px",
        borderRadius: "12px",
        fontFamily: "'Roboto', sans-serif",
        zIndex: 1001,
        textTransform: "lowercase",
        color: `${tomtomSecondaryColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <StraightenIcon />
        <p>Ruler Mode</p>
      </div>
      <p>
        Distance: {`${distance === -1 ? "N/A" : `${distance.toFixed(2)}M`}`}
      </p>
    </div>
  );
};

export default RulerPanel;
