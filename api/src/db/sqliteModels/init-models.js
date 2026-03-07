import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _movie_comparison from  "./movie_comparison.js";
import _movie_comparison_items from  "./movie_comparison_items.js";
import _movie_info from  "./movie_info.js";

export default function initModels(sequelize) {
  const movie_comparison = _movie_comparison.init(sequelize, DataTypes);
  const movie_comparison_items = _movie_comparison_items.init(sequelize, DataTypes);
  const movie_info = _movie_info.init(sequelize, DataTypes);

  movie_comparison_items.belongsTo(movie_comparison, { as: "movie_comparison", foreignKey: "movie_comparison_id"});
  movie_comparison.hasMany(movie_comparison_items, { as: "movie_comparison_items", foreignKey: "movie_comparison_id"});

  return {
    movie_comparison,
    movie_comparison_items,
    movie_info,
  };
}
