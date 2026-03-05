import { BarChart } from "@mui/x-charts/BarChart";

const chartSetting = {
  yAxis: [
    {
      label: "IMDB Ratings",
      width: 60,
    },
  ],
  height: 400,
};
export default function Graph(props) {
  if (props && props.data == null) {
    return <div>No data for chart</div>;
  }
  if (props && props.data) {
    const ratingsDataset = [];
    const ratingsSeries = [];
    const ratingObjectSet = {};
    for (let i = 0; i < props.data.movies.length; i++) {
      const dist = props.data.comparison.ratings.distribution[i];
      const movie = props.data.movies.find((movie) =>
        dist.imdbId == movie.imdbID
      );
      ratingsSeries.push({
        dataKey: movie.imdbID,
        label: movie.Title,
        barLabel: "value",
        barLabelPlacement: "outside",
        valueFormatter: (e) => {
          return e;
        },
      });

      //ratings
      const ratings = props.data.comparison.ratings.distribution[i];
      const ratingMovie = props.data.movies.find((movie) =>
        ratings.imdbId == movie.imdbID
      );
      ratingObjectSet[ratingMovie.imdbID] = Number(ratings.rating);

      //ratings end
    }
    ratingObjectSet.group = "Ratings";
    ratingsDataset.push(ratingObjectSet);

    return (
      <>
        <BarChart
          dataset={ratingsDataset}
          xAxis={[{ dataKey: "group" }]}
          series={ratingsSeries}
          height={300}
          {...chartSetting}
        />
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}
