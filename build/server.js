"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = require("./app");
const util_1 = require("./util");
const nftCollection = __importStar(require("./providers/nft-contract"));
const providers_1 = require("./providers");
const lottery_service_1 = require("./services/lottery.service");
const test_1 = require("./config/test");
const lotteryService = new lottery_service_1.LotteryService();
// WeOu contract Events Listeners
nftCollection.contract.on(nftCollection.Events.Transfer, nftCollection.Transfer_handler);
lotteryService.processSale(test_1.dummySale).then((result) => {
    console.log("Dummy Sale Result: ", { result });
});
providers_1.OpenSeaClient.onItemSold("cssnftcollection-2", (item) => {
    lotteryService.processSale(item);
});
// Start the server
const server = app_1.app.listen(process.env.PORT || app_1.app.get("port"), () => {
    util_1.logger.info("APP_START", `App is running at http://localhost:${app_1.app.get("port")} in ${app_1.app.get("env")} mode`);
});
process.on("unhandledRejection", (reason) => {
    util_1.logger.error("- UNHANDLED_REJECTION", reason);
});
exports.default = server;
