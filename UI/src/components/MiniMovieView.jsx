import Typography from "@mui/material/Typography";
import { useGetMovie } from "../Query/useGetMovie.js";
import Skeleton from "@mui/material/Skeleton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

const MiniMovieViewStyled = styled("div", {
  name: "MiniMovieView",
})({
  position: "relative",
  boxSizing: "border-box",
  width: "200px",
  backgroundColor: "",
  flex: 1,
  display: "flex",

  "& .mini-movie-card": {
    padding: "10px",
    paddingTop: "20px",
    display: "flex",

    flexDirection: "column",
    alignItems: "center",
    "& p": {
      flex: 1,
      alignContent: "space-evenly",
    },
  },
  "& img.mini-movie-poster": {
    maxHeight: "150px",
  },
  "& .mini-movie-close-button": {
    cursor: "pointer",
    position: "absolute",
    top: "-5px",
    right: "-5px",
  },
});
export default function MiniMovieView({ movieId, removeMovie }) {
  const { data: movie, isPending } = useGetMovie(movieId);
  if (isPending) {
    return <CircularProgress />;
  } else if (movie) {
    return (
      <MiniMovieViewStyled>
        <Card
          className="mini-movie-card"
          elevation={6}
          sx={{ position: "relative", padding: "5px" }}
        >
          <img
            className="mini-movie-poster"
            src={movie.Poster}
          />
          <Typography>
            {movie.Title}
          </Typography>

          <IconButton
            aria-label="close"
            onClick={removeMovie}
            className="mini-movie-close-button"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Card>
      </MiniMovieViewStyled>
    );
  } else {
    return <div>Error</div>;
  }
}
