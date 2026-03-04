import Typography from "@mui/material/Typography";
import { useGetMovie } from "../Query/useGetMovie.js";
import Skeleton from "@mui/material/Skeleton";

export default function MiniMovieView({ movieId, removeMovie }) {
  const { data: movie, isPending } = useGetMovie(movieId);
  if (isPending) {
    return <Skeleton variant="rectangular" width={210} height={118} />;
  } else if (movie) {
    return (
      <div
        style={{
          position: "relative",
          boxSizing: "border-box",
          height: "200px",
          width: "200px",
          padding: "10px",
        }}
      >
        <img src={movie.Poster} style={{ maxWidth: "150px" }} />
        <Typography>
          {movie.Title}
        </Typography>
        <span
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "0px",
            right: "0px",
          }}
          onClick={removeMovie}
        >
          X
        </span>
      </div>
    );
  } else {
    return <div>Error</div>;
  }
}
