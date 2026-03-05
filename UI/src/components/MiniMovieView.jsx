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
  height: "200px",
  width: "200px",
  padding: "10px",
  marginTop: "5px",
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
        <Card elevation={6} sx={{ position: "relative", paddingTop: "5px" }}>
          <img
            className="mini-movie-poster"
            src={movie.Poster}
          />
          <Typography>
            {movie.Title}
          </Typography>
          <span
            className="mini-movie-close-button"
            onClick={removeMovie}
          >
            <CloseIcon />
          </span>
        </Card>
      </MiniMovieViewStyled>
    );
  } else {
    return <div>Error</div>;
  }
}
