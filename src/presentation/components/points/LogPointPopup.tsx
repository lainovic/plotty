import React from "react";
import { LogPoint } from "../../../domain/value-objects/LogPoint";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";

interface LogPointPopupProps {
  point: LogPoint;
}

export const LogPointPopup: React.FC<LogPointPopupProps> = ({ point }) => {
  const extraEntries = Array.from(point.extra.entries());

  const onCopyContentClick = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.tag}>{point.tag}</div>
      <div style={styles.coordinates}>
        {point.latitude}, {point.longitude}
      </div>
      {extraEntries.length > 0 && (
        <div style={styles.extraContainer}>
          {extraEntries.map(([key, value]) => (
            <div key={key} style={styles.entry}>
              <span style={styles.key}>{key}:</span>
              <span style={styles.value}>{value}</span>
              <IconButton
                aria-label="copy"
                onClick={() => onCopyContentClick(value)}
              >
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
    gap: "8px",
    padding: "4px",
    fontSize: "0.8rem",
  },
  tag: {
    color: tomtomSecondaryColor,
    fontWeight: 700,
  },
  coordinates: {
    color: "black",
  },
  extraContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    borderTop: `1px solid ${tomtomSecondaryColor}`,
    paddingTop: "8px",
  },
  entry: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  key: {
    color: tomtomSecondaryColor,
    fontWeight: "bold",
  },
  value: {
    color: "black",
  },
};
