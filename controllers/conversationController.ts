import { Middleware } from "@oak/oak/middleware";
import {
  createConversationByUser,
  getConversationsByUserId,
  sendMessageToConversation,
} from "../services/conversationService.ts";
import { getMessagesByConversationId } from "../services/messageService.ts";
import { AppContext } from "../types/base.ts";

export const getConversationsByUserController: Middleware = async (
  ctx,
) => {
  const userId = ctx.state.userId;
  const conversations = await getConversationsByUserId(userId);
  ctx.response.body = {
    data: conversations,
  };
};

export const createConversationByUserController = async (
  ctx: AppContext,
) => {
  const { receiverId } = ctx.params;
  const { userId, content } = ctx.state;

  const conversation = await createConversationByUser(
    userId,
    receiverId,
    content,
  );

  ctx.response.body = {
    message: "Conversation is created.",
    data: {
      conversationId: conversation.dataValues.id,
    },
  };
};

export const sendMessageToConversationController: Middleware = async (
  ctx: AppContext,
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
  ctx: AppContext,
) => {
  const { userId } = ctx.state;
  const { conversationId } = ctx.params;

  const messages = await getMessagesByConversationId(conversationId, userId);

  ctx.response.body = {
    status: "success",
    data: {
      messages,
    },
  };
};
