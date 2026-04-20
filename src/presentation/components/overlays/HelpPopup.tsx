import React from "react";
import { styled } from "@mui/system";
import {
  Unstable_Popup as BasePopup,
  PopupProps,
} from "@mui/base/Unstable_Popup";
import { Button as BaseButton } from "@mui/base/Button";
import { CssTransition } from "@mui/base/Transitions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { tomtomSecondaryColor } from "../../../shared/colors";
import { Z_INDEX } from "../../constants/zIndex";
import { isTypingInInput } from "../../utils/keyboardUtils";

const cssStyles = `
  .open {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: transform 0.2s cubic-bezier(0.345, 0.275, 0.505, 1.625), opacity 0.2s ease-out;
  }

  .close {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
    transition: transform 0.4s ease-out, opacity 0.4s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .open, .close {
      transition: none;
    }
  }
`;

const grey = {
  200: "#DAE2ED",
  700: "#434D5B",
  900: "#1C2025",
};


const Button = styled(BaseButton)(
  ({ theme }) => `
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${tomtomSecondaryColor};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
  cursor: pointer;
  border: 1px solid ${tomtomSecondaryColor};
  box-shadow: 0 2px 1px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.2)"
  }, inset 0 1.5px 1px ${tomtomSecondaryColor}, inset 0 -2px 1px ${tomtomSecondaryColor};

  &:hover {
    background-color: ${tomtomSecondaryColor};
  }

  &:active {
    background-color: ${tomtomSecondaryColor};
    box-shadow: none;
    transform: scale(0.99);
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${tomtomSecondaryColor};
    outline: none;
  }
`
);

const StyledPopup = styled(BasePopup)`
  max-width: 400px;
`;

const PopupBody = styled("div")(
  ({ theme }) => `
  width: fit-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  background-color: ${
    theme.palette.mode === "dark" ? grey[900] : `rgb(255 255 255 / 0.9)`
  };
  box-shadow: ${
    theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  z-index: ${Z_INDEX.HELP_POPUP};
  max-height: 80vh;
  overflow: auto;
`
);

const Section = styled("div")`
  padding: 8px;
  display: flex;
`;

export function HelpPopup() {
  return (
    <div
      style={{
        zIndex: Z_INDEX.HELP_POPUP,
        position: "fixed",
        bottom: "10px",
        right: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "4px",
      }}
    >
      <style>{cssStyles}</style>
      <div style={fmtStyles.shortcutHint}>? · G · R · J K · H L</div>
      <PopupWithTrigger>
        <CssTransition
          enterClassName="open"
          exitClassName="close"
          lastTransitionedPropertyOnExit="transform"
        >
          <PopupBody>
            <h3 style={fmtStyles.header}>Adding layers</h3>
            Drag and drop a file onto the map, or paste content anywhere on the
            page. Supported formats:
            <div style={fmtStyles.help}>
              <strong>GeoJSON</strong> — .geojson files or pasted GeoJSON.
              Each feature becomes a separate layer, named from its{" "}
              <code>properties.name</code> if present.
              <br />
              <strong>Route JSON</strong> — TomTom routing API response (v0.0.12).
              <br />
              <strong>Logcat</strong> — Android logcat with supported navigation tags.
              <br />
              <strong>TTP</strong> — TomTom Positioning v0.7 format.
              <br />
              <strong>Coordinates</strong> — raw lat/lng pairs, any separator.
            </div>
            <h3 style={fmtStyles.header}>Layer panel</h3>
            The panel on the right is always visible. Hover a layer to reveal
            actions: locate <AdsClickIcon style={{ fontSize: "1em", verticalAlign: "middle" }} />,
            rename, and delete. Click the color dot to change a layer's color.
            The checkbox toggles visibility. Click the layer name to fly to its
            extent.
            <br />
            <h3 style={fmtStyles.header}>Points</h3>
            Click a point to open its popup. Navigate between points with{" "}
            <span style={fmtStyles.emphasize}>H</span> / <span style={fmtStyles.emphasize}>L</span>{" "}
            or the arrow buttons in the popup.
            <br />
            Use <ContentCopyIcon style={{ fontSize: "1em", verticalAlign: "middle" }} /> to copy
            coordinates, and <AdsClickIcon style={{ fontSize: "1em", verticalAlign: "middle" }} /> to
            pan to a point without changing zoom. Log point popups also show a
            locate button next to any coordinate-valued fields.
            <br />
            <h3 style={fmtStyles.header}>Go to a location</h3>
            Press <span style={fmtStyles.emphasize}>G</span> to toggle the Go To
            dialog. Paste a coordinate pair into the latitude field — longitude
            fills in automatically. Press{" "}
            <span style={fmtStyles.emphasize}>Enter</span> to navigate.
            <br />
            Right-click anywhere on the map to copy those coordinates to the
            clipboard.
            <br />
            <h3 style={fmtStyles.header}>Tiles</h3>
            OpenStreetMap is the default — no API key required. Switch providers
            with <span style={fmtStyles.emphasize}>J</span> /{" "}
            <span style={fmtStyles.emphasize}>K</span> or the selector in the
            lower-left corner. TomTom options require an API key.
            <br />
            <h3 style={fmtStyles.header}>Ruler</h3>
            Press <span style={fmtStyles.emphasize}>R</span> to toggle ruler
            mode. Click the map to add measurement points; drag to reposition
            them. The distance is shown in the panel and copied to the
            clipboard. Close with the × button or press{" "}
            <span style={fmtStyles.emphasize}>R</span> again.
            <br />
            <div style={fmtStyles.help}>
              Press <span style={fmtStyles.emphasize}>?</span> to toggle this
              panel. Keyboard shortcuts are shown above the ? button.
            </div>
          </PopupBody>
        </CssTransition>
      </PopupWithTrigger>
    </div>
  );
}

function PopupWithTrigger(props: PopupProps) {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      if (isTypingInInput(e)) return;
      if (e.key === "?") {
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", keyPressHandler);
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };
  }, []);

  const { children, ...other } = props;

  return (
    <Section>
      <Button ref={setAnchor} onClick={() => setOpen((o) => !o)} aria-label="Toggle help">
        ?
      </Button>
      <StyledPopup anchor={anchor} open={open} {...other}>
        {children}
      </StyledPopup>
    </Section>
  );
}

const fmtStyles: { [key: string]: React.CSSProperties } = {
  shortcutHint: {
    fontSize: "0.65rem",
    color: "rgba(0,0,0,0.35)",
    fontFamily: "'Roboto', sans-serif",
    letterSpacing: "0.08em",
    userSelect: "none",
    paddingRight: "4px",
  },
  emphasize: {
    color: tomtomSecondaryColor,
  },
  help: {
    color: "gray",
    borderLeft: `1px solid ${tomtomSecondaryColor}`,
    paddingLeft: "8px",
    margin: "8px 0",
  },
  header: {
    fontSize: "1.0rem",
    color: `${tomtomSecondaryColor}`,
    fontFamily: "'Roboto', sans-serif",
    textTransform: "uppercase",
    fontWeight: 700,
    height: "3vh",
    display: "flex",
    alignItems: "center",
  },
};
