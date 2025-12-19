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
import { isEmptyOrWhitespace, trimValue, isValidEmail } from "../../utils/validation";
import { updateMember } from "../../services/libraryApi";

export default function MemberEditDialog({
  open,
  onClose,
  member,
  onNotify,
  onUpdated,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setPhone(member.phone || "");
    }
  }, [member]);

  const update = async () => {
    if (isEmptyOrWhitespace(name) || isEmptyOrWhitespace(email)) {
      return onNotify("Name & Email required", "error");
    }

    if (!isValidEmail(email)) {
      return onNotify("Please enter a valid email address", "error");
    }

    try {
      setLoading(true);

      await updateMember({
        id: member.id,
        name: trimValue(name),
        email: trimValue(email),
        phone: trimValue(phone),
      });

      onNotify("Member updated successfully", "success");
      onUpdated();
      onClose();
    } catch (err) {
      onNotify(err.message || "Failed to update member", "error");
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
        Edit Member
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={update} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
