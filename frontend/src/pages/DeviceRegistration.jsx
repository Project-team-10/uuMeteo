import React, { useState } from "react";
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
import { styled } from "@mui/material/styles";
import RegisterDeviceModal from "../components/DeviceAddModal";

const CustomHeader = styled("h1")(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: "bold",
  margin: 0,
  padding: theme.spacing(2, 0),
}));

export default function DeviceRegistration() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <CustomHeader>Device Registration</CustomHeader>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleOpenModal}
        >
          Add Device
        </Button>
      </div>
      <RegisterDeviceModal open={modalOpen} handleClose={handleCloseModal} />
      <TableContainer component={Paper} className="overflow-x-auto">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Secret Key</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {["Sensor 1", "Camera 2", "Thermostat 3"].map((device, index) => (
              <TableRow key={device}>
                <TableCell component="th" scope="row" className="font-medium">
                  {device}
                </TableCell>
                <TableCell>
                  {["abc123def456", "ghi789jkl012", "mno345pqr678"][index]}
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="delete" size="large">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
