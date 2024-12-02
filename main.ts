import "@std/dotenv/load";
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { assertDbConnection } from "./db/index.ts";
import { authenticateToken } from "./middleware/authenticateToken.ts";
import authRouter from "./routes/authRouter.ts";
import conversationRouter from "./routes/conversationRouter.ts";
import userRouter from "./routes/userRouter.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const router = new Router();

const app = new Application();

assertDbConnection();

router.use("/auth", authRouter.routes(), authRouter.allowedMethods());
router.use(
  "/users",
  userRouter.routes(),
  userRouter.allowedMethods(),
);

router.use(authenticateToken).use(
  "/conversations",
  conversationRouter.routes(),
  conversationRouter.allowedMethods(),
);

app.use(errorHandler);
app.use(router.routes());

await app.listen({ port: 3000 });
