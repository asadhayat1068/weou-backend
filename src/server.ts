import "reflect-metadata";
import { app } from "./app";
import { logger } from "./util";
import * as nftCollection from "./providers/nft-contract";
import { OpenSeaClient } from "./providers";
import { LotteryService } from "./services/lottery.service";
const lotteryService = new LotteryService();

// WeOu contract Events Listeners

nftCollection.contract.on(
  nftCollection.Events.Transfer,
  nftCollection.Transfer_handler
);

OpenSeaClient.onItemSold("weou", (item) => {
  lotteryService.processSale(item);
});

// Start the server
const server = app.listen(process.env.PORT || app.get("port"), () => {
  logger.info(
    "APP_START",
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
});

process.on("unhandledRejection", (reason) => {
  logger.error("- UNHANDLED_REJECTION", reason);
});

export default server;
