import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { CrashEvent } from "../../../domain/value-objects/CrashEvent";
import { Coordinates } from "../../../domain/value-objects/Coordinates";

const CRASH_COLOR = "#c0392b";
const ANR_COLOR = "#d35400";

function formatTimestamp(ms: number): string {
  const d = new Date(ms);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  const ms3 = String(d.getUTCMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms3}`;
}

interface CrashMarkerProps {
  crash: CrashEvent;
  position: Coordinates;
}

export const CrashMarker: React.FC<CrashMarkerProps> = ({ crash, position }) => {
  const isAnr = crash.type === "anr";
  const accentColor = isAnr ? ANR_COLOR : CRASH_COLOR;
  const label = isAnr ? "ANR" : "Fatal Crash";

  return (
    <CircleMarker
      center={[position.latitude, position.longitude]}
      radius={16}
      pathOptions={{ color: "white", weight: 3, fillColor: accentColor, fillOpacity: 0.45, opacity: 0.9 }}
    >
      <Popup>
        <div style={styles.root}>
          <div style={{ ...styles.header, borderTopColor: accentColor }}>
            <div style={styles.labelGroup}>
              <span style={{ ...styles.label, color: accentColor }}>{label}</span>
              <span style={styles.sublabel}>last known location</span>
            </div>
            {crash.timestamp !== null && (
              <span style={styles.timestamp}>{formatTimestamp(crash.timestamp)}</span>
            )}
          </div>
          <div style={styles.body}>
            <span style={styles.description}>{crash.description}</span>
          </div>
          <div style={styles.footer}>
            <span style={styles.meta}>line {crash.lineNumber}</span>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  root: {
    display: "flex",
    flexDirection: "column",
    minWidth: "220px",
    maxWidth: "300px",
    fontSize: "0.78rem",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    padding: "10px 12px 8px",
    borderTop: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  labelGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  label: {
    fontWeight: 700,
    fontSize: "0.85rem",
    lineHeight: 1.2,
  },
  sublabel: {
    fontSize: "0.62rem",
    color: "rgba(0,0,0,0.35)",
    fontStyle: "italic",
    letterSpacing: "0.01em",
  },
  timestamp: {
    fontFamily: "monospace",
    fontSize: "0.68rem",
    color: "rgba(0,0,0,0.4)",
    letterSpacing: "0.01em",
    flexShrink: 0,
  },
  body: {
    padding: "6px 12px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  description: {
    fontFamily: "monospace",
    fontSize: "0.72rem",
    color: "rgba(0,0,0,0.7)",
    wordBreak: "break-word",
  },
  footer: {
    padding: "4px 12px 6px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  meta: {
    fontSize: "0.65rem",
    color: "rgba(0,0,0,0.3)",
    fontFamily: "monospace",
    letterSpacing: "0.02em",
  },
};
