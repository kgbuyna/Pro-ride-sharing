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
  const conversations = getConversationsByUserId(userId);
  ctx.response.body = {
    data: conversations,
  };
};

export const createConversationByUserController: Middleware = async (
  ctx,
  next,
) => {
  try {
    const { receiverId } = ctx.params;
    const { userId, content } = ctx.state;

    const conversation = await createConversationByUser(
      userId,
      receiverId,
      content,
    );
    ctx.response.body = {
      data: {
        conversationId: conversation.id,
      },
    };
  } catch (err) {
    debug(err);
    debug("Conversation үүсгэхэд алдаа гарлаа.");
    ctx.response.body = {
      message: "Conversation үүсгэхэд алдаа гарлаа.",
    };
  }
};

export const sendMessageToConversationController: Middleware = async (
  ctx,
  next,
) => {
  const body = ctx.request.body;
  const { conversationId } = ctx.params;

  const { userId } = ctx.state;
  const { content } = body;
  const conversation = await sendMessageToConversation(
    conversationId,
    userId,
    content,
  );
  if (!conversation) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Conversation not found",
    };
    return;
  }

  ctx.response.body = {
    message: "Message sent successfully",
  };
};

export const getMessagesByConversationIdController: Middleware = async (
  ctx,
) => {
  const { userId } = ctx.state;
  const conversationId = ctx.params;

  const messages = await getMessagesByConversationId(conversationId, userId);
  if (!messages) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Conversation not found",
    };
    return;
  }

  ctx.response.body = {
    data: messages,
  };
};
