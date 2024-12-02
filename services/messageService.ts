import Messages from "../db/models/message.ts";
import { id } from "../types/base.ts";
import { findConversationByUserId } from "./conversationService.ts";

export const createMessage = async (
  conversationId: id,
  senderId: id,
  content: string,
) => {
  const message = await Messages.create({
    conversationId: conversationId,
    senderId: senderId,
    content: content,
  });
  return message;
};

export const getMessagesByConversationId = async (
  conversationId: id,
  userId: id,
) => {
  const conversation = await findConversationByUserId(conversationId, userId);
  if (!conversation) {
    throw new Error("Conversation олдсонгүй.");
  }

  const messages = await Messages.findAll({
    where: {
      conversationId: conversation.dataValues.id,
    },
  }) || [];

  return messages;
};
