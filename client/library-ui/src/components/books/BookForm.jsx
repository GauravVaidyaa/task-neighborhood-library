import { TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { isEmptyOrWhitespace, trimValue } from "../../utils/validation";
import { addBook } from "../../services/libraryApi";

export default function BookForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (isEmptyOrWhitespace(title) || isEmptyOrWhitespace(author)) {
      onSuccess("Title and Author are required", "error");
      return;
    }

    try {
      setLoading(true);

      await addBook({
        title: trimValue(title),
        author: trimValue(author),
        isbn: Date.now().toString(),
      });

      onSuccess("Book added successfully", "success");

      setTitle("");
      setAuthor("");
    } catch (err) {
      onSuccess(err.message, "Failed to add book", "error");
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
      <Button variant="contained" onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Add Book"}
      </Button>
    </Stack>
  );
}
