import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";
import { tomtomSecondaryColor } from "../../../shared/colors";
import Spacer from "../../shared/Spacer";
import { Coordinates } from "../../../domain/value-objects/Coordinates";
import { isTypingInInput } from "../../utils/keyboardUtils";

interface GotoDialogProps {
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

export const GotoDialog: React.FC<GotoDialogProps> = ({
  onCoordinatesChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const latitudeInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingInInput(event)) return;
      const key = event.key.toLowerCase();
      if (key === "g") {
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onClose = () => {
    setOpen(false);
    // Clear the fields when closing
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
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{
        onEntered: () => {
          // Focus the latitude input after the dialog has fully entered
          setTimeout(() => {
            latitudeInputRef.current?.focus();
          }, 100);
        },
      }}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onCoordinatesChange(
            new Coordinates(parseFloat(latitude), parseFloat(longitude))
          );
          onClose();
        },
      }}
    >
      <DialogTitle>Go to a location</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the coordinates of the location you want to go to.
        </DialogContentText>
        <Spacer heightInPx={20} />
        <TextField
          inputRef={latitudeInputRef}
          label="latitude"
          id="goto-latitude"
          sx={{ m: 1, width: "25ch" }}
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          onPaste={handlePaste}
          type="number"
          inputProps={{ inputMode: "decimal", autoComplete: "off" }}
        />
        <TextField
          label="longitude"
          id="goto-longitude"
          sx={{ m: 1, width: "25ch" }}
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          onPaste={handlePaste}
          type="number"
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
