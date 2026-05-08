import React from "react";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import StraightenIcon from "@mui/icons-material/Straighten";
import { Z_INDEX } from "../../constants/zIndex";
import { tomtomBlackColor, tomtomSecondaryColor } from "../../../shared/colors";

export const TOGGLE_GOTO_EVENT = "plotty:toggle-goto";
export const TOGGLE_RULER_EVENT = "plotty:toggle-ruler";

export function MapUtilityDock() {
  const emit = (eventName: string) => {
    window.dispatchEvent(new CustomEvent(eventName));
  };

  return (
    <div style={styles.dock}>
      <ToolButton
        label="Go To"
        accent={tomtomSecondaryColor}
        onClick={() => emit(TOGGLE_GOTO_EVENT)}
        icon={<TravelExploreIcon fontSize="small" />}
      />
      <ToolButton
        label="Ruler"
        accent={tomtomBlackColor}
        onClick={() => emit(TOGGLE_RULER_EVENT)}
        icon={<StraightenIcon fontSize="small" />}
      />
    </div>
  );
}

function ToolButton({
  label,
  icon,
  accent,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button className="tool-button" style={styles.toolButton} onClick={onClick} type="button">
      <span aria-hidden="true" style={{ ...styles.toolIcon, color: accent, background: `${accent}12` }}>
        {icon}
      </span>
      <span style={styles.toolLabel}>{label}</span>
    </button>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  dock: {
    position: "fixed",
    left: "10px",
    bottom: "10px",
    zIndex: Z_INDEX.TILE_PROVIDER,
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    background: "hsla(0, 0%, 100%, 0.9)",
    borderRadius: "16px",
    padding: "8px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0,0,0,0.06)",
    backdropFilter: "blur(14px)",
    fontFamily: "'Roboto', sans-serif",
    color: "rgba(0,0,0,0.76)",
  },
  toolButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.78)",
    borderRadius: "9px",
    padding: "3px 7px 3px 3px",
    cursor: "pointer",
    textAlign: "left",
    font: "inherit",
    color: "inherit",
    touchAction: "manipulation",
  },
  toolIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    padding: "5px",
    pointerEvents: "none",
  },
  toolLabel: {
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.01em",
    color: "rgba(0,0,0,0.72)",
  },
};
