import { TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import API from "../../services/api";

export default function BookForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title || !author) {
      onSuccess("Title & Author are required", "error");
      return;
    }

    try {
      setLoading(true);

      await API.post("/books", {
        title,
        author,
        isbn: Date.now().toString(), // 🔴 IMPORTANT (backend expects this)
      });

      onSuccess("Book added successfully", "success");

      // optional reset
      setTitle("");
      setAuthor("");
    } catch (err) {
      onSuccess("Failed to add book", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} mt={1}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        label="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Add Book"}
      </Button>
    </Stack>
  );
}
