import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class movie_comparison_items extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      movie_comparison_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "movie_comparison_id",
        references: {
          model: "movie_comparison",
          key: "id",
        },
      },
      imdb_id: {
        type: DataTypes.STRING(10),
        field: "imdb_id",
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: "movie_comparison_items",
      timestamps: false,
      underscored: true,
      paranoid: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ],
        },
        {
          name: "movie_comparison_id",
          using: "BTREE",
          fields: [
            { name: "movie_comparison_id" },
          ],
        },
      ],
    });
  }
}
