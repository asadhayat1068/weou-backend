import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const providerURL_WSS = process.env.WSS_URL || "";

export const networkConfig = {};
export const wss_provider = new ethers.providers.WebSocketProvider(
  providerURL_WSS
);

export const COLLECTION_ADDRESS = process.env.COLLECTION_ADDRESS || "";
