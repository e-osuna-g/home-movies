import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useGetMovie } from "../Query/useGetMovie";

export default function MovieDialog({ open, movieId, handleClose }) {
  const { data: movie, isPending, _error } = useGetMovie(movieId);
  let content = <div>InProgress</div>;
  if (!isPending && movie) {
    content = (
      <div style={{ display: "flex" }}>
        <div>
          <img src={movie?.Poster} />
          <Button href={`/compare?movies=${movieId}`} variant="contained">
            Compare
          </Button>
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
    );
  }
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{movie?.Title}</DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
}
