import * as React from "react";
import { styled } from "@mui/system";
import {
  Unstable_Popup as BasePopup,
  PopupProps,
} from "@mui/base/Unstable_Popup";
import { Button as BaseButton } from "@mui/base/Button";
import { CssTransition } from "@mui/base/Transitions";
import { tomtomSecondaryColor } from "./colors";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AdsClickIcon from "@mui/icons-material/AdsClick";

const styles = `
  .open {
    opacity: 1;
    transform: translateY(0) scale(1)
    filter: blur(0);
    transition: transform 0.2s cubic-bezier(0.345, 0.275, 0.505, 1.625), opacity 0.2s ease-out;
  }

  .close {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
    filter: blur(3px);
    transition: transform 0.4s ease-out, opacity 0.4s ease-out, filter 0.2s ease-out;
  }
`;

const grey = {
  200: "#DAE2ED",
  700: "#434D5B",
  900: "#1C2025",
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const Button = styled(BaseButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${tomtomSecondaryColor};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
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
  z-index: 1;
  max-height: 80vh;
  overflow: auto;
`
);

const Section = styled("div")`
  padding: 8px;
  display: flex;
`;

export default function CssTransitionComponent() {
  return (
    <div
      style={{
        zIndex: 2000,
        position: "fixed",
        bottom: "10px",
        right: "10px",
      }}
    >
      <style>{styles}</style>
      <PopupWithTrigger>
        <CssTransition
          enterClassName="open"
          exitClassName="close"
          lastTransitionedPropertyOnExit="transform"
        >
          <PopupBody>
            <h3 style={fmtStyles.header}>Layers</h3>
            <div style={fmtStyles.help}>
              Layer is a generic term for a set of points that can be displayed
              on the map. <br />
              It can be a route from the routing API response, or simply a
              collection of geographic coordinates.
            </div>
            To add a new layer, paste its contents into the app, or drag and
            drop a file containing the layer. Once the layer is successfully
            loaded, a toast notification will appear, and the layer will be
            displayed on the map, along with the layer panel on the right.
            <div style={fmtStyles.help}>
              The layer panel contains a list of all layers currently loaded
              into the app.
            </div>
            You can toggle the visibility of each layer by clicking on the
            checkbox in front of the layer name. You can also overview the layer
            by clicking on the <AdsClickIcon fontSize="small" /> button that is
            next to the layer name.
            <br />
            <h3 style={fmtStyles.header}>Points</h3>
            Navigate between points on a focused layer with the arrows in the
            popup or the keys <span style={fmtStyles.emphasize}>
              H
            </span> and <span style={fmtStyles.emphasize}>L</span>.
            <br />
            You can also copy the coordinates of a point by clicking the{" "}
            <ContentCopyIcon fontSize="small" /> button in the popup.
            <br />
            You can focus the map on a point by clicking the{" "}
            <AdsClickIcon fontSize="small" />
            button.
            <br />
            <h3 style={fmtStyles.header}>Go to a location</h3>
            Press the <span style={fmtStyles.emphasize}>G</span> key to open the
            dialog to enter coordinates to navigate to.
            <br />
            You can also copy the coordinates of the current map center by
            right-clicking on the map.
            <br />
            <h3 style={fmtStyles.header}>Tiles</h3>
            Switch between tile providers using the selector in the lower left
            corner, or by using the keys{" "}
            <span style={fmtStyles.emphasize}>J</span> and{" "}
            <span style={fmtStyles.emphasize}>K</span>.
            <br />
            For TomTom tiles, you will need to provide an API key.
            <br />
            <h3 style={fmtStyles.header}>Ruler mode</h3>
            Go to ruler mode by pressing the{" "}
            <span style={fmtStyles.emphasize}>R</span> key. In ruler mode, you
            can measure distances between points by clicking on the map to add
            points to the ruler. You can drag the points around as well.
            <br />
            The measured distance will be displayed in the ruler panel and
            copied to the clipboard.
            <br />
            <div style={fmtStyles.help}>
              Press the <span style={fmtStyles.emphasize}>?</span> key to toggle
              this popup.
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
      <Button ref={setAnchor} onClick={() => setOpen((o) => !o)}>
        ?
      </Button>
      <StyledPopup anchor={anchor} open={open} {...other}>
        {children}
      </StyledPopup>
    </Section>
  );
}

const fmtStyles: { [key: string]: React.CSSProperties } = {
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
