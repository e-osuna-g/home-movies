import CircularProgress from "@mui/material/CircularProgress";
import { useRecentComparisons } from "../Query/useRecentComparisons.js";
import CompareItem from "./CompareItem.jsx";
import Grid from "@mui/material/Grid";

const ParentRecentItems = (theme) => ({
  [theme.breakpoints.down("md")]: {
    justifyContent: "center",
  },
});
export default function RecentComparisons() {
  const { isPending, data, isSuccess } = useRecentComparisons();
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
