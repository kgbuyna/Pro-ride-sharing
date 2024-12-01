// @deno-types="npm:@types/express@4.17.15"
import "@std/dotenv/load";
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import authRouter from "./routes/auth.ts";
import { assertDbConnection } from "./db/index.ts";
import { authenticateToken } from "./middleware/authenticateToken.ts";
import { conversationRouter } from "./routes/conversation.ts";
import userRouter from "./routes/user.ts";

const router = new Router();

const app = new Application();

assertDbConnection();

router.use("/auth", authRouter.routes(), authRouter.allowedMethods());
router.use(
  "/users",
  userRouter.routes(),
  userRouter.allowedMethods(),
);
// .use(authenticateToken)
// router.use(authenticateToken).use(
//   "/conversations",
//   conversationRouter.routes(),
//   conversationRouter.allowedMethods(),
// );
// Хүсэлт бүр заавал authorization header- тэй байх албагүй тэгэхээр
// app.use();
app.use(router.routes());
// app.use(router.allowedMethods());

await app.listen({ port: 3000 });
