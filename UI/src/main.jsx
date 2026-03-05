import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import MiniMovieView from "./components/MiniMovieView.jsx";
async function enableMocking() {
  if (import.meta.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return await worker.start();
}
const theme = createTheme({
  palette: {
    primary: blue,
    secondary: {
      main: "#ffc107",
    },
  },
});
enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <MiniMovieView />
      </ThemeProvider>
    </StrictMode>,
  );
});
