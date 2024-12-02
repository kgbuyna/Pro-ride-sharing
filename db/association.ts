import Conversations from "./models/conversation.ts";
import Messages from "./models/message.ts";
import Users from "./models/user.ts";

export const setupAssociations = () => {
  Users.hasMany(Conversations, {
    foreignKey: "user1Id",
    as: "User1Conversations",
  });
  Users.hasMany(Conversations, {
    foreignKey: "user2Id",
    as: "User2Conversations",
  });

  Conversations.belongsTo(Users, { foreignKey: "user1Id", as: "User1" });
  Conversations.belongsTo(Users, { foreignKey: "user2Id", as: "User2" });

  Messages.belongsTo(Conversations, { foreignKey: "conversationId" });
  Messages.belongsTo(Users, { foreignKey: "senderId" });

  Conversations.hasMany(Messages, { foreignKey: "conversationId" });
  Users.hasMany(Messages, { foreignKey: "senderId" });
};
