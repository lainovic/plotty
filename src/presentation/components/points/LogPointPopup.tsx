import React from "react";
import { useMap } from "react-leaflet";
import { LogPoint } from "../../../domain/value-objects/LogPoint";
import { LogLevel } from "../../../domain/value-objects/LogLevel";
import { getLogTagColor } from "../../utils/logTagColors";
import { CopyBtn } from "./CopyBtn";
import AdsClickIcon from "@mui/icons-material/AdsClick";

interface LogPointPopupProps {
  point: LogPoint;
}

const levelColors: Record<LogLevel, { bg: string; text: string }> = {
  [LogLevel.Error]:   { bg: "#fde8e8", text: "#c0392b" },
  [LogLevel.Warn]:    { bg: "#fef3e2", text: "#d35400" },
  [LogLevel.Info]:    { bg: "#e8f4fd", text: "#2980b9" },
  [LogLevel.Debug]:   { bg: "#f0f0f0", text: "#555" },
  [LogLevel.Trace]:   { bg: "#f0f0f0", text: "#555" },
  [LogLevel.Verbose]: { bg: "#f0f0f0", text: "#555" },
};

function formatTimestamp(ms: number): string {
  const d = new Date(ms);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  const ms3 = String(d.getUTCMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms3}`;
}

function parseCoords(value: string): [number, number] | null {
  const parts = value.split(",").map((s) => s.trim());
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  if (isNaN(lat) || isNaN(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return [lat, lng];
}

export const LogPointPopup: React.FC<LogPointPopupProps> = ({ point }) => {
  const map = useMap();
  const extraEntries = Array.from(point.extra.entries());
  const levelStyle = levelColors[point.level] ?? levelColors[LogLevel.Debug];
  const tagColor = getLogTagColor(point.tag);
  const coords = `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;

  const flyTo = (lat: number, lng: number) =>
    map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 0.25 });

  return (
    <div style={styles.root}>

      {/* Header */}
      <div style={{ ...styles.header, borderTopColor: tagColor.point }}>
        <span style={{ ...styles.tagName, color: tagColor.tag }} title={point.tag}>
          {point.tag}
        </span>
        <div style={styles.meta}>
          <span style={{ ...styles.badge, background: levelStyle.bg, color: levelStyle.text }}>
            {point.level}
          </span>
          {point.timestamp !== null && (
            <>
              <span style={styles.dot}>·</span>
              <span style={styles.timestamp}>{formatTimestamp(point.timestamp)}</span>
            </>
          )}
        </div>
      </div>

      {/* Coordinates */}
      <div style={styles.section}>
        <span style={styles.mono}>{coords}</span>
        <div style={styles.entryBtns}>
          <button style={styles.locateBtn} onClick={() => flyTo(point.latitude, point.longitude)} title="locate on map">
            <AdsClickIcon style={{ fontSize: "13px" }} />
          </button>
          <CopyBtn value={coords} label="copy coordinates" />
        </div>
      </div>

      {/* Extra entries */}
      {extraEntries.length > 0 && (
        <div style={{ ...styles.section, ...styles.grid }}>
          {extraEntries.map(([key, value]) => {
            const parsed = parseCoords(value);
            return (
              <React.Fragment key={key}>
                <span style={styles.entryKey}>{key}</span>
                <span style={styles.entryValue} title={value}>{value}</span>
                <div style={styles.entryBtns}>
                  {parsed && (
                    <button style={styles.locateBtn} onClick={() => flyTo(parsed[0], parsed[1])} title="locate on map">
                      <AdsClickIcon style={{ fontSize: "13px" }} />
                    </button>
                  )}
                  <CopyBtn value={value} label={`copy ${key}`} />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

    </div>
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
    flexDirection: "column",
    gap: "4px",
  },
  tagName: {
    fontWeight: 700,
    fontSize: "0.85rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: 1.2,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    alignSelf: "flex-start",
  },
  badge: {
    padding: "1px 5px",
    borderRadius: "3px",
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    flexShrink: 0,
    marginLeft: "-5px",
  },
  dot: {
    color: "rgba(0,0,0,0.25)",
    fontSize: "0.75rem",
  },
  timestamp: {
    fontFamily: "monospace",
    fontSize: "0.68rem",
    color: "rgba(0,0,0,0.4)",
    letterSpacing: "0.01em",
  },
  section: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "6px 12px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: "0.72rem",
    color: "rgba(0,0,0,0.6)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "4px 8px",
    justifyContent: undefined,
  },
  entryKey: {
    color: "rgba(0,0,0,0.4)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    fontSize: "0.7rem",
  },
  entryValue: {
    color: "rgba(0,0,0,0.8)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  entryBtns: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  locateBtn: {
    background: "none",
    border: "none",
    padding: "2px 3px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "rgba(0,0,0,0.5)",
    borderRadius: "3px",
    lineHeight: 1,
  },
  copyBtn: {
    background: "none",
    border: "none",
    padding: "2px 3px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "rgba(0,0,0,0.8)",
    borderRadius: "3px",
    lineHeight: 1,
    transition: "opacity 0.1s",
  },
};
