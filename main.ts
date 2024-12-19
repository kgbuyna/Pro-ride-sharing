import "@std/dotenv/load";
import { Server } from "https://deno.land/x/socket_io/mod.ts";
import { Application, State } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import jwt from "npm:jsonwebtoken";
import { assertDbConnection } from "./db/index.ts";
import { authenticateToken } from "./middleware/authenticateToken.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import authRouter from "./routes/authRouter.ts";
import conversationRouter from "./routes/conversationRouter.ts";
import userRouter from "./routes/userRouter.ts";
import { sendMessageToConversation } from "./services/conversationService.ts";
import { ClientToServerEvents, ServerToClientEvents } from "./types/socket.ts";
import { Room } from "https://deno.land/x/socket_io@0.2.0/packages/socket.io/lib/adapter.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { AppContext, ContextState } from "./types/base.ts";
import { Context, ContextOptions } from "@oak/oak/context";
import { MiddlewareOrMiddlewareObject } from "https://jsr.io/@oak/oak/17.1.3/middleware.ts";

const router = new Router();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents
>();

interface CustomContext extends Context {
  customData?: string; // Add custom properties
}

class CustomApplication<AS extends State = Record<string, any>>
  extends Application<AS> {
  override use<S extends State = Record<string, any>>(
    middleware: MiddlewareOrMiddlewareObject<
      S,
      AppContext<S, Record<string, any>>
    >,
    ...middlewares: MiddlewareOrMiddlewareObject<
      S,
      AppContext<S, Record<string, any>>
    >[]
  ): CustomApplication<S extends AS ? S : S & AS>;

  override use<S extends State = AS>(
    ...middleware: [
      MiddlewareOrMiddlewareObject<S, AppContext<S, AS>>,
      ...MiddlewareOrMiddlewareObject<S, AppContext<S, AS>>[],
    ]
  ) {
    super.#middleware.push(...middleware);
    super.#composedMiddleware = undefined;
    // deno-lint-ignore no-explicit-any
    return this as Application<any>;
  }
}

const app = new CustomApplication();

assertDbConnection();

router.use("/auth", authRouter.routes(), authRouter.allowedMethods());
router.use("/users", userRouter.routes(), userRouter.allowedMethods());

router.use(authenticateToken).use(
  "/conversations",
  conversationRouter.routes(),
  conversationRouter.allowedMethods(),
);

const userSockets: Map<string, Room> = new Map();

io.on(
  "connection",
  async (socket) => {
    const token = socket.handshake.auth.token;
    console.log(`socket ${socket.id} connected`);
    const decodedToken = jwt.verify(token, Deno.env.get("SECRET"));

    if (!token || !decodedToken) {
      throw new Error("Authentication error");
    }

    const userId = decodedToken.id;

    userSockets.set(userId, socket.id);

    socket.on("message", async ({ content, conversationId, recipient }) => {
      if (conversationId) {
        // одоохондоо ингээд хийе.
        const message = await sendMessageToConversation(
          conversationId,
          userId,
          content,
        );
        const room = userSockets.get(userId);
        if (room) {
          socket.to(room).emit(
            "newMessage",
            { conversationId, "message": content },
          );
        } else {
          throw new Error("Room is not defined");
        }
      } else if (recipient) {
      } else {
        throw new Error("Recipient is not defined");
      }
    });

    // socket.emit("")

    socket.on("disconnect", (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
  },
);

app.use(oakCors({ origin: "*" })); // Enable CORS for All Routes
app.use(errorHandler);
app.use(router.routes());

await app.listen({ port: 9999 });
