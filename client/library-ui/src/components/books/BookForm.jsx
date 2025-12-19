import { TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { isEmptyOrWhitespace, trimValue, isValidName } from "../../utils/validation";
import { addBook } from "../../services/libraryApi";
import { MESSAGES } from "../../constants/messages";

export default function BookForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (isEmptyOrWhitespace(title) || isEmptyOrWhitespace(author)) {
      onSuccess(MESSAGES.BOOK.TITLE_AND_AUTHOR_REQUIRED, MESSAGES.COMMON.ERROR);
      return;
    }

    if (!isValidName(title)) {
      onSuccess(MESSAGES.BOOK.TITLE_NAME_INVALID, MESSAGES.COMMON.ERROR);
      return;
    }

    if (!isValidName(author)) {
      onSuccess(MESSAGES.BOOK.AUTHOR_NAME_INVALID, MESSAGES.COMMON.ERROR);
      return;
    }

    try {
      setLoading(true);

      await addBook({
        title: trimValue(title),
        author: trimValue(author),
        isbn: Date.now().toString(),
      });

      onSuccess(MESSAGES.BOOK.CREATED_SUCCESS, MESSAGES.COMMON.SUCCESS);

      setTitle("");
      setAuthor("");
    } catch (err) {
      onSuccess(err.message, MESSAGES.BOOK.FAILED_TO_ADD, MESSAGES.COMMON.ERROR);
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
