import Button from "@mui/material/Button";
import MiniMovieView from "../components/MiniMovieView";
import MovieDialogSearch from "../components/MovieDialogSearch";
import { useState } from "react";

const movies = [
  {
    "Poster":
      "https://upload.wikimedia.org/wikipedia/en/1/1d/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg",
    "Title": "Batman",
  },
  {
    "Poster":
      "https://upload.wikimedia.org/wikipedia/en/1/1d/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg",
    "Title": "Batman 2",
  },
  {
    "Poster":
      "https://upload.wikimedia.org/wikipedia/en/1/1d/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg",
    "Title": "Batman 3",
  },
];
export default function Compare() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <div style={{ height: "400px", width: "100%" }}>
        Graph area
      </div>
      <div>
        <Button onClick={() => setIsOpen(true)}>+ Add movie</Button>
      </div>
      <div style={{ display: "flex" }}>
        {movies.map((i) => <MiniMovieView {...i} />)}
      </div>
      <MovieDialogSearch open={isOpen} handleClose={handleClose} />
    </div>
  );
}
