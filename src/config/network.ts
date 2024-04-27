import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const providerURL_WSS = process.env.WSS_URL || "";

export const networkConfig = {};
export const wss_provider = new ethers.providers.WebSocketProvider(
  providerURL_WSS
);

export const COLLECTION_ADDRESS = process.env.COLLECTION_ADDRESS || "";
export const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || "";

export const SECRET_TRANSACTION = "3d";
export const SECRET_WALLET = "35";
