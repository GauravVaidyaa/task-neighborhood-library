import { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from "@mui/material";
import {
  getMembers,
  getBorrowedBooks,
  returnBook,
} from "../../services/libraryApi";

export default function BorrowerList({ onNotify }) {
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load members
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      onNotify(err.message || "Failed to load members", "error");
    }
  };

  // Load borrowed books
  const loadBorrowedBooks = async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getBorrowedBooks(id);
      setBorrowedBooks(data.books || []);
    } catch (err) {
      onNotify(err.message || "Failed to load borrowed books", "error");
    } finally {
      setLoading(false);
    }
  };

  // Return book
  const handleReturnBook = async (bookId) => {
    try {
      await returnBook({ book_id: bookId });
      onNotify("Book returned successfully", "success");
      loadBorrowedBooks(memberId);
    } catch (err) {
      onNotify(err.message || "Failed to return book", "error");
    }
  };

  return (
    <Box>
      {/* Member Select */}
      <Select
        fullWidth
        value={memberId}
        displayEmpty
        onChange={(e) => {
          setMemberId(e.target.value);
          loadBorrowedBooks(e.target.value);
        }}
      >
        <MenuItem value="">Select Member</MenuItem>
        {members.map((m) => (
          <MenuItem key={m.id} value={m.id}>
            {m.name}
          </MenuItem>
        ))}
      </Select>

      {/* Table */}
      {borrowedBooks.length > 0 && (
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Author</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {borrowedBooks.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={() => handleReturnBook(b.id)}
                    disabled={loading}
                  >
                    Return
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {memberId && borrowedBooks.length === 0 && (
        <Typography mt={2}>No borrowed books</Typography>
      )}
    </Box>
  );
}
