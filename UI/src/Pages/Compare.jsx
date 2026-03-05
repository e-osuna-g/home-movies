import Button from "@mui/material/Button";
import MiniMovieView from "../components/MiniMovieView";
import MovieDialogSearch from "../components/MovieDialogSearch";
import { useState } from "react";
import useCompareMovies from "../Query/useCompareMovies.js";
import { useEffect } from "react";
import Graph from "../components/Graph.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

export default function Compare() {
  const queryValues = new URLSearchParams(window.location.search);
  const queryMovies = queryValues.getAll("movies");
  const comparedAt = queryValues.get("compared_at");

  const [isOpen, setIsOpen] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [comparedData, setComparedData] = useState(null);
  const [movies, setMovies] = useState(queryMovies);
  const mutation = useCompareMovies(movies, comparedAt);
  const onCompareError = (error) => {
    if (error && error.error.indexOf("Duplicate") >= 0) {
      setIsSnackOpen(true);
      setErrorMessage(
        "Movie is already in compared, cannot add same movie twice",
      );
    }
  };
  useEffect(() => {
    //initial mutation to refresh everything
    mutation.mutate([...movies], {
      onSuccess: (response) => {
        setComparedData(response);
      },
    });
  }, []);
  const handleOpen = () => {
    if (movies.length < 5) {
      setIsOpen(true);
    } else {
      //nottif
      setIsSnackOpen(true);
      setErrorMessage("Cannot add more than 5 movies");
    }
  };
  const handleSnackClose = () => {
    setIsSnackOpen(false);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const addMovie = (movieId) => {
    mutation.mutate([...movies, movieId], {
      onSuccess: (response) => {
        setComparedData(response);
      },
      onError: onCompareError,
      onSettled: () => {
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
      onSettled: () => {
        setMovies(() => {
          return newState;
        });
      },
    });
  };
  return (
    <div>
      <h1 style={{ marginTop: "0px" }}>Compare movies</h1>
      <div style={{ width: "100%" }}>
        <Graph data={comparedData} />
      </div>
      <div>
        <Button onClick={handleOpen}>+ Add movie</Button>
      </div>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
        }}
      >
        {movies.map((id) => (
          <MiniMovieView
            movieId={id}
            removeMovie={() => removeMovie(id)}
          />
        ))}
      </Paper>
      <Snackbar
        open={isSnackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {ErrorMessage}
        </Alert>
      </Snackbar>
      <MovieDialogSearch
        open={isOpen}
        addMovieHandler={addMovie}
        handleClose={handleClose}
      />
    </div>
  );
}
