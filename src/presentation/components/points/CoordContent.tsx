import React from "react";
import { CopyBtn } from "./CopyBtn";

interface CoordContentProps {
  lat: number;
  lng: number;
  label?: string;
  accentColor?: string;
}

export function CoordContent({ lat, lng, label, accentColor = "#888" }: CoordContentProps) {
  const coords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  return (
    <div style={styles.root}>
      <div style={{ ...styles.topBorder, borderTopColor: accentColor }} />
      {label && <div style={styles.label}>{label}</div>}
      <div style={styles.coordRow}>
        <span style={styles.mono}>{coords}</span>
        <CopyBtn value={coords} label="copy coordinates" />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  root: {
    display: "flex",
    flexDirection: "column",
    minWidth: "180px",
  },
  topBorder: {
    borderTop: "3px solid",
    marginBottom: "8px",
  },
  label: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "rgba(0,0,0,0.5)",
    paddingBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  coordRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: "0.72rem",
    color: "rgba(0,0,0,0.6)",
  },
};
