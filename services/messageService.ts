import Messages from "../db/models/message.ts";
import { findConversationByUserId } from "./conversationService.ts";

export const createMessage = async (conversationId, senderId, content) => {
  const message = await Messages.create({
    conversationId: conversationId,
    senderId: senderId,
    content: content,
  });
  return message;
};

export const getMessagesByConversationId = async (conversationId, userId) => {
  const conversation = await findConversationByUserId(conversationId, userId);
  if (!conversation) {
    return null;
  }

  const messages = Messages.findAll({
    where: {
      conversationId: conversation.id,
    },
  });
  return messages;
};
