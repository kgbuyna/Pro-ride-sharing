import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config.ts";
import { id } from "../../types/base.ts";

interface UserAttributes {
  id: id;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  profile: string;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

export default class Users extends Model<
  UserAttributes,
  UserCreationAttributes
> {}

Users
  .init(
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      modelName: "Users",
    },
  );
