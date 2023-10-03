import ENV from "config/env";
import path from "path";

const knexConfig = {
  development: {
    client: "mysql2",
    connection: {
      connectionString: ENV.databaseUrl,
      // host: "localhost",
      // user: "user",
      // password: null,
      // database: "lendsqr",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve() + "/migrations",
    },
    debug: true,
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: "user",
      password: null,
      database: "lendsqr",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve() + "/migrations",
    },
    debug: true,
  },
};

export default knexConfig;
