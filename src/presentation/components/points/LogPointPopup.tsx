import React from "react";
import { LogPoint } from "../../../domain/value-objects/LogPoint";
import { LogLevel } from "../../../domain/value-objects/LogLevel";
import { getLogTagColor } from "../../utils/logTagColors";
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

function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      style={styles.copyBtn}
      aria-label={label}
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard");
      }}
    >
      <ContentCopyIcon style={{ fontSize: "11px" }} />
    </button>
  );
}

export const LogPointPopup: React.FC<LogPointPopupProps> = ({ point }) => {
  const extraEntries = Array.from(point.extra.entries());
  const levelStyle = levelColors[point.level] ?? levelColors[LogLevel.Debug];
  const tagColor = getLogTagColor(point.tag);
  const coords = `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.accent, background: tagColor.point }} />
      <div style={styles.body}>

        <div style={styles.header}>
          <span style={{ ...styles.badge, background: levelStyle.bg, color: levelStyle.text }}>
            {point.level}
          </span>
          <span style={{ ...styles.tag, color: tagColor.tag }} title={point.tag}>
            {point.tag}
          </span>
        </div>

        {point.timestamp !== null && (
          <div style={styles.timestamp}>{formatTimestamp(point.timestamp)}</div>
        )}

        <div style={styles.divider} />

        <div style={styles.coordRow}>
          <span style={styles.coordText}>{coords}</span>
          <CopyButton value={coords} label="copy coordinates" />
        </div>

        {extraEntries.length > 0 && (
          <>
            <div style={styles.divider} />
            <div style={styles.entries}>
              {extraEntries.map(([key, value]) => (
                <React.Fragment key={key}>
                  <span style={styles.entryKey}>{key}</span>
                  <span style={styles.entryValue} title={value}>{value}</span>
                  <CopyButton value={value} label={`copy ${key}`} />
                </React.Fragment>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "row",
    minWidth: "210px",
    maxWidth: "300px",
  },
  accent: {
    width: "3px",
    borderRadius: "2px 0 0 2px",
    flexShrink: 0,
    alignSelf: "stretch",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "8px 10px",
    flex: 1,
    minWidth: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  badge: {
    padding: "1px 5px",
    borderRadius: "3px",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.03em",
    flexShrink: 0,
    textTransform: "uppercase",
  },
  tag: {
    fontWeight: 600,
    fontSize: "0.8rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  timestamp: {
    fontFamily: "monospace",
    fontSize: "0.68rem",
    color: "rgba(0,0,0,0.38)",
    letterSpacing: "0.02em",
  },
  divider: {
    height: "1px",
    background: "rgba(0,0,0,0.07)",
    margin: "1px 0",
  },
  coordRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "6px",
  },
  coordText: {
    fontFamily: "monospace",
    fontSize: "0.72rem",
    color: "rgba(0,0,0,0.6)",
  },
  entries: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "4px 8px",
    alignItems: "center",
  },
  entryKey: {
    fontSize: "0.7rem",
    color: "rgba(0,0,0,0.45)",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  entryValue: {
    fontSize: "0.75rem",
    color: "rgba(0,0,0,0.85)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  copyBtn: {
    background: "none",
    border: "none",
    padding: "3px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(0,0,0,0.3)",
    borderRadius: "3px",
    lineHeight: 1,
  },
};
