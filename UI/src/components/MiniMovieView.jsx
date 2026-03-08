import Typography from "@mui/material/Typography";
import { useGetMovie } from "../Query/useGetMovie.js";
import Skeleton from "@mui/material/Skeleton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";

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
    top: "0px",
    right: "0px",
  },
});
export default function MiniMovieView({ movieId, removeMovie }) {
  const { data: movie, isPending } = useGetMovie(movieId);
  if (isPending) {
    return <Skeleton variant="rectangular" width={210} height={118} />;
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

          <CloseIcon
            className="mini-movie-close-button"
            onClick={removeMovie}
            role="button"
          />
        </Card>
      </MiniMovieViewStyled>
    );
  } else {
    return <div>Error</div>;
  }
}
