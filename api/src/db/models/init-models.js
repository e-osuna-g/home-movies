var DataTypes = require("sequelize").DataTypes;
var _movie_comparison = require("./movie_comparison");
var _movie_comparison_items = require("./movie_comparison_items");

function initModels(sequelize) {
  var movie_comparison = _movie_comparison(sequelize, DataTypes);
  var movie_comparison_items = _movie_comparison_items(sequelize, DataTypes);

  movie_comparison_items.belongsTo(movie_comparison, { as: "movie_comparison", foreignKey: "movie_comparison_id"});
  movie_comparison.hasMany(movie_comparison_items, { as: "movie_comparison_items", foreignKey: "movie_comparison_id"});

  return {
    movie_comparison,
    movie_comparison_items,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
