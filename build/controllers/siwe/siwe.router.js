"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIWERouter = void 0;
const express_1 = __importDefault(require("express"));
const siwe_controller_1 = require("./siwe.controller");
exports.SIWERouter = express_1.default.Router();
exports.SIWERouter.get("/nonce", [siwe_controller_1.SIWEController.getNonce]);
exports.SIWERouter.post("/verify", [siwe_controller_1.SIWEController.verifyMessage]);
