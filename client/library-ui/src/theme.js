import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // 🔴 force light mode
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    primary: {
      main: "#1976d2",
    },
  },
});

export default theme;
