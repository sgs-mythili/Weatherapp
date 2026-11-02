require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

const common = {
  dialect: "postgres",
  logging: false,
};

function getConfig() {
  if (databaseUrl) {
    return {
      ...common,
      use_env_variable: "DATABASE_URL",
      dialect: "postgres",
    };
  }

  return {
    ...common,
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
}

module.exports = {
  development: getConfig(),
  test: getConfig(),
  production: getConfig(),
};