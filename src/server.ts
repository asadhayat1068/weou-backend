import "reflect-metadata";
import { app } from "./app";
import { logger } from "./util";
import { wss_provider } from "./config";
import * as nftCollection from "./providers/nft-contract";
import { OpenSeaClient } from "./providers";
import { LotteryService } from "./services/lottery.service";
import { DataSource } from "typeorm";
import { OwnershipService } from "./services/ownership.service";

const lotteryService = new LotteryService();

// WeOu contract Events Listeners

nftCollection.contract.on(
  nftCollection.Events.Transfer,
  nftCollection.Transfer_handler
);

OwnershipService.getTokensByOwner(
  "0x2883a414A19CDAd4f9fC33DB4c072B04a7d61008"
).then((tokens) => {
  console.log({ tokens });
});

OpenSeaClient.onItemSold("cssnftcollection-2", (item) => {
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
