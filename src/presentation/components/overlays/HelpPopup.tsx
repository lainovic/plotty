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
      <div style={fmtStyles.shortcutHint}>? · G · R · J/K · H/L</div>
      <PopupWithTrigger>
        <CssTransition
          enterClassName="open"
          exitClassName="close"
          lastTransitionedPropertyOnExit="transform"
        >
          <PopupBody>
            <h3 style={fmtStyles.header}>Quick Start</h3>
            <div style={fmtStyles.help}>
              Drop a file on the map, or focus the map and paste content.
              Supported imports: GeoJSON, TomTom route JSON, TTP, supported
              logcat navigation messages, and raw coordinates.
            </div>
            <h3 style={fmtStyles.header}>Operator Notes</h3>
            <div style={fmtStyles.compactList}>
              <div>Use the layer panel to jump, rename, recolor, reorder, hide, or delete results.</div>
              <div>Use <ContentCopyIcon style={{ fontSize: "1em", verticalAlign: "middle" }} /> to copy coordinates and <AdsClickIcon style={{ fontSize: "1em", verticalAlign: "middle" }} /> to pan to a point.</div>
              <div>Use the lower-left tool dock for <span style={fmtStyles.emphasize}>Go To</span>, <span style={fmtStyles.emphasize}>Ruler</span>, and map tiles.</div>
            </div>
            <div style={fmtStyles.help}>
              Shortcuts: <span style={fmtStyles.emphasize}>?</span> help, <span style={fmtStyles.emphasize}>G</span> Go To, <span style={fmtStyles.emphasize}>R</span> ruler, <span style={fmtStyles.emphasize}>J/K</span> tiles, <span style={fmtStyles.emphasize}>H/L</span> point navigation.
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
    color: "rgba(0,0,0,0.6)",
    borderLeft: `1px solid ${tomtomSecondaryColor}`,
    paddingLeft: "8px",
    margin: "8px 0",
  },
  compactList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "rgba(0,0,0,0.72)",
    lineHeight: 1.45,
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
