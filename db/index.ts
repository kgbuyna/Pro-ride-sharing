import "pg";
import "pg-hstore";
import { Sequelize } from "sequelize";
import { defineUserModel } from "./models/user.ts";
import { defineConversationModel } from "./models/conversation.ts";
import { defineMessageModel } from "./models/message.ts";

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
    const User = defineUserModel(sequelize);
    const Conversation = defineConversationModel(sequelize);
    const Message = defineMessageModel(sequelize);

    Message.sync({
      alter: false,
    });

    User.sync({ alter: false });

    Conversation.sync({
      alter: false,
    });

    Conversation.belongsTo(User);
    Message.belongsTo(Conversation);
    Message.belongsTo(User);

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
