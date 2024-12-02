import { Router } from "@oak/oak/router";
import { validator } from "../middleware/validator.ts";
import SendMessageSchema from "../validators/sendMessageSchema.ts";
import {
  createConversationByUserController,
  getConversationsByUserController,
  getMessagesByConversationIdController,
  sendMessageToConversationController,
} from "../controllers/conversationController.ts";

const conversationRouter = new Router();

conversationRouter.get("/", getConversationsByUserController);

conversationRouter.post(
  "/:receiverId/message",
  validator(SendMessageSchema),
  createConversationByUserController,
);

conversationRouter.post(
  "/:conversationId/messages",
  validator(SendMessageSchema),
  sendMessageToConversationController,
);

conversationRouter.get(
  "/:conversationId/messages",
  getMessagesByConversationIdController,
);

export default conversationRouter;
