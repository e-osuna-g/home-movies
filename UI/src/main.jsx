import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
const theme = createTheme({
  palette: {
    primary: blue,
    secondary: {
      main: "#ffc107",
    },
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
