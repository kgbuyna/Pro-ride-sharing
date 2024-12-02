import { Op } from "sequelize";
import { createMessage } from "./messageService.ts";
import Conversations from "../db/models/conversation.ts";
import { id } from "../types/base.ts";
import { debug } from "../utils/debug.ts";
import Users from "../db/models/user.ts";

export const createConversationByUser = async (
  senderId: id,
  receiverId: id,
  content: string,
) => {
  const isUserExist = await Users.findByPk(receiverId);

  if (!isUserExist) {
    throw new Error(`Хэрэглэгч олдсонгүй. ${receiverId}`);
  }

  const [conversation] = await Conversations.findOrCreate({
    where: {
      [Op.or]: [
        {
          [Op.and]: {
            user1Id: receiverId,
            user2Id: senderId,
          },
        },
        {
          [Op.and]: {
            user1Id: senderId,
            user2Id: receiverId,
          },
        },
      ],
    },
    defaults: {
      user1Id: receiverId,
      user2Id: senderId,
    },
  });

  const message = await createMessage(
    conversation.dataValues.id as id,
    senderId,
    content,
  );

  conversation.set({
    "lastMessageId": message.dataValues.id,
  });

  await conversation.save();

  return conversation;
};

export const getConversationsByUserId = async (userId: number) => {
  const conversations = await Conversations.findAll({
    where: {
      [Op.or]: [
        { user1Id: userId },
        { user2Id: userId },
      ],
    },
  }) || [];
  return conversations;
};

export const findConversationByUserId = async (
  conversationId: id,
  senderId: id,
) => {
  const conversation = await Conversations.findOne({
    where: {
      [Op.or]: {
        user1Id: senderId,
        user2Id: senderId,
      },
      id: conversationId,
    },
  });
  if (!conversation) {
    throw new Error("Conversation олдсонгүй.");
  }
  return conversation;
};

export const sendMessageToConversation = async (
  conversationId: id,
  userId: id,
  content: string,
) => {
  const conversation = await findConversationByUserId(conversationId, userId);

  const message = await createMessage(
    conversation.toJSON().id as id,
    userId,
    content,
  );

  conversation.set({
    lastMessageId: message.dataValues.id,
  });

  await conversation.save();

  return conversation;
};
