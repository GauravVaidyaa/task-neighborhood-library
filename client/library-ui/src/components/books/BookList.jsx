import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Typography,
  Box, Button, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookEditDialog from "./BookEditDialog";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import BookForm from "./BookForm";
import ConfirmDialog from "../common/ConfirmDialog";


export default function BookList({ onNotify }) {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteBook, setDeleteBook] = useState(null);



  const loadBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data);
    } catch {
      onNotify("Failed to load books", "error");
    }
  };

  const remove = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      onNotify("Book deleted", "success");
      loadBooks();
    } catch {
      onNotify("Cannot delete book", "error");
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const confirmDeleteBook = async () => {
    if (!deleteBook) return;
  
    try {
      await API.delete(`/books/${deleteBook.id}`);
      onNotify("Book deleted successfully", "success");
  
      await loadBooks();
    } catch {
      onNotify("Failed to delete book", "error");
    } finally {
      setDeleteBook(null);
    }
  };
  

  return (
    <Paper sx={{ mt: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h6">Books</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Book
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {books.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.id}</TableCell>
              <TableCell>{b.title}</TableCell>
              <TableCell>{b.author}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => setEditBook(b)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteBook(b)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {books.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No books found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <BookEditDialog
        open={Boolean(editBook)}
        book={editBook}
        onClose={() => setEditBook(null)}
        onNotify={onNotify}
        onUpdated={loadBooks}
      />
      
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Add Book
        <IconButton onClick={() => setOpenAdd(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
        <DialogContent>
          <BookForm
            onSuccess={(msg, type) => {
              onNotify(msg, type);
              setOpenAdd(false);
              loadBooks();
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteBook)}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteBook?.title}"?`}
        onCancel={() => setDeleteBook(null)}
        onConfirm={confirmDeleteBook}
      />
    </Paper>
  );
}
