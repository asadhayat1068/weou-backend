import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_TYPE = "postgres";
const DATABASE_HOST: string = process.env.DATABASE_HOST || "";
const DATABASE_PORT: number = parseInt(process.env.DATABASE_PORT || "5432");
const DATABASE_USER: string = process.env.DATABASE_USER || "";
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || "";
const DATABASE_NAME: string = process.env.DATABASE_NAME || "";

export const AppDataSource = new DataSource({
  type: DATABASE_TYPE,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
});
