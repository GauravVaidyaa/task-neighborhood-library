import { TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import API from "../../services/api";

export default function MemberForm({ onNotify }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = async () => {
    if (!name || !email) {
      return onNotify("Name and Email are required", "error");
    }

    try {
      await API.post("/members", {
        name,
        email,
        phone,
      });

      onNotify("Member created successfully", "success");
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      onNotify(
        err.response?.data?.error || "Failed to create member",
        "error"
      );
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
      <Button variant="contained" onClick={submit}>
        Create Member
      </Button>
    </Stack>
  );
}
