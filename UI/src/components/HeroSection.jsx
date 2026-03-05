import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { SearchMovie } from "./SearchMovie";

export default function HeroSection() {
  return (
    <Paper
      variant="elevation"
      elevation={1}
      sx={{
        minHeight: "200px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <h1>Your Movie Comparison Web</h1>
      <span>Search your movie and start comparing ratings</span>
      <SearchMovie />
    </Paper>
  );
}
