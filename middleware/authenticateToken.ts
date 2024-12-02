import { Middleware } from "@oak/oak/middleware";
import jwt from "npm:jsonwebtoken";
// import { debug } from "../utils/debug.ts";

export const authenticateToken: Middleware = async (ctx, next) => {
  const headers = ctx.request.headers;

  const Authorization = (headers.get("authorization") || "").split("Bearer ");

  if (Authorization.length != 2) {
    throw new Error("Header not provided");
  }
  const token = Authorization[1];
  const decodedToken = jwt.verify(token, Deno.env.get("SECRET"));

  ctx.state = {
    userId: decodedToken.id,
    username: decodedToken.username,
  };

  await next();
};
