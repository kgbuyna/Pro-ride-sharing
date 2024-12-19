import { Middleware } from "@oak/oak/middleware";
import { AppContext, ContextState } from "../types/base.ts";

export const errorHandler: Middleware<
  ContextState
> = async (
  ctx: AppContext<ContextState>,
  next,
) => {
  try {
    await next(); // Pass to the next middleware
  } catch (err: unknown) {
    if (err instanceof Error) {
      ctx.response.status = err.cause == "user" ? 400 : 500; // Default to 500 if status is undefined
      ctx.response.body = {
        status: "error",
        message: err.message || "Internal Server Error",
      };
    }
  }
};
