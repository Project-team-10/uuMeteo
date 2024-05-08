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

export default function RegisterDeviceModal({
  open,
  handleClose,
  onDeviceAdded,
}) {
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
      const newDevice = await createDevice(deviceName);
      onDeviceAdded(newDevice);
      setSnackbarMessage("Device added successfully!");
      setSnackbarSeverity("success");
      handleClose();
    } catch (error) {
      setSnackbarMessage("Failed to add device: " + error.message);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setDeviceName("");
    }
  };

  return (
    <>
      <Dialog
        sx={{ "& .MuiPaper-root": { borderRadius: "10px" } }}
        open={open}
        onClose={() => {
          setDeviceName("");
          handleClose();
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
          Register New Device
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ p: 0.8 }}>
            👇🏾Fill out the name below and click "Add" to register.👇🏾
          </DialogContentText>
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 1)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 1)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(0, 0, 0, 1)",
                  borderWidth: "3px",
                },
              },
            }}
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
          <Button
            sx={{
              backgroundColor: "red",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "rgba(255,255,255,1)",
              color: "black",
              fontSize: "1rem",
              mb: 1,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.8)" },
            }}
            onClick={() => {
              setDeviceName("");
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            sx={{
              backgroundColor: "rgba(37,99,235,1)",
              textTransform: "none",
              color: "white",
              fontWeight: "bold",
              minWidth: "140px",
              fontSize: "1rem",
              borderRadius: "12px",
              mr: 2,
              mb: 1,
              "&:hover": { backgroundColor: "rgba(3,29,255,1)" },
            }}
            onClick={handleAddDevice}
            color="primary"
          >
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
