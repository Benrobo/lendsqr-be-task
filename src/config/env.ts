import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const LOCAL_DB_CONN = "mysql://root:@localhost:3306/lendsqr";

const ENV = {
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl:
    process.env.NODE_ENV === "development"
      ? LOCAL_DB_CONN
      : process.env.DATABASE_URL,
  clientUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `https://paycode.co`,
};

export default ENV;
