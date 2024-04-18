import express from "express";
import { HelloRouter } from "./controllers/hello";

export const AppRouter = express.Router();
AppRouter.use("/hello", HelloRouter);
