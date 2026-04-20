import React from "react";
import { CopyBtn } from "./CopyBtn";

interface GeoPathPopupProps {
  name: string;
  properties: Record<string, unknown>;
}

const BOOL_FLAGS: { key: string; label: string }[] = [
  { key: "is_ferry",     label: "ferry" },
  { key: "is_in_tunnel", label: "tunnel" },
  { key: "is_on_bridge", label: "bridge" },
  { key: "is_no_through",label: "no-through" },
  { key: "oneway_back",  label: "oneway" },
];

const TRAFFIC_ROWS: { key: string; label: string }[] = [
  { key: "speed_limit",            label: "speed limit" },
  { key: "speed_free_flow",        label: "free flow" },
  { key: "traffic_flow_restriction", label: "flow restriction" },
  { key: "blocked_passage",        label: "blocked passage" },
];

const ARC_ROWS: { key: string; label: string }[] = [
  { key: "arc_feature_id",          label: "arc id" },
  { key: "opposite_arc_feature_id", label: "opposite arc" },
  { key: "tail_node_feature_id",    label: "tail node" },
  { key: "head_node_feature_id",    label: "head node" },
];

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function isNonDefault(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v !== "None" && v !== "";
  return true;
}

export const GeoPathPopup: React.FC<GeoPathPopupProps> = ({ name, properties: p }) => {
  const activeFlags = BOOL_FLAGS.filter(({ key }) => p[key] === true);
  const drivingSide = str(p["driving_side"]);
  const formOfWay   = str(p["form_of_way"]);
  const length      = p["length"] != null ? str(p["length"]) : null;

  const trafficRows = TRAFFIC_ROWS.filter(({ key }) => isNonDefault(p[key]));
  const arcRows     = ARC_ROWS.filter(({ key }) => p[key] != null);

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <span style={styles.name}>{name}</span>
      </div>

      {/* Length */}
      {length !== null && (
        <div style={styles.section}>
          <span style={styles.label}>length</span>
          <span style={styles.value}>{length}</span>
          <CopyBtn value={length} label="copy length" />
        </div>
      )}

      {/* Road flags */}
      {(activeFlags.length > 0 || drivingSide || formOfWay) && (
        <div style={{ ...styles.section, ...styles.flagsSection }}>
          {activeFlags.map(({ key, label }) => (
            <span key={key} style={styles.flag}>{label}</span>
          ))}
          {drivingSide && <span style={styles.flag}>{drivingSide}</span>}
          {formOfWay   && <span style={styles.flag}>{formOfWay}</span>}
        </div>
      )}

      {/* Traffic attributes */}
      {trafficRows.length > 0 && (
        <div style={{ ...styles.section, ...styles.grid }}>
          {trafficRows.map(({ key, label }) => {
            const val = str(p[key]);
            return (
              <React.Fragment key={key}>
                <span style={styles.label}>{label}</span>
                <span style={styles.value}>{val}</span>
                <CopyBtn value={val} label={`copy ${label}`} />
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Arc details */}
      {arcRows.length > 0 && (
        <div style={{ ...styles.section, ...styles.grid }}>
          {arcRows.map(({ key, label }) => {
            const val = str(p[key]);
            return (
              <React.Fragment key={key}>
                <span style={styles.label}>{label}</span>
                <span style={{ ...styles.value, ...styles.mono }}>{val}</span>
                <CopyBtn value={val} label={`copy ${label}`} />
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
    minWidth: "240px",
    maxWidth: "320px",
    fontSize: "0.78rem",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    padding: "10px 12px 8px",
    borderTop: "3px solid rgba(0,0,0,0.15)",
  },
  name: {
    fontWeight: 700,
    fontSize: "0.85rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
  },
  section: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  flagsSection: {
    flexWrap: "wrap",
    gap: "4px",
  },
  flag: {
    padding: "1px 6px",
    borderRadius: "3px",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    background: "rgba(0,0,0,0.07)",
    color: "rgba(0,0,0,0.55)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "4px 8px",
    flexDirection: undefined,
  },
  label: {
    color: "rgba(0,0,0,0.4)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    fontSize: "0.7rem",
  },
  value: {
    color: "rgba(0,0,0,0.8)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: "0.68rem",
    color: "rgba(0,0,0,0.5)",
  },
};
