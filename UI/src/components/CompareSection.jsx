import Button from "@mui/material/Button";
import RecentComparisons from "./RecentComparisons";
import Paper from "@mui/material/Paper";

export default function CompareSection() {
  return (
    <>
      <div style={{ width: "200px" }}>
        <Button href="/compare">Compare now!</Button>
      </div>
      <Paper
        variant="elevation"
        elevation={1}
        sx={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <RecentComparisons />
      </Paper>
    </>
  );
}
