import { Router } from "jsr:@oak/oak/router";
import { LoginSchema, RegisterSchema } from "../validators/userSchema.ts";
import { validator } from "../middleware/validator.ts";
import { Login, Register } from "../controllers/authController.ts";

const authRouter = new Router();

authRouter.post(
  "/register",
  validator(RegisterSchema),
  Register,
);

authRouter.post("/login", validator(LoginSchema), Login);

export default authRouter;
