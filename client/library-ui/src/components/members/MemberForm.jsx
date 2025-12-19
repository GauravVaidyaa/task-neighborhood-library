import { TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { isEmptyOrWhitespace, trimValue, isValidEmail, isValidName, isValidPhone } from "../../utils/validation";
import { addMember } from "../../services/libraryApi";
import { MESSAGES } from "../../constants/messages";

export default function MemberForm({ onNotify }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (isEmptyOrWhitespace(name) || isEmptyOrWhitespace(email)) {
      return onNotify(MESSAGES.MEMBER.NAME_AND_EMAIL_REQUIRED, MESSAGES.COMMON.ERROR);
    }

    if (!isValidName(name)) {
      return onNotify(MESSAGES.MEMBER.NAME_INVALID, MESSAGES.COMMON.ERROR);
    }

    if (!isValidEmail(email)) {
      return onNotify(MESSAGES.MEMBER.EMAIL_INVALID, MESSAGES.COMMON.ERROR);
    }

    if (phone && !isValidPhone(phone)) {
      return onNotify(MESSAGES.MEMBER.PHONE_INVALID, MESSAGES.COMMON.ERROR);
    }

    try {
      setLoading(true);

      await addMember({
        name: trimValue(name),
        email: trimValue(email),
        phone: trimValue(phone),
      });

      onNotify(MESSAGES.MEMBER.CREATED_SUCCESS, MESSAGES.COMMON.SUCCESS);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      onNotify(err.message || MESSAGES.MEMBER.FAILED_TO_CREATE_MEMBER, MESSAGES.COMMON.ERROR);
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
