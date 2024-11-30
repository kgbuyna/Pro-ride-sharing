import { DataTypes } from "sequelize";
// import { sequelize } from "../index.ts";

import { Sequelize } from "sequelize";

export const defineUserModel = (sequelize: Sequelize) =>
  sequelize.define(
    "User",
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      // Model attributes are defined here
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      password: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
        // allowNull defaults to true
      },
      email: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      phone: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
    },
    {
      // Other model options go here
    },
  );
