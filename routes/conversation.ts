import { Router } from "@oak/oak/router";
import { sequelize } from "../db/index.ts";
import { Op } from "sequelize";
import { validator } from "../middleware/validator.ts";
import SendMessageSchema from "../validators/sendMessageSchema.ts";

export const conversationRouter = new Router();

conversationRouter.get("/", async (ctx, next) => {
  const userId = ctx.state.userId;
  // sequelize.models["Conversation"]
  const { Conversation } = sequelize.models;
  //   !TODO pagination a
  Conversation.findAll({
    where: {
      [Op.or]: [
        { sender_1: userId },
        { sender_2: userId },
      ],
    },
    //   offset: 10,
    //   limit: 2,
  });
  await next();
});

conversationRouter.use(validator(SendMessageSchema)).post(
  "/:receiverId/message",
  async (ctx, next) => {
    const { receiverId } = ctx.params;
    const { userId: senderId, content } = ctx.state;

    const { Conversation, Message } = sequelize.models;

    const [conversation] = Conversation.findOrCreate({
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
    });

    const message = await Message.create({
      conversationId: conversation.id,
      senderId: senderId,
      content: content,
    });

    conversation.set({
      "lastMessageId": message.id,
    });

    await conversation.save();

    ctx.response.body = {
      data: {
        conversationId: conversation.id,
      },
    };
  },
);

const findConversationByUserId = async (
  conversationId: number,
  senderId: number,
) => {
  const { Conversation } = sequelize.models;
  const conversation = await Conversation.findOne({
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

conversationRouter.use(validator(SendMessageSchema)).post(
  "/:conversationId/messages",
  async (ctx, next) => {
    const body = ctx.request.body;
    const { userId } = ctx.state;
    const { content } = body;

    const { Conversation, Message } = sequelize.models;

    const conversation = await findConversationByUserId(1, userId);

    if (!conversation) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: "Conversation not found",
      };
      return;
    }

    const message = await Message.create({
      conversationId: conversation.id,
      senderId: userId,
      content: content,
    });

    conversation.set({
      "lastMessageId": message.id,
    });

    await conversation.save();

    ctx.response.body = {
      message: "Message sent successfully",
    };
    return;
  },
);

conversationRouter.get("/:conversationId/messages", async (ctx, next) => {
  const { userId } = ctx.state;
  const conversation = await findConversationByUserId(1, userId);

  const { Message } = sequelize.models;

  if (!conversation) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "Conversation not found",
    };
    return;
  }

  const messages = Message.findAll({
    where: {
      conversationId: conversation.id,
    },
  });
  ctx.response.body = {
    data: messages,
  };
});
