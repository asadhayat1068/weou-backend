"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotteryRouter = void 0;
const express_1 = __importDefault(require("express"));
const lottery_controller_1 = require("./lottery.controller");
exports.LotteryRouter = express_1.default.Router();
exports.LotteryRouter.post("/sales", [lottery_controller_1.LotteryController.getSales]);
exports.LotteryRouter.get("/prize/:owner/:txId/:level", [lottery_controller_1.LotteryController.getPrize]);
exports.LotteryRouter.post("/prize/claim", [lottery_controller_1.LotteryController.claimPrize]);
