import Typography from "@mui/material/Typography";

export default function MiniMovieView({ Poster, Title }) {
  return (
    <div
      style={{
        position: "relative",
        boxSizing: "border-box",
        height: "200px",
        width: "200px",
        padding: "10px",
      }}
    >
      <img src={Poster} style={{ maxWidth: "150px" }} />
      <Typography>
        {Title}
      </Typography>
      <span
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "0px",
          right: "0px",
        }}
      >
        X
      </span>
    </div>
  );
}
