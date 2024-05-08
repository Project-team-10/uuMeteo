import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import RegisterDeviceModal from "../components/DeviceAddModal";
import ConfirmDelete from "../components/ConfirmDelete"; // Ensure this component is correctly imported
import { useNavigate } from "react-router-dom";
import { fetchDevices, deleteDevice } from "../services/apis"; // Ensure deleteDevice is imported

const CustomHeader = styled("h1")(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: "bold",
  padding: theme.spacing(3, 0),
  fontFamily: "sans-serif",
}));

export default function DeviceRegistration() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  const loadDevices = async () => {
    const fetchedDevices = await fetchDevices();
    if (fetchedDevices) {
      setDevices(fetchedDevices);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleOpenConfirm = (device) => {
    setCurrentDevice(device);
    setConfirmOpen(true);
  };

  const handleDeleteDevice = async () => {
    if (currentDevice && currentDevice.deviceId) {
      try {
        const deletedDevice = await deleteDevice(currentDevice.deviceId);
        if (deletedDevice) {
          console.log("Device deleted:", deletedDevice);
        }
        setDevices(
          devices.filter((device) => device.deviceId !== currentDevice.deviceId)
        );
        handleCloseConfirm();
      } catch (error) {
        console.error("Error during deletion:", error);
      }
    } else {
      console.error("Device ID is undefined.");
    }
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setCurrentDevice(null); // Reset currentDevice state when closing confirmation dialog
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <IconButton
          onClick={handleBackToDashboard}
          sx={{
            color: "black",
            borderRadius: "50%",
            border: "1px solid black",
            backgroundColor: "grey.300",
            "&:hover": { backgroundColor: "rgba(37,99,235,0.3)" },
          }}
          aria-label="back to dashboard"
        >
          <ArrowBackIcon />
        </IconButton>
        <CustomHeader>Devices</CustomHeader>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "rgba(37,99,235,1)",
            color: "white",
            textTransform: "none",

            fontWeight: "bold",
            fontSize: "0.875rem",
            padding: "6px 12px",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
          onClick={handleOpenModal}
        >
          Add Device
        </Button>
      </div>
      <RegisterDeviceModal
        open={modalOpen}
        handleClose={handleCloseModal}
        onDeviceAdded={(newDevice) => {
          setDevices((prevDevices) => [...prevDevices, newDevice]);
          loadDevices();
        }}
      />

      <ConfirmDelete
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDeleteDevice}
        message="Are you sure you want to delete this device?"
      />
      <TableContainer
        sx={{
          backgroundColor: "rgba(37,99,235,0.15)",
          "& .MuiTableCell-root": {
            borderColor: "rgba(0,0,0,0.5)",
          },
        }}
        component={Paper}
        className="overflow-x-auto"
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Secret Key
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => {
              return (
                <TableRow key={`${device.name}`}>
                  <TableCell component="th" scope="row" className="font-medium">
                    {device.name}
                  </TableCell>
                  <TableCell>{device.secretKey}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenConfirm(device)}
                      sx={{
                        color: "rgba(80,0,0,1)",
                        border: "1px solid red",
                        backgroundColor: "rgba(223,63,5,0.3)",
                        "&:hover": {
                          backgroundColor: "rgba(223,63,5,0.5)",
                        },
                        borderRadius: 3,
                      }}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
