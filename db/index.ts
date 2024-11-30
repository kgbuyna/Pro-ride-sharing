import "pg";
import "pg-hstore";
import { Sequelize } from "sequelize";
import { defineUserModel } from "./models/user.ts";

export const sequelize = new Sequelize(
  "ride-sharing",
  "postgres",
  Deno.env.get("PG_PASSWORD"),
  {
    host: "localhost",
    dialect:
      "postgres", /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  },
);

export const assertDbConnection = async () => {
  try {
    // file дотор өөрчлөлт орохоор үүнийг уншуулдаг байвал ямар вэ?
    await sequelize.authenticate();
    defineUserModel(sequelize).sync({ alter: false });

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
