import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

const gridItemStyle = (theme) => ({
  padding: theme.spacing(1),
  boxShadow: theme.shadows[3],
  boxSizing: "border-box",

  "& .compare-carousel-item": {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-evenly",
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    "& a": {
      textDecorationColor: theme.palette.secondary.contrastText,
      "&:hover": {
        color: theme.palette.primary["100"],
      },
    },
  },
  "& a": {
    color: theme.palette.secondary.contrastText,
  },
});
export default function CompareItem(prop) {
  const query = new URLSearchParams();
  for (let i of prop.imdbIds) {
    query.append("movies", i);
  }
  query.append("id", prop.id);
  return (
    <Grid
      size={{ xs: 12, md: 3 }}
      sx={gridItemStyle}
    >
      <div className="compare-carousel-item">
        {prop.titles.map((title, i) => <div key={i}>{title}</div>)}
        <Link underline="always" href={`/compare?${query.toString()}`}>
          Compare
        </Link>
      </div>
    </Grid>
  );
}
