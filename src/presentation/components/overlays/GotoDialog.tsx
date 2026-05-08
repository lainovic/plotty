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
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { isTypingInInput } from "../../utils/keyboardUtils";
import { TOGGLE_GOTO_EVENT, GOTO_STATE_CHANGED } from "./MapUtilityDock";

interface GotoDialogProps {
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

export const GotoDialog: React.FC<GotoDialogProps> = ({
  onCoordinatesChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [errorText, setErrorText] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent(GOTO_STATE_CHANGED, { detail: open }));
  }, [open]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingInInput(event)) return;
      if (event.key.toLowerCase() === "g") setOpen((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    const handleToggleEvent = () => setOpen((prev) => !prev);
    window.addEventListener(TOGGLE_GOTO_EVENT, handleToggleEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(TOGGLE_GOTO_EVENT, handleToggleEvent);
    };
  }, []);

  const parseCoordinates = React.useCallback(() => {
    const parts = input.trim().split(/[\s,]+/).filter(Boolean);
    if (parts.length < 2) return { error: "Enter latitude and longitude." };
    const lat = Number.parseFloat(parts[0]);
    const lng = Number.parseFloat(parts[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { error: "Enter valid numbers." };
    }
    try {
      return { value: new Coordinates(lat, lng) };
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [input]);

  const onClose = () => {
    setOpen(false);
    setErrorText(null);
    setInput("");
  };

  const parsed = parseCoordinates();
  const canSubmit = "value" in parsed;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          Enter a coordinate pair. Paste "lat, lng" to fill at once.
        </DialogContentText>
        {errorText && <Alert severity="error" style={styles.alert}>{errorText}</Alert>}
        <TextField
          autoFocus
          label="Coordinates"
          id="goto-coordinates"
          fullWidth
          sx={{ mt: 2 }}
          value={input}
          onChange={(e) => { setInput(e.target.value); setErrorText(null); }}
          type="text"
          error={!!errorText}
          helperText="e.g. 48.8566, 2.3522"
          inputProps={{ inputMode: "decimal", autoComplete: "off", spellCheck: false }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: tomtomSecondaryColor }}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit} sx={{ color: tomtomSecondaryColor }}>
          Go to
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  alert: {
    margin: "12px 0 0",
  },
};
