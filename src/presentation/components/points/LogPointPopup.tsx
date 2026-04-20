import React from "react";
import { LogPoint } from "../../../domain/value-objects/LogPoint";
import { LogLevel } from "../../../domain/value-objects/LogLevel";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";

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

export const LogPointPopup: React.FC<LogPointPopupProps> = ({ point }) => {
  const extraEntries = Array.from(point.extra.entries());
  const levelStyle = levelColors[point.level] ?? levelColors[LogLevel.Debug];

  const onCopyContentClick = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{ ...styles.levelBadge, background: levelStyle.bg, color: levelStyle.text }}>
          {point.level}
        </span>
        <span style={styles.tag}>{point.tag}</span>
      </div>
      {point.timestamp !== null && (
        <div style={styles.timestamp}>{formatTimestamp(point.timestamp)}</div>
      )}
      <div style={styles.coordinates}>
        {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
      </div>
      {extraEntries.length > 0 && (
        <div style={styles.extraContainer}>
          {extraEntries.map(([key, value]) => (
            <div key={key} style={styles.entry}>
              <span style={styles.key}>{key}:</span>
              <span style={styles.value}>{value}</span>
              <IconButton aria-label="copy" onClick={() => onCopyContentClick(value)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "4px",
    fontSize: "0.8rem",
    minWidth: "160px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  levelBadge: {
    padding: "1px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: 700,
    flexShrink: 0,
  },
  tag: {
    color: tomtomSecondaryColor,
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  timestamp: {
    color: "rgba(0,0,0,0.45)",
    fontSize: "0.72rem",
    fontFamily: "monospace",
  },
  coordinates: {
    color: "rgba(0,0,0,0.6)",
    fontFamily: "monospace",
    fontSize: "0.75rem",
  },
  extraContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    borderTop: `1px solid rgba(0,0,0,0.1)`,
    paddingTop: "6px",
  },
  entry: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  key: {
    color: tomtomSecondaryColor,
    fontWeight: "bold",
    flexShrink: 0,
  },
  value: {
    color: "black",
    wordBreak: "break-all",
  },
};
