import {
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import { isEmptyOrWhitespace } from "../../utils/validation";
import {
  getMembers,
  getBooks,
  borrowBook,
  returnBook,
} from "../../services/libraryApi";
import { MESSAGES } from "../../constants/messages";

export default function BorrowReturn({ onSuccess }) {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [membersRes, booksRes] = await Promise.all([
          getMembers(),
          getBooks(),
        ]);

        setMembers(membersRes);
        setBooks(booksRes);
      } catch (err) {
        onSuccess(err.message || MESSAGES.COMMON.FAILED_TO_LOAD_DATA, MESSAGES.COMMON.ERROR);
      }
    };

    loadData();
  }, []);

  const borrow = async () => {
    if (isEmptyOrWhitespace(memberId) || isEmptyOrWhitespace(bookId)) {
      onSuccess(MESSAGES.BORROW.MEMBER_AND_BOOK_SELECTION_REQUIRED, MESSAGES.COMMON.ERROR);
      return;
    }

    try {
      setLoading(true);

      await borrowBook({
        member_id: Number(memberId),
        book_id: Number(bookId),
      });

      onSuccess(MESSAGES.BORROW.BORROW_SUCCESS, MESSAGES.COMMON.SUCCESS);
      setMemberId("");
      setBookId("");
    } catch (err) {
      onSuccess(err.message || MESSAGES.BORROW.FAILED_BORROW, MESSAGES.COMMON.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async () => {
    if (isEmptyOrWhitespace(bookId)) {
      onSuccess(MESSAGES.BORROW.BOOK_SELECTION_REQUIRED, MESSAGES.COMMON.ERROR);
      return;
    }

    try {
      setLoading(true);

      await returnBook({
        book_id: Number(bookId),
      });

      onSuccess(MESSAGES.BORROW.RETURN_SUCCESS, MESSAGES.COMMON.SUCCESS);
      setBookId("");
    } catch (err) {
      onSuccess(err.message || MESSAGES.BORROW.FAILED_RETURN, MESSAGES.COMMON.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel>Member</InputLabel>
        <Select
          value={memberId}
          label="Member"
          onChange={(e) => setMemberId(e.target.value)}
        >
          {members &&
            members.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Book</InputLabel>
        <Select
          value={bookId}
          label="Book"
          onChange={(e) => setBookId(e.target.value)}
        >
          {books &&
            books.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.title}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={borrow} disabled={loading}>
        {loading ? "Borrowing..." : "Borrow"}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleReturnBook}
        disabled={loading}
      >
        {loading ? "Returning..." : "Return"}
      </Button>
    </Stack>
  );
}
