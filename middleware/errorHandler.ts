import { Middleware } from "@oak/oak/middleware";
import { AppContext, ContextState, id } from "../types/base.ts";

export const errorHandler: Middleware<
  ContextState,
  AppContext<ContextState, Record<string, any>>
> // AppState
 = async (
  ctx: AppContext<ContextState, Record<string, any>>,
  next,
) => {
  try {
    ctx.response.body = {
      status: "success",
      message: "Hello, World!",
    };
    ctx.state.userId = 1 as id;
    // ctx.response.status = ""
    // console.log(ctx.state.);
    await next(); // Pass to the next middleware
  } catch (err) {
    console.error("Error occurred:", err);

    ctx.response.status = err.status || 500; // Default to 500 if status is undefined
    ctx.response.body = {
      status: "error",
      message: err.message || "Internal Server Error",
    };
  }
};
