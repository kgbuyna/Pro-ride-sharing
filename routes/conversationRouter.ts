import { Router } from "@oak/oak/router";
import { validator } from "../middleware/validator.ts";
import SendMessageSchema from "../validators/sendMessageSchema.ts";
import {
  createConversationByUserController,
  getConversationsByUserController,
  sendMessageToConversationController,
} from "../controllers/conversationController.ts";
import { getMessagesByConversationId } from "../services/messageService.ts";

const conversationRouter = new Router();

conversationRouter.get("/", getConversationsByUserController);

conversationRouter.use(validator(SendMessageSchema)).post(
  "/:receiverId/message",
  createConversationByUserController,
);

conversationRouter.use(validator(SendMessageSchema)).post(
  "/:conversationId/messages",
  sendMessageToConversationController,
);

conversationRouter.get(
  "/:conversationId/messages",
  getMessagesByConversationId,
);

export default conversationRouter;
