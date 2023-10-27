import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", "..", "..", "./.env") });

const host =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_HOST
    : process.env.DB_HOST;
const port =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_PORT
    : process.env.DB_PORT || "3306";
const user =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_USER
    : process.env.DB_USER || "root";
const password =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_PASSWORD
    : process.env.DB_PASSWORD || null;
const database =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DB_NAME
    : process.env.DB_NAME || "lendsqr";

const knexConfig = {
  development: {
    client: "mysql",
    connection: {
      host,
      port,
      user,
      password,
      database,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve() + "/migrations",
    },
    debug: true,
  },
  production: {
    client: "mysql",
    connection: {
      host,
      port,
      user,
      password,
      database,
      ssl: { rejectUnauthorized: true },
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve() + "/migrations",
    },
    debug: true,
  },
};

export default knexConfig;
