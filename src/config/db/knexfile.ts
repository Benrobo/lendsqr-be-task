import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", "..", "..", "./.env") });

const host = process.env.DB_HOST ?? "localhost";
const port = process.env.DB_PORT ?? "3306";
const user = process.env.DB_USER ?? "root";
const password = process.env.DB_PASSWORD ?? null;
const database = process.env.DB_NAME ?? "lendsqr";

const knexConfig = {
  development: {
    client: "mysql",
    connection: {
      connectionString: process.env.DATABASE_URL,
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
      connectionString: process.env.DATABASE_URL,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve() + "/migrations",
    },
    debug: true,
  },
};

export default knexConfig;
