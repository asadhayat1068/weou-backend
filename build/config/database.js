"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDB = void 0;
// import { DataSource } from "typeorm";
const dotenv_1 = __importDefault(require("dotenv"));
const AWS = __importStar(require("aws-sdk"));
dotenv_1.default.config();
// const DATABASE_TYPE = "postgres";
// const DATABASE_HOST: string = process.env.DATABASE_HOST || "";
// const DATABASE_PORT: number = parseInt(process.env.DATABASE_PORT || "5432");
// const DATABASE_USER: string = process.env.DATABASE_USER || "";
// const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || "";
// const DATABASE_NAME: string = process.env.DATABASE_NAME || "";
const DYNAMODB_REGION = process.env.DYNAMODB_REGION || "";
const DYNAMODB_ACCESS_KEY_ID = process.env.DYNAMODB_ACCESS_KEY_ID || "";
const DYNAMODB_SECRET_ACCESS_KEY = process.env.DYNAMODB_SECRET_ACCESS_KEY || "";
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
exports.dynamoDB = new AWS.DynamoDB.DocumentClient();
