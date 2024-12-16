import * as bcrypt from "jsr:@ts-rex/bcrypt";

import jwt from "npm:jsonwebtoken";
import Users from "../db/models/user.ts";

export const getUsers = async () => {
  return await Users.findAll({
    attributes: ["id", "email", "username"],
  });
};

export const createUser = async (userData) => {
  const { username, email, firstName, lastName, password, profile, phone } =
    userData;

  const hashedPassword = bcrypt.hash(password);
  const user = await Users.create({
    username,
    email,
    firstName,
    lastName,
    password: hashedPassword,
    profile,
    phone,
  });
  return user;
};

export const handleRegister = async (userData) => {
  const user = await createUser(userData);
  const { id, username } = user.dataValues;

  const token = jwt.sign(
    { id, username },
    Deno.env.get("SECRET"),
    {
      expiresIn: "3h",
    },
  );

  return { token, user };
};

export const handleLogin = async (providedPassword, username) => {
  const user = await Users.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new Error("Бүртгэлгүй хэрэглэгч байна");
  }

  const userData = user.dataValues;

  if (!bcrypt.verify(providedPassword, userData.password)) {
    throw new Error("Нууц үг бүруу");
  }

  const token = jwt.sign(
    { id: userData.id, username: userData.username },
    Deno.env.get("SECRET"),
    {
      expiresIn: "3h",
    },
  );

  return token;
};
