import { Sequelize } from "sequelize";
import { config } from "../config/env";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  username: config.dbUser,
  password: config.dbPassword,
  logging: false,
});