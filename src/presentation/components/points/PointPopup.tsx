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
      <div>{content}</div>
      <div style={styles.footer}>
        <span style={styles.title}>{title}</span>
        <div style={styles.actions}>
          <IconButton size="small" aria-label="previous point" onClick={onLeftArrowClick}>
            <KeyboardArrowLeftIcon style={{ fontSize: "16px" }} />
          </IconButton>
          <IconButton size="small" aria-label="next point" onClick={onRightArrowClick}>
            <KeyboardArrowRightIcon style={{ fontSize: "16px" }} />
          </IconButton>
          <IconButton size="small" aria-label="locate on map" onClick={onLocateClick}>
            <AdsClickIcon style={{ fontSize: "16px" }} />
          </IconButton>
          {showCopyButton && (
            <IconButton size="small" aria-label="copy coordinates" onClick={onCopyContentClick}>
              <ContentCopyIcon style={{ fontSize: "16px" }} />
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
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid rgba(0,0,0,0.06)",
    padding: "2px 8px 2px 12px",
    marginTop: "2px",
  },
  title: {
    fontSize: "0.65rem",
    color: "rgba(0,0,0,0.3)",
    fontFamily: "monospace",
    letterSpacing: "0.02em",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "0px",
  },
};
