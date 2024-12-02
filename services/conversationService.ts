import { Op } from "sequelize";
import { createMessage } from "./messageService.ts";
import Conversations from "../db/models/conversation.ts";

export const createConversationByUser = async (
  senderId,
  receiverId,
  content,
) => {
  const [conversation] = await Conversations.findOrCreate({
    where: {
      [Op.or]: {
        [Op.and]: {
          user1Id: receiverId,
          user2Id: senderId,
        },
        [Op.and]: {
          user1Id: senderId,
          user2Id: receiverId,
        },
      },
    },
    defaults: {
      user1Id: receiverId,
      user2Id: senderId,
    },
  });

  const message = await createMessage(conversation.id, senderId, content);

  conversation.set({
    "lastMessageId": message.id,
  });

  await conversation.save();

  return conversation;
};

export const getConversationsByUserId = async (userId: number) => {
  const conversations = Conversations.findAll({
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
  conversationId: number,
  senderId: number,
) => {
  const conversation = await Conversations.findOne({
    where: {
      [Op.or]: {
        sender_1: senderId,
        sender_2: senderId,
      },
      id: conversationId,
    },
  });
  return conversation;
};

export const sendMessageToConversation = async (
  conversationId,
  userId,
  content,
) => {
  const conversation = await findConversationByUserId(conversationId, userId);
  if (!conversation) {
    return null;
  }

  const message = await createMessage(conversation.id, userId, content);

  conversation.set({
    "lastMessageId": message.id,
  });

  await conversation.save();

  return conversation;
};
