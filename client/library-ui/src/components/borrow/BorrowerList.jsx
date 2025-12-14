import { useEffect, useState } from "react";
import API from "../../services/api";
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

export default function BorrowerList({ onNotify }) {
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Load members
  useEffect(() => {
    API.get("/members")
      .then((res) => setMembers(res.data))
      .catch(() => onNotify("Failed to load members", "error"));
  }, []);

  // Load borrowed books
  const loadBorrowedBooks = async (id) => {
    try {
      const res = await API.get(`/borrowed/${id}`);
      setBorrowedBooks(res.data.books || []);
    } catch {
      onNotify("Failed to load borrowed books", "error");
    }
  };

  // Return book
  const returnBook = async (bookId) => {
    try {
      await API.post("/return", { book_id: bookId });
      onNotify("Book returned successfully", "success");
      loadBorrowedBooks(memberId);
    } catch {
      onNotify("Failed to return book", "error");
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
                    onClick={() => returnBook(b.id)}
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
