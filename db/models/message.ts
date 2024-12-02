import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config.ts";
import { id } from "../../types/base.ts";
// Define MessageAttributes
interface MessageAttributes {
  id: id; // Primary key
  conversationId: id; // Foreign key for the conversation
  senderId: id; // Foreign key for the sender
  content: string; // Message content
}

// Define optional attributes for creation
type MessageCreationAttributes = Optional<MessageAttributes, "id">;

// Define the Message model
export default class Messages
  extends Model<MessageAttributes, MessageCreationAttributes> {}

Messages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Conversations", // Name of the Conversations table
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
    sequelize,
    modelName: "Messages", // Explicit table name (optional)
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);
