import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class movie_info extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    imdb_id: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    last_updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'movie_info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "imdb_id" },
        ]
      },
    ]
  });
  }
}
