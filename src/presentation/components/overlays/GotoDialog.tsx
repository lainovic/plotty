import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import Spacer from "../../shared/Spacer";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { isTypingInInput } from "../../utils/keyboardUtils";
import { TOGGLE_GOTO_EVENT } from "./MapUtilityDock";

interface GotoDialogProps {
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

export const GotoDialog: React.FC<GotoDialogProps> = ({
  onCoordinatesChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [errorText, setErrorText] = React.useState<string | null>(null);
  const latitudeInputRef = React.useRef<HTMLInputElement>(null);

  const parseCoordinates = React.useCallback(() => {
    const lat = Number.parseFloat(latitude);
    const lng = Number.parseFloat(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { error: "Enter both latitude and longitude." };
    }
    try {
      return { value: new Coordinates(lat, lng) };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [latitude, longitude]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingInInput(event)) return;
      const key = event.key.toLowerCase();
      if (key === "g") {
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const handleToggleEvent = () => setOpen((prev) => !prev);
    window.addEventListener(TOGGLE_GOTO_EVENT, handleToggleEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(TOGGLE_GOTO_EVENT, handleToggleEvent);
    };
  }, []);

  const onClose = () => {
    setOpen(false);
    setErrorText(null);
    setLatitude("");
    setLongitude("");
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const pasteData = event.clipboardData.getData("text");
    const [lat, lon] = pasteData.split(/[\s,]+/).map((coord) => coord.trim());
    if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon))) {
      setLatitude(lat);
      setLongitude(lon);
      setErrorText(null);
    }
  };

  const parsed = parseCoordinates();
  const canSubmit = "value" in parsed;

  return (
    <Dialog
        open={open}
        onClose={onClose}
        TransitionProps={{
          onEntered: () => {
            setTimeout(() => {
              latitudeInputRef.current?.focus();
            }, 100);
          },
        }}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if ("error" in parsed) {
              setErrorText(parsed.error);
              return;
            }
            onCoordinatesChange(parsed.value);
            onClose();
          },
        }}
      >
        <DialogTitle>Go to a location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Jump the map to a precise coordinate pair.
          </DialogContentText>
          <Spacer heightInPx={20} />
          {errorText && <Alert severity="error" style={styles.alert}>{errorText}</Alert>}
          <TextField
            inputRef={latitudeInputRef}
            label="latitude"
            id="goto-latitude"
            sx={{ m: 1, width: "25ch" }}
            value={latitude}
            onChange={(e) => {
              setLatitude(e.target.value);
              setErrorText(null);
            }}
            onPaste={handlePaste}
            type="number"
            error={!!errorText}
            helperText="Range: -90 to 90"
            inputProps={{ inputMode: "decimal", autoComplete: "off" }}
          />
          <TextField
            label="longitude"
            id="goto-longitude"
            sx={{ m: 1, width: "25ch" }}
            value={longitude}
            onChange={(e) => {
              setLongitude(e.target.value);
              setErrorText(null);
            }}
            onPaste={handlePaste}
            type="number"
            error={!!errorText}
            helperText="Range: -180 to 180"
            inputProps={{ inputMode: "decimal", autoComplete: "off" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              color: `${tomtomSecondaryColor}`,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit}
            sx={{
              color: `${tomtomSecondaryColor}`,
            }}
          >
            Go to
          </Button>
        </DialogActions>
      </Dialog>
  );
};
const styles: { [key: string]: React.CSSProperties } = {
  alert: {
    margin: "0 8px 12px",
  },
};
