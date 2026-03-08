import {
  movieComparison,
  movieComparisonItems,
} from "../../src/db/movieComparison.js";

export async function seed_comparisons() {
  let movieComparisonResult = await movieComparison.create({});
  movieComparisonResult.dataValues.id;
  let movies = ["tt0052602", "tt0076584", "tt0093058"];
  let itemsResult = await movieComparisonItems.bulkCreate(
    movies.map((id, index) => ({
      movie_comparison_id: movieComparisonResult.id,
      imdb_id: id,
      index: index,
    })),
  );
  return {
    movieComparison: movieComparisonResult,
    movieComparisonItems: itemsResult,
  };
}
