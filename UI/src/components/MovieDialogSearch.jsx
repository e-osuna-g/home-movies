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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MovieDialogContent from "./MovieDialogContent.jsx";

export default function MovieDialogSearch(
  { open, addMovieHandler, handleClose },
) {
  const [selectedMovie, setMovie] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const { data, isPending, error } = useSearchMovies(searchValue);
  const { data: movie, _isPending } = useGetMovie(
    selectedMovie?.imdbID,
  );
  const setAndClose = (id) => {
    if (id) {
      addMovieHandler(id);
      setMovie(null);
      setSearchValue("");
      handleClose();
    }
  };
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle>Add Movie to compare</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
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
              console.log("loggin", newInputValue, _event);
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
        <MovieDialogContent movie={movie} searchError={error} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => setAndClose(movie.imdbID)}
        >
          Add to compare
        </Button>
      </DialogActions>
    </Dialog>
  );
}
