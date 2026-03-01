const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movie_comparison_items', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    movie_comparison_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'movie_comparison',
        key: 'id'
      }
    },
    imdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'movie_comparison_items',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "movie_comparison_id",
        using: "BTREE",
        fields: [
          { name: "movie_comparison_id" },
        ]
      },
    ]
  });
};
