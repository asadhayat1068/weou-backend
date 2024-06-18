// import { DataSource } from "typeorm";
import dotenv from "dotenv";
import * as AWS from "aws-sdk";
dotenv.config();

// const DATABASE_TYPE = "postgres";
// const DATABASE_HOST: string = process.env.DATABASE_HOST || "";
// const DATABASE_PORT: number = parseInt(process.env.DATABASE_PORT || "5432");
// const DATABASE_USER: string = process.env.DATABASE_USER || "";
// const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || "";
// const DATABASE_NAME: string = process.env.DATABASE_NAME || "";

const DYNAMODB_REGION: string = process.env.DYNAMODB_REGION || "";
const DYNAMODB_ACCESS_KEY_ID: string = process.env.DYNAMODB_ACCESS_KEY_ID || "";
const DYNAMODB_SECRET_ACCESS_KEY: string =
  process.env.DYNAMODB_SECRET_ACCESS_KEY || "";

// export const AppDataSource = new DataSource({
//   type: DATABASE_TYPE,
//   host: DATABASE_HOST,
//   port: DATABASE_PORT,
//   username: DATABASE_USER,
//   password: DATABASE_PASSWORD,
//   database: DATABASE_NAME,
//   entities: [__dirname + "/../**/*.entity.{js,ts}"],
//   synchronize: true,
//   logging: true,
// });

AWS.config.update({
  accessKeyId: DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY,
  region: DYNAMODB_REGION,
});
export const dynamoDB = new AWS.DynamoDB.DocumentClient();
