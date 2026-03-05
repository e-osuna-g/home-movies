import Chip from "@mui/material/Chip";
import MovieIcon from "@mui/icons-material/Movie";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

const MovieDialogContentStyled = styled("div", {
  name: "MovieDialogContentStyled",
})({
  display: "flex",
  gap: "10px",
});

export default function MovieDialogContent(
  { movie, searchError },
) {
  if (!movie) {
    return <div>Loading...</div>;
  }
  console.log("whatismovie", searchError);

  if (
    searchError && searchError.Response == "False" &&
    searchError.Error == "Too many results."
  ) {
    return (
      <div>
        Too many results, please improve your search, with a more unique search
      </div>
    );
  }
  if (movie && movie.Response == "False") {
    return <div>Please, use a longer work for your search</div>;
  }
  return (
    <MovieDialogContentStyled>
      <div>
        <img src={movie?.Poster} />
      </div>
      <div>
        <div id="alert-dialog-slide-description">
          <div>
            <div>Year: {movie?.Year}</div>
            <div>Released: {movie.Released}</div>
            <div>Director: {movie?.Director}</div>
            <div>
              Main Cast: {movie?.Actors}
            </div>
            <div>
              Writers: {movie?.Writer}
            </div>
            <div>
              Genre:
              <div className="movie-dialog-chips">
                {movie?.Genre?.split(",").map((i, index) => (
                  <Chip
                    key={index}
                    label={i}
                    variant="outlined"
                  />
                ))}
              </div>
            </div>
            <div className={`movie-dialog-rated ${movie?.Rated}`}>
              <span>Rated:</span>
              <MovieIcon />
              <span>
                {movie?.Rated}
              </span>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <span>Duration: {movie.Runtime}</span>
            </div>
            <div>
            </div>
          </div>
          <div>
            Plot:<br /> <span>{movie?.Plot}</span>
          </div>
          <Divider style={{ padding: "5px" }} />
          <div>
            <div>Awards: {movie.Awards}</div>
            <div>
              Language{movie.Language?.indexOf(",") != -1 ? "s" : ""}:
              {movie.Language}
            </div>
            <div>
              Countr{movie.Country?.indexOf(",") != -1 ? "ies" : "y"}:
              <span>{movie.Country}</span>
            </div>
          </div>
        </div>
      </div>
    </MovieDialogContentStyled>
  );
}
