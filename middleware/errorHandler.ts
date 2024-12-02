import { Middleware } from "@oak/oak/middleware";
import jwt from "npm:jsonwebtoken";
import { debug } from "../utils/debug.ts";
import { Context } from "@oak/oak/context";
import { AppContext } from "../types/base.ts";

export async function errorHandler(
  ctx: AppContext,
  next: () => Promise<unknown>,
) {
  try {
    await next(); // Pass to the next middleware
  } catch (err) {
    console.error("Error occurred:", err);

    ctx.response.status = err.status || 500; // Default to 500 if status is undefined
    ctx.response.body = {
      status: "error",
      message: err.message || "Internal Server Error",
    };
  }
}
