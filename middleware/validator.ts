import { RouterContext } from "@oak/oak/router";
import { Middleware, MiddlewareOrMiddlewareObject } from "@oak/oak/middleware";
import { debug } from "../utils/debug.ts";
import * as v from "jsr:@valibot/valibot"; // 1.24 kB
import { Status } from "jsr:@oak/commons@1/status";

type validatorType = (
  schema: v.SchemaWithPipeAsync<any> | v.SchemaWithPipe<any>,
) => (ctx: RouterContext, next: any) => Promise<MiddlewareOrMiddlewareObject>;

export const validator: validatorType =
  (schema) => async (ctx: RouterContext, next: any) => {
    const body = await ctx.request.body.json();
    if (schema.async) {
      const data = await v.safeParseAsync(schema, body).catch((err) => {
        console.log(err);
      });

      if (data.success) {
        debug(data.output);
        ctx.state = {
          ...ctx.state,
          ...data.output,
        };
        await next();
      } else {
        ctx.response.status = 200;
        ctx.response.body = {
          status: "error",
          // message: "Хэрэглэгчийн мэдээлэл буруу байна",
          messages: data.issues.map((issue) => issue.message),
        };
        return;
      }
    } else {
      const data = v.safeParse(schema, body);
      if (data.success) {
        ctx.state = data.output;
        next();
      } else {
        ctx.response.status = 200;
        ctx.response.body = {
          status: "error",
          // message: "Хэрэглэгчийн мэдээлэл буруу байна",
          messages: data.issues.map((issue) => issue.message),
        };
        return;
      }
    }
  };
