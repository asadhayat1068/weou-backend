import { WebSocketProvider, ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const providerURL_WSS = process.env.WSS_URL || "";

export const networkConfig = {};
export const wss_provider = new WebSocketProvider(providerURL_WSS);

export const COLLECTION_ADDRESS = process.env.COLLECTION_ADDRESS || "";
export const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || "";

export let SECRET_TRANSACTION = "3d";
export let SECRET_WALLET = "35";

export const updateSecrets = () => {
  SECRET_TRANSACTION = Math.floor(Math.random() * 256).toString(16);
  SECRET_WALLET = Math.floor(Math.random() * 256).toString(16);
};
