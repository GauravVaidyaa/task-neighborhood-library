import { Snackbar, Alert } from "@mui/material";

export default function AlertSnackbar({ open, message, type, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity={type} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
