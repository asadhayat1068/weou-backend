"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE = exports.LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE = exports.L2_LOTTERY_ENABLED = exports.L1_LOTTERY_ENABLED = exports.appConfig = exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.environment = process.env.NODE_ENV;
exports.appConfig = {
    port: process.env.PORT || 3000,
    serviceName: process.env.SERVICE_NAME,
};
exports.L1_LOTTERY_ENABLED = process.env.L1_LOTTERY_ENABLED || true;
exports.L2_LOTTERY_ENABLED = process.env.L2_LOTTERY_ENABLED || true;
exports.LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE = Number(process.env.LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE || 5); // set default to 5%
exports.OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE = Number(process.env.OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE || 2.5); // set default to 2.5%
