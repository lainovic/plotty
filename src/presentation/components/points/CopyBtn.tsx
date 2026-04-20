import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";

export function CopyBtn({ value, label }: { value: string; label: string }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      aria-label={label}
      style={{ ...styles.btn, opacity: hovered ? 0.7 : 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard");
      }}
    >
      <ContentCopyIcon style={{ fontSize: "11px" }} />
    </button>
  );
}

const styles = {
  btn: {
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
  } as React.CSSProperties,
};
