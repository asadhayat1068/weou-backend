import express from "express";
import { SIWERouter } from "./controllers/siwe";
import { LotteryRouter } from "./controllers/lottery";
import { UserRouter } from "./controllers/user";

export const AppRouter = express.Router();
AppRouter.use("/lottery", LotteryRouter);
AppRouter.use("/user", UserRouter);
AppRouter.use("/auth", SIWERouter);
