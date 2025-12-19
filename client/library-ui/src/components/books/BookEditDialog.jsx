import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { isEmptyOrWhitespace, trimValue, isValidName } from "../../utils/validation";
import { updateBook } from "../../services/libraryApi";
import { MESSAGES } from "../../constants/messages";

export default function BookEditDialog({
  open,
  onClose,
  book,
  onNotify,
  onUpdated,
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
    }
  }, [book]);

  const update = async () => {
    if (isEmptyOrWhitespace(title) || isEmptyOrWhitespace(author)) {
      return onNotify(MESSAGES.BOOK.TITLE_AND_AUTHOR_REQUIRED, MESSAGES.COMMON.ERROR);
    }

    if (!isValidName(title)) {
      return onNotify(MESSAGES.BOOK.TITLE_NAME_INVALID, MESSAGES.COMMON.ERROR);
    }

    if (!isValidName(author)) {
      return onNotify(MESSAGES.BOOK.AUTHOR_NAME_INVALID, MESSAGES.COMMON.ERROR);
    }

    try {
      setLoading(true);
      await updateBook({
        id: book.id,
        title: trimValue(title),
        author: trimValue(author),
      });

      onNotify(MESSAGES.BOOK.UPDATED_SUCCESS, MESSAGES.COMMON.SUCCESS);
      onUpdated();
      onClose();
    } catch (err) {
      onNotify(err.message, MESSAGES.BOOK.FAILED_TO_UPDATE, MESSAGES.COMMON.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Edit Book
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={update} disabled={loading}>
          {loading ? "Updating..." : "Update Book"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
