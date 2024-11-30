// @deno-types="npm:@types/express@4.17.15"
import "@std/dotenv/load";
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import authRouter from "./routes/auth.ts";
import { assertDbConnection } from "./db/index.ts";

const router = new Router();

const app = new Application();

assertDbConnection();

router.use("/auth", authRouter.routes(), authRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
