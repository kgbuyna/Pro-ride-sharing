import { Middleware } from "@oak/oak/middleware";
import { getUsers } from "../services/userService.ts";

export const getAllUsers: Middleware = async (ctx) => {
  const users = await getUsers();
  ctx.response.body = { message: "ok", data: { users } };
};
