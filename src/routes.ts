import express from "express";
import { SIWERouter } from "./controllers/siwe";
import { LotteryRouter } from "./controllers/lottery";

export const AppRouter = express.Router();
AppRouter.use("/lottery", LotteryRouter);
AppRouter.use("/auth", SIWERouter);
