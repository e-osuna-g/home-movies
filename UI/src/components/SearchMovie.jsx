import { useState } from "react";
import SearchMovieAutoComplete from "./SearchMovieAutoComplete.jsx";
import { useSearchMovies } from "../Query/useSearchMovies.js";
import MovieDialog from "./MovieDialog.jsx";

export function SearchMovie() {
  const [dialogMovie, setDialogMovie] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data, _error, isPending } = useSearchMovies(searchValue);

  const closeDialog = () => {
    setDialogMovie("");
  };
  return (
    <>
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
          console.log("newinput", newInputValue);
          if (_event.code == "Enter") return;
          setSearchValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          if (!isPending && data.Search?.length) {
            const movie = data.Search.find((i) => i.Title == newValue);

            if (movie) {
              setDialogMovie(movie.imdbID);
              setSearchValue("");
            }
          }
        }}
      />
      {dialogMovie && (
        <MovieDialog
          open={true}
          movieId={dialogMovie}
          handleClose={closeDialog}
        />
      )}
    </>
  );
}
