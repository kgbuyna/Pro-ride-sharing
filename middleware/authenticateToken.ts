import { Middleware } from "@oak/oak/middleware";
import jwt from "npm:jsonwebtoken";
import { debug } from "../utils/debug.ts";

export const authenticateToken: Middleware = async (ctx, next) => {
  const headers = ctx.request.headers;

  const Authorization = (headers.get("authorization") || "").split("Bearer ");

  if (Authorization.length != 2) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: "Header not provided",
    };
    return;
  }
  const token = Authorization[1];
  try {
    const decodedToken = jwt.verify(token, Deno.env.get("SECRET"));
    ctx.state = {
      userId: decodedToken.id,
      username: decodedToken.username,
    };
    debug("here is the value");
    await next();
    debug("next level");
  } catch (err) {
    debug(err);
    ctx.response.status = 400;
    ctx.response.body = {
      message: "Token Invalid or Expired",
    };
  }
};
