import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function ConfirmDialog({ open, onClose, onConfirm, message }) {
  return (
    <Dialog
      sx={{ "& .MuiPaper-root": { borderRadius: "10px" } }}
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Action</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
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
          onClick={onClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: "rgba(244,67,54,1)",
            textTransform: "none",
            color: "white",
            fontWeight: "bold",
            minWidth: "140px",
            fontSize: "1rem",
            borderRadius: "12px",
            mr: 2,
            mb: 1,
            "&:hover": { backgroundColor: "rgba(255,6,20,1)" },
          }}
          onClick={onConfirm}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
