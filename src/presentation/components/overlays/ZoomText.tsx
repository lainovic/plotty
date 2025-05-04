import React from "react";
import { useMapEvents } from "react-leaflet";

export const ZoomText: React.FC = () => {
  const [text, setText] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);

  useMapEvents({
    zoomend: (e) => {
      setText(`Zoom level ${e.target.getZoom()}`);
      setIsVisible(true);
    },
  });

  React.useEffect(() => {
    if (!text) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [text]);

  return (
    <div
      style={{
        ...styles.zoomLevelText,
        opacity: isVisible ? 1 : 0,
        transform: `${styles.zoomLevelText.transform} scale(${
          isVisible ? 1 : 0.8
        })`,
      }}
    >
      <p style={styles.text}>{text}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  zoomLevelText: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateY(-50%) translateX(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    fontFamily: "'Roboto', sans-serif",
    padding: "12px 24px",
    borderRadius: "24px",
    zIndex: 1001,
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    pointerEvents: "none",
  },
  text: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 500,
    color: "rgba(0, 0, 0, 0.8)",
  },
};
