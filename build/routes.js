"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRouter = void 0;
const express_1 = __importDefault(require("express"));
const siwe_1 = require("./controllers/siwe");
const lottery_1 = require("./controllers/lottery");
const user_1 = require("./controllers/user");
exports.AppRouter = express_1.default.Router();
exports.AppRouter.use("/lottery", lottery_1.LotteryRouter);
exports.AppRouter.use("/user", user_1.UserRouter);
exports.AppRouter.use("/auth", siwe_1.SIWERouter);
