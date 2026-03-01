import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import SearchMovieAutoComplete from "./SearchMovieAutoComplete";
import { useState } from "react";
import { useSearchMovies } from "../Query/useSearchMovies";
import { useGetMovie } from "../Query/useGetMovie";

export default function MovieDialogSearch({ open, handleClose }) {
  const [selectedMovie, setMovie] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const { data, isPending } = useSearchMovies(searchValue);
  const { data: movie, _isPending } = useGetMovie(
    selectedMovie?.imdbID,
  );

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Add Movie to compare</DialogTitle>
      <DialogContent>
        <div style={{ paddingTop: "5px" }}>
          <SearchMovieAutoComplete
            options={data?.Search
              ? data.Search.filter((current, index, array) => {
                return !array.some((f, fIndex) =>
                  f.Title == current.Title && fIndex != index
                );
              }).map((i) => i.Title)
              : []}
            inputValue={searchValue}
            value={null}
            onInputChange={(_event, newInputValue) => {
              setSearchValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              if (!isPending && data.Search?.length) {
                const movie = data.Search.find((i) => i.Title == newValue);
                if (movie) {
                  setMovie(movie);
                  setSearchValue("");
                }
              }
            }}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div>
            {movie ? <img src={movie.Poster} /> : null}

            <Button variant="contained">Compare</Button>
          </div>
          <div>
            <div id="alert-dialog-slide-description">
              <div>Title: {movie?.Title}</div>
              <div>
                <div>Year: {movie?.Year}</div>
                <div>
                  Genre: {movie?.Genre?.split(",").map((i, index) => (
                    <Chip
                      key={index}
                      label={i}
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </div>
                <div>Rating: {movie?.Rated}</div>
              </div>
              <div>Plot: {movie?.Plot}</div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
}
