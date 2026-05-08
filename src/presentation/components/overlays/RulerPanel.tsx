import React from "react";
import StraightenIcon from "@mui/icons-material/Straighten";
import Ruler from "./Ruler";
import { Z_INDEX } from "../../constants/zIndex";
import { isTypingInInput } from "../../utils/keyboardUtils";
import { copyToClipboard } from "../../utils/clipboard";
import { TOGGLE_RULER_EVENT, RULER_STATE_CHANGED } from "./MapUtilityDock";

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${meters.toFixed(2)} m`;
}

export const RulerPanel: React.FC = () => {
  const [distance, setDistance] = React.useState<number>(-1);
  const [rulerMode, setRulerMode] = React.useState<boolean>(false);
  const [rulerKey, setRulerKey] = React.useState(0);

  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent(RULER_STATE_CHANGED, { detail: rulerMode }));
  }, [rulerMode]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingInInput(event)) return;
      if (event.key.toLowerCase() === "r") {
        setRulerMode((prev) => !prev);
        setDistance(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const handleToggleEvent = () => {
      setRulerMode((prev) => !prev);
      setDistance(-1);
    };
    window.addEventListener(TOGGLE_RULER_EVENT, handleToggleEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(TOGGLE_RULER_EVENT, handleToggleEvent);
    };
  }, []);

  const handleClear = () => {
    setRulerKey((k) => k + 1);
  };

  return (
    rulerMode && (
      <>
        <div style={styles.panel}>
          <div style={styles.row}>
            <StraightenIcon style={styles.icon} />
            <span style={styles.distanceText}>
              {distance <= 0 ? "Click to start measuring" : formatDistance(distance)}
            </span>
            <div style={styles.rowActions}>
              {distance >= 0 && (
                <button
                  className="tool-button"
                  style={styles.actionBtn}
                  onClick={handleClear}
                >
                  clear
                </button>
              )}
              <button
                className="tool-button"
                style={styles.closeBtn}
                onClick={() => setRulerMode(false)}
                aria-label="close ruler"
              >
                ×
              </button>
            </div>
          </div>
          <p style={styles.hint}>
            {distance > 0 ? "drag markers to adjust · R to toggle" : "press R to toggle"}
          </p>
        </div>
        <Ruler
          key={rulerKey}
          onDistanceChange={(d, shouldCopy) => {
            setDistance(d);
            if (shouldCopy && d > 0)
              void copyToClipboard(
                formatDistance(d),
                "Distance copied to clipboard",
                "Failed to copy distance"
              );
          }}
        />
      </>
    )
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  panel: {
    position: "fixed",
    bottom: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "hsla(0, 0%, 100%, 0.92)",
    padding: "10px 14px 8px",
    borderRadius: "12px",
    fontFamily: "'Roboto', sans-serif",
    zIndex: Z_INDEX.RULER_OVERLAY,
    color: "rgba(0,0,0,0.76)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(0,0,0,0.06)",
    minWidth: "220px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    color: "rgba(0,0,0,0.4)",
    fontSize: "1.1rem",
    flexShrink: 0,
  },
  distanceText: {
    fontSize: "0.9rem",
    flex: 1,
    whiteSpace: "nowrap",
  },
  rowActions: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    marginLeft: "6px",
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.65rem",
    color: "rgba(0,0,0,0.45)",
    padding: "2px 6px",
    borderRadius: "4px",
    letterSpacing: "0.02em",
    font: "inherit",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    lineHeight: 1,
    color: "rgba(0,0,0,0.4)",
    padding: "2px 4px",
    borderRadius: "4px",
  },
  hint: {
    margin: "5px 0 0",
    fontSize: "0.62rem",
    color: "rgba(0,0,0,0.35)",
    letterSpacing: "0.02em",
    textAlign: "center",
  },
};
