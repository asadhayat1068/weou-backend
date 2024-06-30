"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
exports.UserRouter = express_1.default.Router();
exports.UserRouter.post("/tokens", [user_controller_1.UserController.getTokensOwned]);
exports.UserRouter.post("/update-address", [user_controller_1.UserController.updateAddress]);
exports.UserRouter.post("/get-address", [user_controller_1.UserController.getAddress]);
