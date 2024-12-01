import { Router } from "jsr:@oak/oak/router";
import { sequelize } from "../db/index.ts";
import { LoginSchema, RegisterSchema } from "../validators/userSchema.ts";
import * as bcrypt from "jsr:@ts-rex/bcrypt";
import jwt from "npm:jsonwebtoken";
import { validator } from "../middleware/validator.ts";

const authRouter = new Router();

// type LoginData = v.InstanceIssue;

authRouter.post(
  "/register",
  validator(RegisterSchema),
  async (ctx, next) => {
    const body = ctx.state;
    const { User } = sequelize.models;
    const { username, email, firstName, lastName, password, profile } = body;
    try {
      const hashedPassword = bcrypt.hash(password);
      const user = await User.create({
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        profile,
      });

      ctx.response.body = {
        message: "Registed successfully",
        body: { id: user.dataValues.id },
      };
    } catch (_error) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Хэрэглэгч бүртгэхэд алдаа гарлаа",
      };
    }
  },
);

authRouter.post("/login", validator(LoginSchema), async (ctx) => {
  const body = ctx.state;
  const { password: providedPassword, username: providedUsername } = body;
  const { User } = sequelize.models;

  const user = await User.findOne({
    where: {
      username: providedUsername,
    },
  });

  if (!bcrypt.verify(providedPassword, user.password)) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: "Нууц үг буруу байна.",
    };
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    Deno.env.get("SECRET"),
    {
      expiresIn: "3h",
    },
  );

  ctx.response.body = {
    message: "Login succeed",
    data: { token },
  };
  return;
});

export default authRouter;
