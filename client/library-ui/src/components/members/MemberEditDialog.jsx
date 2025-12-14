import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    IconButton
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import API from "../../services/api";
  import CloseIcon from "@mui/icons-material/Close";
  
  export default function MemberEditDialog({ open, onClose, member, onNotify, onUpdated }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
  
    useEffect(() => {
      if (member) {
        setName(member.name);
        setEmail(member.email);
        setPhone(member.phone || "");
      }
    }, [member]);
  
    const update = async () => {
      if (!name || !email) {
        return onNotify("Name & Email required", "error");
      }
  
      try {
        await API.put(`/members/${member.id}`, {
          name,
          email,
          phone,
        });
        onNotify("Member updated successfully", "success");
        onUpdated();
        onClose();
      } catch {
        onNotify("Failed to update member", "error");
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          Edit Member
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={update}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  