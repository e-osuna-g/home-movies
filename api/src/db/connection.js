import { DataTypes, Sequelize } from "sequelize";
import { DB } from "../envVars.js";

export const dbConnection = new Sequelize(DB.NAME, DB.USERNAME, DB.PASSWORD, {
  host: DB.HOST,
  port: DB.PORT,
  dialect: DB.DIALECT,
});
/*try {
  await dbConnection.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
*/
