import { Container, Tabs, Tab, Box, Paper, Button, Typography, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { useState } from "react";
import BookList from "./components/books/BookList";
import BorrowReturn from "./components/borrow/BorrowReturn";
import AlertSnackbar from "./components/common/AlertSnackbar";
import MemberList from "./components/members/MemberList";
import BorrowerList from "./components/borrow/BorrowerList";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export default function App() {
  const [tab, setTab] = useState(0);
  const [alert, setAlert] = useState({ open: false, msg: "", type: "success" });
  const [openBorrow, setOpenBorrow] = useState(false);

  const notify = (msg, type) => {
    setAlert({ open: true, msg, type });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Books" />
          <Tab label="Members" />
          <Tab label="Borrow / Return" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && (
            <>
              <BookList onNotify={notify} />
            </>
          )}

          {tab === 1 && (
            <>
              <MemberList onNotify={notify} />
            </>
          )}
          
          {tab === 2 && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Borrowing</Typography>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenBorrow(true)}
                >
                  Borrow Book
                </Button>
              </Box>

              <BorrowerList onNotify={notify} />

              <Dialog open={openBorrow} onClose={() => setOpenBorrow(false)} fullWidth>
                <DialogTitle
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  Borrow Book
                  <IconButton onClick={() => setOpenBorrow(false)}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <BorrowReturn
                    onSuccess={(msg, type) => {
                      notify(msg, type);
                      setOpenBorrow(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </Box>
      </Paper>

      <AlertSnackbar
        open={alert.open}
        message={alert.msg}
        type={alert.type}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Container>
  );
}
