import { Router } from "jsr:@oak/oak/router";
import { sequelize } from "../db/index.ts";
import { debug } from "../utils/debug.ts";
import * as v from "jsr:@valibot/valibot"; // 1.24 kB
import { ValidationError } from "jsr:@valibot/valibot";
import { LoginSchema } from "../validators/userSchema.ts";

const authRouter = new Router();

authRouter.use(async (ctx, next) => {
  const body = await ctx.request.body.json();
  try {
    const data = await v.parseAsync(LoginSchema, body);
    debug(JSON.stringify(data));
    ctx.state = data;
    next();
  } catch (error) {
    debug(JSON.stringify(error));
    if (error instanceof ValidationError) {
      ctx.response.body = error.issues.map((issue) => issue.message);
    } else {
      ctx.response.body = { message: "Unknown error" };
    }
    return;
  }
}).post("/register", async (ctx) => {
  debug("Register");
  debug(JSON.stringify(ctx));
  const body = await ctx.request.body.json();
  ctx.response.body = "Register";
});

export default authRouter;
