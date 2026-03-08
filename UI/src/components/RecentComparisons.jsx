import CircularProgress from "@mui/material/CircularProgress";
import { useRecentComparisons } from "../Query/useRecentComparisons.js";
import CompareItem from "./CompareItem.jsx";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

const ParentRecentItems = (theme) => ({
  [theme.breakpoints.down("md")]: {
    justifyContent: "center",
  },
});
export default function RecentComparisons() {
  const { isPending, data, isSuccess } = useRecentComparisons();
  if (isSuccess && data.length == 0) {
    return (
      <Alert severity="info" sx={{ width: "100%" }}>
        Create a comparison, it will be shown here.
      </Alert>
    );
  }
  return (
    <Grid sx={ParentRecentItems} container spacing={10}>
      {isPending ? <CircularProgress /> : isSuccess
        ? (
          data.map((i, index) => <CompareItem key={index} {...i} />)
        )
        : <div>Error on fetching</div>}
    </Grid>
  );
}
