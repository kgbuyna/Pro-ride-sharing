import * as v from "jsr:@valibot/valibot"; // 1.24 kB
import { assertDbConnection, sequelize } from "../db/index.ts";
import { debug } from "../utils/debug.ts";
// Create login schema with email and password

const isUsernameAvailable = async (username: string) => {
  const { User } = sequelize.models;

  const data = await User.findOne({ where: { username } });
  console.log(!data);
  return !data;
};

export const LoginSchema = v.pipeAsync(
  v.objectAsync({
    username: v.pipeAsync(
      v.string(),
      v.minLength(2),
      v.checkAsync(isUsernameAvailable, "Username is already taken."),
    ),
    email: v.pipe(v.string(), v.email()),
    lastName: v.optional(v.string()),
    firstName: v.pipe(v.string(), v.trim()),
    password: v.pipe(v.string(), v.minLength(8)),
    confirmPassword: v.pipe(v.string(), v.minLength(8)),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "The two passwords do not match.",
    ),
    ["confirmPassword"],
  ),
);

type LoginData = v.InferOutput<typeof LoginSchema>; // { email: string; password: string }

// const loginData: LoginData = { email: "", password: "" }; // OK

try {
  await assertDbConnection();

  const data = await v.parseAsync(LoginSchema, {
    email: "buynaa.khuyag@gmail.com",
    password: "123456789",
    confirmPassword: "123456789",
    username: "buynaa",
    firstName: "Buynaa",
  });
  debug(data);
} catch (error) {
  //   if (error instanceof v.ValidationError) {
  //     console.error(error.issues);
  //   } else {
  //     console.error(error);
  //   }
  debug(error);
}
