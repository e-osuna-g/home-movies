import { DataTypes as types, Sequelize } from "sequelize";
import { DB } from "../envVars.js";
export const DataTypes = types;
DataTypes.TIME;
export const sequalize = new Sequelize(DB.NAME, DB.USERNAME, DB.PASSWORD, {
  host: DB.HOST,
  port: DB.PORT,
  dialect: DB.DIALECT,
  timezone: "+00:00", // Default is +00:00 (UTC)
  models: DB.MODELS ? [DB.MODELS] : undefined,
});
