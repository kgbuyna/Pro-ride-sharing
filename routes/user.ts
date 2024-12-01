import { Router } from "@oak/oak/router";
import { sequelize } from "../db/index.ts";
import { authenticateToken } from "../middleware/authenticateToken.ts";

const userRouter = new Router();

userRouter.use(authenticateToken).get("/", async (ctx, next) => {
  const { User } = sequelize.models;

  const users = await User.findAll({
    attributes: ["id", "email", "username"], // specify the fields you want to select
  });
  console.log("huyee", users.length);
  if (users) {
    ctx.response.body = {
      message: "ok",
      data: {
        users: users,
      },
    };
  }
  //   return;
  next();
});

export default userRouter;
