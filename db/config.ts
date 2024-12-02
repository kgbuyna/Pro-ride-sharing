import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "ride-sharing",
  "postgres",
  Deno.env.get("PG_PASSWORD"),
  {
    host: "localhost",
    dialect:
      "postgres", /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  },
  // rejectOnEmpty: true, // Throw an error if no user is found
);

export default sequelize;
