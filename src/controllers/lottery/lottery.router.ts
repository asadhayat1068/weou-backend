import express from "express";
import { LotteryController } from "./lottery.controller";

export const LotteryRouter = express.Router();

LotteryRouter.post("/sales", [LotteryController.getSales]);
LotteryRouter.get("/prize/:owner/:txId/:level", [LotteryController.getPrize]);
LotteryRouter.post("/prize/claim", [LotteryController.claimPrize]);
// LotteryRouter.get("/prize/set_rands", [LotteryController.setRands]);
// LotteryRouter.get("/prize/get_rands", [LotteryController.getRands]);
