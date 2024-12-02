import "pg";
import "pg-hstore";
import { setupAssociations } from "./association.ts";
import sequelize from "./config.ts";

export const assertDbConnection = async () => {
  try {
    await sequelize.authenticate();
    setupAssociations();
    sequelize.sync({ alter: true });

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
