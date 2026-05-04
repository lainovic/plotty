import React from "react";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import StraightenIcon from "@mui/icons-material/Straighten";
import { IconButton } from "@mui/material";
import { Z_INDEX } from "../../constants/zIndex";
import { tomtomBlackColor, tomtomSecondaryColor } from "../../../shared/colors";
import { TileProviderSelector } from "./TileProviderSelector";
import { TileProvider } from "../../providers/TileProvider";

export const TOGGLE_GOTO_EVENT = "plotty:toggle-goto";
export const TOGGLE_RULER_EVENT = "plotty:toggle-ruler";

interface MapUtilityDockProps {
  onTileProviderChanged: (tileProvider: TileProvider) => void;
}

export function MapUtilityDock({ onTileProviderChanged }: MapUtilityDockProps) {
  const emit = (eventName: string) => {
    window.dispatchEvent(new CustomEvent(eventName));
  };

  return (
    <div style={styles.dock}>
      <div style={styles.sectionBlock}>
        <div style={styles.sectionKicker}>Utilities</div>
        <div style={styles.sectionText}>Move the map or measure distance.</div>
      </div>
      <div style={styles.toolsRow}>
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
      <div style={styles.divider} />
      <div style={styles.sectionBlock}>
        <div style={styles.sectionKicker}>Map tiles</div>
        <div style={styles.sectionText}>Switch basemaps and add provider keys.</div>
      </div>
      <TileProviderSelector
        onTileProviderChanged={onTileProviderChanged}
        embedded
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
    <button style={styles.toolButton} onClick={onClick} type="button">
      <IconButton
        aria-label={label}
        onClick={onClick}
        size="small"
        style={{ ...styles.toolIcon, color: accent, background: `${accent}12` }}
      >
        {icon}
      </IconButton>
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
    flexDirection: "column",
    gap: "10px",
    background: "hsla(0, 0%, 100%, 0.9)",
    borderRadius: "18px",
    padding: "12px",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)",
    border: "1px solid rgba(0,0,0,0.06)",
    minWidth: "260px",
    backdropFilter: "blur(14px)",
  },
  sectionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  sectionKicker: {
    fontSize: "0.62rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.42)",
  },
  sectionText: {
    fontSize: "0.74rem",
    color: "rgba(0,0,0,0.62)",
    lineHeight: 1.35,
  },
  toolsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  toolButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.78)",
    borderRadius: "12px",
    padding: "6px 10px 6px 6px",
    cursor: "pointer",
    textAlign: "left",
  },
  toolIcon: {
    pointerEvents: "none",
  },
  toolLabel: {
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.72)",
  },
  divider: {
    height: "1px",
    background: "rgba(0,0,0,0.06)",
  },
};
