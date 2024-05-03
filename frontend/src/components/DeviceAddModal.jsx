import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

export default function RegisterDeviceModal({ open, handleClose }) {
  const handleAddDevice = () => {
    console.log("Device added");
    handleClose(); // Call the passed handleClose to close the modal
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Register New Device</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add a new device to your account. Fill out the form below and click
          "Add" to register.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="device"
          label="Device Name"
          type="text"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddDevice} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
