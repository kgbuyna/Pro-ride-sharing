import * as v from "jsr:@valibot/valibot"; // 1.24 kB
import Users from "../db/models/user.ts";

const isUsernameAvailable = async (username: string) => {
  const data = await Users.findOne({ where: { username } });
  return !data;
};

const isUsernameNotAvailable = async (username: string) => {
  const data = await Users.findOne({ where: { username } });
  return !!data; // Returns true if the username exists
};

export const RegisterSchema = v.pipeAsync(
  v.objectAsync({
    username: v.pipeAsync(
      v.string(),
      v.minLength(2),
      v.checkAsync(isUsernameAvailable, "Username is already taken."),
    ),
    email: v.pipe(v.string(), v.email()),
    lastName: v.optional(v.string()),
    firstName: v.pipe(v.string(), v.trim()),
    password: v.pipe(
      v.string(),
      v.minLength(8),
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.minLength(8),
    ),
    profile: v.optional(v.pipe(v.string(), v.url())),
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

export const LoginSchema = v.objectAsync({
  username: v.pipeAsync(
    v.string(),
    v.minLength(2),
    v.checkAsync(
      isUsernameNotAvailable,
      "Username does not exist",
    ),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8),
  ),
});
