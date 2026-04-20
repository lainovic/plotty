import React from "react";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

export default function PointPopup({
  title,
  content,
  onLocateClick = () => {},
  onLeftArrowClick = () => {},
  onRightArrowClick = () => {},
  onCopyContentClick = () => {},
  showCopyButton = true,
}: {
  title: string;
  content: React.ReactNode;
  onLocateClick?: () => void;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
  onCopyContentClick?: () => void;
  showCopyButton?: boolean;
}) {
  return (
    <div style={styles.container}>
      <div style={styles.content}>{content}</div>
      <div style={styles.footer}>
        <span style={styles.title}>{title}</span>
        <div style={styles.actions}>
          <IconButton aria-label="previous point" onClick={onLeftArrowClick}>
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="next point" onClick={onRightArrowClick}>
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="locate on map" onClick={onLocateClick}>
            <AdsClickIcon fontSize="small" />
          </IconButton>
          {showCopyButton && (
            <IconButton aria-label="copy coordinates" onClick={onCopyContentClick}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    minWidth: "180px",
  },
  content: {
    paddingBottom: "4px",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid rgba(0,0,0,0.08)",
    paddingTop: "2px",
    marginTop: "4px",
  },
  title: {
    fontSize: "0.68rem",
    color: "rgba(0,0,0,0.35)",
    fontWeight: 500,
    paddingLeft: "4px",
    fontFamily: "monospace",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
};
