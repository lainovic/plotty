import React from "react";
import { useMapEvents } from "react-leaflet";

export const ZoomText: React.FC = () => {
  const [text, setText] = React.useState("");

  useMapEvents({
    zoomend: (e) => {
      setText(`Zoom level ${e.target.getZoom()}`);
    },
  });

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setText("");
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [text]);

  return text !== "" ? (
    <div style={styles.zoomLevelText}>
      <p>{text}</p>
    </div>
  ) : null;
};

const styles: { [key: string]: React.CSSProperties } = {
  zoomLevelText: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateY(-50%) translateX(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    fontFamily: "'Roboto', sans-serif",
    padding: "8px",
    borderRadius: "16px",
    zIndex: 1001,
  },
};
