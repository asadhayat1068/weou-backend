import { Network, OpenSeaStreamClient } from "@opensea/stream-js";
import { WebSocket } from "ws";
import { LocalStorage } from "node-localstorage";
import { OPENSEA_API_KEY } from "../config";

const OpenSeaClient = new OpenSeaStreamClient({
  token: OPENSEA_API_KEY,
  network: Network.TESTNET,
  connectOptions: {
    transport: WebSocket,
    sessionStorage: LocalStorage,
  },
  onError: (error) => {
    console.error("OpenSea Client Error:", error);
  },
});

OpenSeaClient.connect();

export { OpenSeaClient };
