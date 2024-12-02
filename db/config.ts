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
);

export default sequelize;
