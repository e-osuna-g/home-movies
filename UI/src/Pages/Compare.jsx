import Button from "@mui/material/Button";
import MiniMovieView from "../components/MiniMovieView";
import MovieDialogSearch from "../components/MovieDialogSearch";
import { useState } from "react";
import useCompareMovies from "../Query/useCompareMovies.js";
import { useEffect } from "react";
import Graph from "../components/Graph.jsx";

export default function Compare() {
  const queryValues = new URLSearchParams(window.location.search);
  const queryMovies = queryValues.getAll("movies");
  const comparedAt = queryValues.get("compared_at");

  const [isOpen, setIsOpen] = useState(false);
  const [comparedData, setComparedData] = useState(null);
  const [movies, setMovies] = useState(queryMovies);
  const mutation = useCompareMovies(movies, comparedAt);
  useEffect(() => {
    //initial mutation to refresh everything
    mutation.mutate([...movies], {
      onSuccess: (response) => {
        setComparedData(response);
      },
    });
  }, []);
  const handleClose = () => {
    setIsOpen(false);
  };
  const addMovie = (movieId) => {
    mutation.mutate([...movies, movieId], {
      onSuccess: (response) => {
        setComparedData(response);
        setMovies((state) => [...state, movieId]);
      },
    });
  };
  const removeMovie = (movieId) => {
    const newState = movies.filter((id) => id !== movieId);
    mutation.mutate(newState, {
      onSuccess: (response) => {
        setComparedData(response);
        setMovies(() => {
          return newState;
        });
      },
    });
  };
  return (
    <div>
      <div style={{ height: "400px", width: "100%" }}>
        <Graph data={comparedData} />
      </div>
      <div>
        <Button onClick={() => setIsOpen(true)}>+ Add movie</Button>
      </div>
      <div style={{ display: "flex" }}>
        {movies.map((id) => (
          <MiniMovieView
            movieId={id}
            removeMovie={() => removeMovie(id)}
          />
        ))}
      </div>
      <MovieDialogSearch
        open={isOpen}
        addMovieHandler={addMovie}
        handleClose={handleClose}
      />
    </div>
  );
}
