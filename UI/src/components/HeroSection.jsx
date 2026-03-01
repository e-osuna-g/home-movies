import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { SearchMovie } from "./SearchMovie";

export default function HeroSection() {
  return (
    <Paper
      variant="elevation"
      elevation={24}
      sx={{
        minHeight: "200px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <SearchMovie />
      <h1>Your Movie Comparison Web</h1>
      <div
        style={{
          display: "flex",
          gap: "5px",
          justifyContent: "space-between",
          alignItems: "center",
          flexGrow: "1",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          This web will let you choose what movie can you see next
        </Typography>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div>Some image in here</div>
      </div>
      <div>Foooter content</div>
    </Paper>
  );
}
