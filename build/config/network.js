"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_WALLET = exports.SECRET_TRANSACTION = exports.OPENSEA_API_KEY = exports.COLLECTION_ADDRESS = exports.wss_provider = exports.networkConfig = void 0;
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const providerURL_WSS = process.env.WSS_URL || "";
exports.networkConfig = {};
exports.wss_provider = new ethers_1.WebSocketProvider(providerURL_WSS);
exports.COLLECTION_ADDRESS = process.env.COLLECTION_ADDRESS || "";
exports.OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || "";
exports.SECRET_TRANSACTION = "3d";
exports.SECRET_WALLET = "35";
