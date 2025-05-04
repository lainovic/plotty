import React from "react";
import { useMapEvents } from "react-leaflet";
import { Z_INDEX } from "../../constants/zIndex";

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
  }, [isVisible]);

  return (
    <div
      style={{
        ...styles.container,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <p style={styles.text}>{text}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "hsl(0, 0%, 100%, 0.6)",
    padding: "5px 10px",
    borderRadius: "4px",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
    zIndex: Z_INDEX.ZOOM_TEXT,
  },
  text: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 500,
    color: "rgba(0, 0, 0, 0.8)",
  },
};
