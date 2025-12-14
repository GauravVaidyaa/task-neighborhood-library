import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  
  export default function ConfirmDialog({
    open,
    title = "Confirm",
    message,
    onCancel,
    onConfirm,
  }) {
    return (
      <Dialog open={open} onClose={onCancel}>
        {/* Title with X icon */}
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          {title}
          <IconButton onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button color="error" variant="contained" onClick={onConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  