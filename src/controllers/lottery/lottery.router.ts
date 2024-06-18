import express from "express";
import { LotteryController } from "./lottery.controller";

export const LotteryRouter = express.Router();

LotteryRouter.post("/sales", [LotteryController.getSales]);
