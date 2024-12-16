import { Middleware } from "@oak/oak/middleware";
import {
  createUser,
  handleLogin,
  handleRegister,
} from "../services/userService.ts";
import { Status } from "jsr:@oak/commons@1/status";

export const Register: Middleware = async (ctx, next) => {
  const body = ctx.state;
  const { user, token } = await handleRegister(body);

  ctx.response.body = {
    status: "success",
    message: "Registed successfully",
    data: { id: user.dataValues.id, token },
  };
};

export const Login: Middleware = async (ctx, next) => {
  const body = ctx.state;
  const { password, username } = body;
  const token = await handleLogin(password, username);
  ctx.response.body = {
    status: "success",
    message: "Login succeed",
    data: {
      token: token,
    },
  };
};
