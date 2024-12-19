import { Next } from "@oak/oak/middleware";
import * as v from "jsr:@valibot/valibot"; // 1.24 kB
import { AppContext, ContextState } from "../types/base.ts";

type validatorType = (
  schema: v.AnySchema,
) => (
  ctx: AppContext<ContextState>,
  next: Next,
) => Promise<void>;

export const validator: validatorType =
  (schema) => async (ctx: AppContext<ContextState>, next) => {
    const body = await ctx.request.body.json();

    const data = schema.async
      ? await v.safeParseAsync(schema, body)
      : v.safeParse(schema, body);

    if (data.success) {
      ctx.state = {
        ...ctx.state,
        ...data.output,
      };
      await next();
    } else {
      ctx.response.status = 200;
      ctx.response.body = {
        status: "error",
        messages: (data.issues as v.ValiError<v.AnySchema>[]).map((issue) =>
          issue.message
        ),
      };
    }
  };
