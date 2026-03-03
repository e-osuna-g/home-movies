import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class movie_comparison extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    }, {
      sequelize,
      tableName: "movie_comparison",
      timestamps: true,
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
      ],
    });
  }
}
