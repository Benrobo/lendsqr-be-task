import knex from "knex";
import knexFile from "./knexfile";
import env from "dotenv";

// determine which config to use when in development or production environment
const dbEnv =
  process.env.NODE_ENV !== "production"
    ? knexFile.development
    : knexFile.production;

// configure knex with specified db
const db = knex(dbEnv);

export default db;
