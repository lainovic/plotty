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
import { tomtomSecondaryColor } from "./colors";
import Spacer from "./Spacer";

export default function GotoDialog({
  onCoordinatesChange,
}: {
  onCoordinatesChange: (lat: number, lon: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "g") {
        handleClickOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onCoordinatesChange(parseFloat(latitude), parseFloat(longitude));
          handleClose();
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
          label="latitude"
          id="outlined-start-adornment"
          sx={{ m: 1, width: "25ch" }}
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          onPaste={handlePaste} // Handle paste event
        />
        <TextField
          label="longitude"
          id="outlined-start-adornment"
          sx={{ m: 1, width: "25ch" }}
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          onPaste={handlePaste} // Handle paste event
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
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
}
