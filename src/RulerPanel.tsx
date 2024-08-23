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
        <div style={styles.panel}>
          <div style={styles.iconContainer}>
            <StraightenIcon />
          </div>
          {distance === -1 ? (
            <p style={styles.message}>
              Click on the map to measure distance and copy it to the clipboard
            </p>
          ) : (
            <p style={styles.message}>
              Distance: {`${distance.toFixed(2)} meters`}
            </p>
          )}
        </div>
        <Ruler
          onDistanceChange={(distance) => {
            setDistance(distance);
            navigator.clipboard.writeText(distance.toFixed(2));
          }}
        />
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
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1001,
    pointerEvents: "none",
  },
  panel: {
    position: "fixed",
    top: "80%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "20px",
    borderRadius: "12px",
    fontFamily: "'Roboto', sans-serif",
    zIndex: 1002,
    textTransform: "lowercase",
    color: `${tomtomSecondaryColor}`,
    fontSize: "1.0rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    marginBottom: "10px",
  },
  message: {
    margin: "10px 0",
  },
};
