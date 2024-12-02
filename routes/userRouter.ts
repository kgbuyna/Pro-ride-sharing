import { Router } from "@oak/oak/router";
import { authenticateToken } from "../middleware/authenticateToken.ts";
import { getAllUsers } from "../controllers/userController.ts";

const userRouter = new Router();

userRouter.use(authenticateToken).get("/", getAllUsers);

export default userRouter;
