import { Middleware } from "@oak/oak/middleware";
import { createUser, handleLogin } from "../services/userService.ts";

export const Register: Middleware = async (ctx, next) => {
  const body = ctx.state;
  const user = await createUser(body);

  ctx.response.body = {
    message: "Registed successfully",
    body: { id: user.dataValues.id },
  };
};

export const Login: Middleware = async (ctx, next) => {
  const body = ctx.state;
  const { password, username } = body;
  const token = await handleLogin(password, username);
  ctx.response.body = {
    message: "Login succeed",
    data: {
      token: token,
    },
  };
};
