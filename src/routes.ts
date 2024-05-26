import express from "express";
import { HelloRouter } from "./controllers/hello";
import { SIWERouter } from "./controllers/siwe";

export const AppRouter = express.Router();
AppRouter.use("/hello", HelloRouter);
AppRouter.use("/auth", SIWERouter);
