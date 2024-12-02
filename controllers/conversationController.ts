import { Middleware } from "@oak/oak/middleware";
import {
  createConversationByUser,
  getConversationsByUserId,
  sendMessageToConversation,
} from "../services/conversationService.ts";
import { debug } from "../utils/debug.ts";
import { getMessagesByConversationId } from "../services/messageService.ts";

export const getConversationsByUserController: Middleware = async (
  ctx,
  next,
) => {
  const userId = ctx.state.userId;
  const conversations = await getConversationsByUserId(userId);
  ctx.response.body = {
    data: conversations,
  };
};

export const createConversationByUserController: Middleware = async (
  ctx,
  next,
) => {
  const { receiverId } = ctx.params;
  const { userId, content } = ctx.state;

  const conversation = await createConversationByUser(
    userId,
    receiverId,
    content,
  );

  ctx.response.body = {
    data: {
      conversationId: conversation.dataValues.id,
    },
  };
};

export const sendMessageToConversationController: Middleware = async (
  ctx,
  next,
) => {
  const body = ctx.request.body;
  const { conversationId } = ctx.params;

  const { userId, content } = ctx.state;

  const conversation = await sendMessageToConversation(
    conversationId,
    userId,
    content,
  );

  ctx.response.body = {
    message: "Message sent successfully",
  };
};

export const getMessagesByConversationIdController: Middleware = async (
  ctx,
) => {
  const { userId } = ctx.state;
  const { conversationId } = ctx.params;

  const messages = await getMessagesByConversationId(conversationId, userId);

  ctx.response.body = {
    data: messages,
  };
};
