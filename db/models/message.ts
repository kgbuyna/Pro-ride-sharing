import { DataTypes } from "sequelize";
// import { sequelize } from "../index.ts";

import { Sequelize } from "sequelize";

export const defineMessageModel = (sequelize: Sequelize) =>
  sequelize.define(
    "Message",
    {
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Conversations", // Adjust to your Users table name
          key: "id",
        },
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Name of the Users table
          key: "id",
        },
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
    },
  );
