import { tomtomSecondaryColor } from "./colors";
import StraightenIcon from "@mui/icons-material/Straighten";
import Ruler from "./Ruler";
import React from "react";

const RulerPanel: React.FC = ({}) => {
  const [distance, setDistance] = React.useState<number>(-1);
  const [rulerMode, setRulerMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "r") {
        setRulerMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    rulerMode && (
      <>
        <div style={styles.overlay}></div>
        <div
          style={{
            position: "fixed",
            top: "80%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgb(255 255 255 / 0.2)",
            padding: "10px",
            borderRadius: "12px",
            fontFamily: "'Roboto', sans-serif",
            zIndex: 1002,
            textTransform: "lowercase",
            color: `${tomtomSecondaryColor}`,
            fontSize: "1.0rem",
            width: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
          </div>
          <p>
            Distance: {`${distance === -1 ? "N/A" : `${distance.toFixed(2)}M`}`}
          </p>
        </div>
        <Ruler onDistanceChange={setDistance} />
      </>
    )
  );
};

export default RulerPanel;

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1001,
    pointerEvents: "none",
  },
};
