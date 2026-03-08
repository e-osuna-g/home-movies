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
        options={data?.Search ? data.Search.map((i) => i) : []}
        inputValue={searchValue}
        value={null}
        onInputChange={(_event, newInputValue) => {
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
