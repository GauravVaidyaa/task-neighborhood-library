import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MemberEditDialog from "./MemberEditDialog";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MemberForm from "./MemberForm";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  getMembers,
  deleteMember as deleteMemberApi,
} from "../../services/libraryApi";

export default function MemberList({ onNotify }) {
  const [members, setMembers] = useState([]);
  const [editMember, setEditMember] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteMember, setDeleteMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      onNotify(err.message || "Failed to load members", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteMemberApi(id);
      onNotify("Member deleted", "success");
      loadMembers();
    } catch (err) {
      onNotify(err.message, "Cannot delete member", "error");
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <Paper sx={{ mt: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h6">Members</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Member
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.id}</TableCell>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.phone || "-"}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => setEditMember(m)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteMember(m)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {!loading && members.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <MemberEditDialog
        open={Boolean(editMember)}
        member={editMember}
        onClose={() => setEditMember(null)}
        onNotify={onNotify}
        onUpdated={loadMembers}
      />
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add Member
          <IconButton onClick={() => setOpenAdd(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <MemberForm
            onNotify={(msg, type) => {
              onNotify(msg, type);
              setOpenAdd(false);
              loadMembers();
            }}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={Boolean(deleteMember)}
        title="Delete Member"
        message={`Are you sure you want to delete "${deleteMember?.name}"?`}
        onCancel={() => setDeleteMember(null)}
        onConfirm={async () => {
          try {
            await API.delete(`/members/${deleteMember.id}`);
            onNotify("Member deleted successfully", "success");
            loadMembers();
          } catch {
            onNotify("Cannot delete member (active borrowings?)", "error");
          }
          setDeleteMember(null);
        }}
      />
    </Paper>
  );
}
