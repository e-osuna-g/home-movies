import { DataTypes, sequalize } from "./connection.js";
import movie_comparison from "./models/movie_comparison.js";
import movie_comparison_items from "./models/movie_comparison_items.js";
import movie_info from "./models/movie_info.js";

export const movieComparison = movie_comparison.init(sequalize, DataTypes);
export const movieComparisonItems = movie_comparison_items.init(
  sequalize,
  DataTypes,
);
export const movieInfo = movie_info.init(sequalize, DataTypes);
movieComparison.hasMany(movieComparisonItems, {
  foreignKey: { name: "movie_comparison_id" },
});
movieComparisonItems.belongsTo(movieComparison);
