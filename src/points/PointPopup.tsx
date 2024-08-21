import React from "react";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { toast } from "react-toastify";
import { tomtomSecondaryColor } from "../colors";

export default function PointPopup({
  title,
  text,
  onLocateClick = () => {},
  onLeftArrowClick = () => {},
  onRightArrowClick = () => {},
}: {
  title: string;
  text: string;
  onLocateClick?: () => void;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Coordiate copied to clipboard!");
  };

  return (
    <div style={styles.popupContent}>
      <h3 style={styles.title}>{title}</h3>
      {text}
      <IconButton aria-label="left" onClick={onLeftArrowClick}>
        <KeyboardArrowLeftIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="right" onClick={onRightArrowClick}>
        <KeyboardArrowRightIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="center" onClick={onLocateClick}>
        <AdsClickIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="copy" onClick={handleCopy}>
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  popupContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: "0px",
  },
  title: {
    fontSize: "1.2em",
    color: `${tomtomSecondaryColor}`,
    marginRight: "10px",
  },
  text: {
    fontSize: "1em",
    color: "black",
  },
};
