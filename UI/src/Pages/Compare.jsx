import Button from "@mui/material/Button";
import MiniMovieView from "../components/MiniMovieView";
import MovieDialogSearch from "../components/MovieDialogSearch";
import { useRef, useState } from "react";
import useCompareMovies from "../Query/useCompareMovies.js";
import { useEffect } from "react";
import Graph from "../components/Graph.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { useMutationState } from "@tanstack/react-query";
import HomeIcon from "@mui/icons-material/Home";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
const CompareNavStyled = styled("nav")({
  display: "flex",
  paddingLeft: "5px",
});
export default function Compare() {
  const queryValues = new URLSearchParams(window.location.search);
  const queryMovies = queryValues.getAll("movies");
  const hasRun = useRef(false);
  const id = queryValues.get("id");
  const [isOpen, setIsOpen] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState(queryMovies);
  const { mutate } = useCompareMovies(movies, id);
  const comparations = useMutationState({
    filters: { status: "success" },
    select: (mutation) => {
      // get the latest
      if (
        mutation.options.mutationKey[0] === "/api/compare"
      ) {
        return mutation.state.data;
      }
      return null;
    },
  });
  const lastCompared = comparations[comparations.length - 1];
  useEffect(() => {
    document.title = "Movie Comparison - Compare";
  }, []); // Empty dependency array means it runs once on mount
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
    if (!hasRun.current) {
      hasRun.current = true;
      mutate([...movies], {
        onSuccess: (response) => {
          updateMovies(movies, response.id);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate]);
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
  const updateMovies = (movies, movieId) => {
    const params = new URLSearchParams();
    for (let i of movies) params.append("movies", i);
    if (movieId) {
      params.append("id", movieId);
    } else if (id) {
      params.append("id", movieId); //if the id was provided but last movie was removed
    }
    history.replaceState(null, "", "/compare?" + params.toString());
  };
  const addMovie = (movieId) => {
    if (movies.length >= 5) {
      setIsSnackOpen(true);
      setErrorMessage("Cannot add more than 5 movies.");
    }
    const newState = [...movies, movieId];
    if (newState.length <= 1) {
      updateMovies(newState, id);
      setMovies(newState);
    } else if (newState.length > 1 && movies.length < 5) {
      mutate([...movies, movieId], {
        onError: onCompareError,
        onSuccess: (response) => {
          setMovies((state) => {
            console.log("what", response);
            const newState = [...state, movieId];
            updateMovies(newState, response.id);
            return newState;
          });
        },
      });
    }
  };

  const removeMovie = (movieId) => {
    const newState = movies.filter((id) => id !== movieId);
    if (movies.length == 1) {
      updateMovies(newState, id);
      setMovies(newState);
    }
    if (newState.length >= 2) {
      mutate(newState, {
        onSuccess: (response) => {
          setMovies(() => {
            if (response.id) {
              updateMovies(newState, response.id);
            }
            return newState;
          });
        },
      });
    }
  };
  return (
    <div>
      <CompareNavStyled>
        <Link href="/">
          <HomeIcon />
        </Link>
      </CompareNavStyled>
      <h1 style={{ marginTop: "0px" }}>Compare movies</h1>
      <div style={{ width: "100%" }}>
        <Graph data={lastCompared} />
      </div>
      <div>
        <Button onClick={handleOpen}>+ Add movie</Button>
      </div>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          gap: "10px",
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
