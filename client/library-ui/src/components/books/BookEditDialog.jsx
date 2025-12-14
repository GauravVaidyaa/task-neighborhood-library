import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    IconButton 
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import API from "../../services/api";
  import CloseIcon from "@mui/icons-material/Close";
  
  export default function BookEditDialog({ open, onClose, book, onNotify, onUpdated }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
  
    useEffect(() => {
      if (book) {
        setTitle(book.title);
        setAuthor(book.author);
      }
    }, [book]);
  
    const update = async () => {
      if (!title || !author) {
        return onNotify("Title & Author required", "error");
      }
  
      try {
        await API.put(`/books/${book.id}`, { title, author });
        onNotify("Book updated successfully", "success");
        onUpdated();
        onClose();
      } catch (err) {
        onNotify("Failed to update book", "error");
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          Edit Book
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={update}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  