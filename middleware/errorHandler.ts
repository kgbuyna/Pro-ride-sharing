import { AppContext } from "../types/base.ts";

export const errorHandler = async (
  ctx: AppContext,
  next,
) => {
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
};
