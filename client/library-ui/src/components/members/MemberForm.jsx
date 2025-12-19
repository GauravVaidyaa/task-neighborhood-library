import { TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { isEmptyOrWhitespace, trimValue, isValidEmail } from "../../utils/validation";
import { addMember } from "../../services/libraryApi";

export default function MemberForm({ onNotify }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (isEmptyOrWhitespace(name) || isEmptyOrWhitespace(email)) {
      return onNotify("Name and Email are required", "error");
    }

    if (!isValidEmail(email)) {
      return onNotify("Please enter a valid email address", "error");
    }

    try {
      setLoading(true);

      await addMember({
        name: trimValue(name),
        email: trimValue(email),
        phone: trimValue(phone),
      });

      onNotify("Member created successfully", "success");
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      onNotify(err.message || "Failed to create member", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Member Name"
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
      <Button variant="contained" onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Create Member"}
      </Button>
    </Stack>
  );
}
