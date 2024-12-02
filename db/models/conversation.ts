import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config.ts";
import { id } from "../../types/base.ts";

// Define ConversationAttributes
interface ConversationAttributes {
  id: id; // Primary key
  user1Id: id; // Foreign key for the first user
  user2Id: id; // Foreign key for the second user
  lastMessageId?: id | null; // Optional, foreign key for the last message
}

// Define optional attributes for creation
type ConversationCreationAttributes = Optional<
  ConversationAttributes,
  "id" | "lastMessageId"
>;
export default class Conversations extends Model<
  ConversationAttributes,
  ConversationCreationAttributes
> {}
// Define the Conversation model
Conversations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Adjust this if your Users table has a different name
        key: "id",
      },
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Adjust this if your Users table has a different name
        key: "id",
      },
    },
    lastMessageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Messages", // Adjust this if your Messages table has a different name
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Conversations", // Explicit table name (optional)
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);
