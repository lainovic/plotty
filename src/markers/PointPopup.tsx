import React from "react";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { toast } from "react-toastify";

export default function PointPopup({
  title,
  text,
  handlePointClick = () => {},
}: {
  title: string;
  text: string;
  handlePointClick?: () => void;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Coordiate copied to clipboard!");
  };

  return (
    <div style={styles.popupContent}>
      <h3>{title}</h3>
      {text}
      <IconButton aria-label="center" onClick={handlePointClick}>
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
    gap: "10px",
  },
};
