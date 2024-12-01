import { DataTypes } from "sequelize";
// import { sequelize } from "../index.ts";

import { Sequelize } from "sequelize";

export const defineConversationModel = (sequelize: Sequelize) =>
  sequelize.define(
    "Conversation",
    {
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Adjust to your Users table name
          key: "id",
        },
      },
      // Foreign key: User being part of the conversation
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Adjust to your Users table name
          key: "id",
        },
      },
      lastMessageId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Messages",
          key: "id",
        },
      },
    },
    {
      // Other model options go here
    },
  );
