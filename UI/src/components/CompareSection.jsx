import Button from "@mui/material/Button";
import RecentComparisons from "./RecentComparisons";
import Paper from "@mui/material/Paper";

export default function CompareSection() {
  return (
    <Paper
      variant="elevation"
      elevation={24}
      sx={{
        marginTop: "2rem",
        padding: "1rem",
        display: "flex",

        justifyContent: "space-between",
      }}
    >
      <RecentComparisons />
      <Button href="/compare">Compare now!</Button>
    </Paper>
  );
}
