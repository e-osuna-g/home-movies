import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useGetMovie } from "../Query/useGetMovie";
import "./movieDialog.css";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MovieDialogContent from "./MovieDialogContent.jsx";

export default function MovieDialog({ open, movieId, handleClose }) {
  const { data: movie, isPending, _error } = useGetMovie(movieId);
  let content = <div>InProgress</div>;
  if (!isPending && movie) {
    content = <MovieDialogContent movie={movie} />;
  }
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle>{movie?.Title}</DialogTitle>
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
      <DialogContent dividers className="movie-dialog-content">
        {content}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isPending}
          href={`/compare?movies=${movieId}`}
          variant="contained"
        >
          Compare
        </Button>
      </DialogActions>
    </Dialog>
  );
}
