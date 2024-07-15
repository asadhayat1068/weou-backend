"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSeaClient = void 0;
const stream_js_1 = require("@opensea/stream-js");
const ws_1 = require("ws");
const node_localstorage_1 = require("node-localstorage");
const config_1 = require("../config");
const OpenSeaClient = new stream_js_1.OpenSeaStreamClient({
    token: config_1.OPENSEA_API_KEY,
    network: stream_js_1.Network.MAINNET,
    connectOptions: {
        transport: ws_1.WebSocket,
        sessionStorage: node_localstorage_1.LocalStorage,
    },
    onError: (error) => {
        console.error("OpenSea Client Error:", error);
    },
});
exports.OpenSeaClient = OpenSeaClient;
OpenSeaClient.connect();
