import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { createDevice } from "../services/apis";

export default function RegisterDeviceModal({ open, handleClose }) {
  const [deviceName, setDeviceName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddDevice = async () => {
    try {
      await createDevice(deviceName);
      setSnackbarMessage("Device added successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to add device: " + error.message);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setDeviceName("");
      handleClose();
    }
  };

  return (
    <>
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
            id="deviceName"
            label="Device Name"
            type="text"
            fullWidth
            variant="outlined"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
