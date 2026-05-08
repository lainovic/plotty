import React from "react";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import StraightenIcon from "@mui/icons-material/Straighten";
import { Z_INDEX } from "../../constants/zIndex";
import { tomtomSecondaryColor } from "../../../shared/colors";

const rulerAccent = "#1988cf";

export const TOGGLE_GOTO_EVENT = "plotty:toggle-goto";
export const TOGGLE_RULER_EVENT = "plotty:toggle-ruler";
export const GOTO_STATE_CHANGED = "plotty:goto-state";
export const RULER_STATE_CHANGED = "plotty:ruler-state";

export function MapUtilityDock() {
  const [gotoActive, setGotoActive] = React.useState(false);
  const [rulerActive, setRulerActive] = React.useState(false);

  React.useEffect(() => {
    const handleGoto = (e: Event) => setGotoActive((e as CustomEvent<boolean>).detail);
    const handleRuler = (e: Event) => setRulerActive((e as CustomEvent<boolean>).detail);
    window.addEventListener(GOTO_STATE_CHANGED, handleGoto);
    window.addEventListener(RULER_STATE_CHANGED, handleRuler);
    return () => {
      window.removeEventListener(GOTO_STATE_CHANGED, handleGoto);
      window.removeEventListener(RULER_STATE_CHANGED, handleRuler);
    };
  }, []);

  const emit = (eventName: string) => {
    window.dispatchEvent(new CustomEvent(eventName));
  };

  return (
    <div style={styles.dock}>
      <ToolButton
        label="Go To"
        accent={tomtomSecondaryColor}
        active={gotoActive}
        onClick={() => emit(TOGGLE_GOTO_EVENT)}
        icon={<TravelExploreIcon fontSize="small" />}
      />
      <ToolButton
        label="Ruler"
        accent={rulerAccent}
        active={rulerActive}
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
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  accent: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="tool-button"
      style={{
        ...styles.toolButton,
        ...(active ? { background: `${accent}18` } : {}),
      }}
      onClick={onClick}
      type="button"
      aria-pressed={active}
    >
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
