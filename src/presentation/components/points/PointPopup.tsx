import React from "react";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { tomtomSecondaryColor } from "../../../shared/colors";

export default function PointPopup({
  title,
  content,
  onLocateClick = () => {},
  onLeftArrowClick = () => {},
  onRightArrowClick = () => {},
  onCopyContentClick = () => {},
}: {
  title: string;
  content: React.ReactNode;
  onLocateClick?: () => void;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
  onCopyContentClick?: () => void;
}) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      {content}
      <IconButton aria-label="left" onClick={onLeftArrowClick}>
        <KeyboardArrowLeftIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="right" onClick={onRightArrowClick}>
        <KeyboardArrowRightIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="center" onClick={onLocateClick}>
        <AdsClickIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="copy" onClick={onCopyContentClick}>
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0px",
  },
  title: {
    fontSize: "1.0rem",
    color: `${tomtomSecondaryColor}`,
    marginRight: "10px",
  },
};
