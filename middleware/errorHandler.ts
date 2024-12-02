import { Middleware } from "@oak/oak/middleware";
import jwt from "npm:jsonwebtoken";
import { debug } from "../utils/debug.ts";
import { Context } from "@oak/oak/context";

export async function errorHandler(ctx: Context, next: () => Promise<unknown>) {
  try {
    await next(); // Pass to the next middleware
  } catch (err) {
    console.error("Error occurred:", err);
    ctx.response.status = err.status || 500; // Default to 500 if status is undefined
    ctx.response.body = {
      message: err.message || "Internal Server Error",
    };
  }
}
