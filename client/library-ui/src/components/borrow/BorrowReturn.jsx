import { TextField, Button, Stack } from "@mui/material";
import API from "../../services/api";
import { useState } from "react";

export default function BorrowReturn({ onSuccess }) {
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");

  const borrow = async () => {
    if (!memberId || !bookId) {
      return onSuccess("IDs required", "error");
    }
    try {
      await API.post("/borrow", {
        member_id: Number(memberId),
        book_id: Number(bookId),
      });
      onSuccess("Book borrowed", "success");
    } catch (e) {
      onSuccess(e.response?.data?.error, "error");
    }
  };

  const returnBook = async () => {
    await API.post("/return", { book_id: Number(bookId) });
    onSuccess("Book returned", "success");
  };

  return (
    <Stack spacing={2}>
      <TextField label="Member ID" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
      <TextField label="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} />
      <Button variant="contained" onClick={borrow}>Borrow</Button>
      {/* <Button variant="outlined" onClick={returnBook}>Return</Button> */}
    </Stack>
  );
}
