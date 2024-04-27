import { app } from "./app";
import { logger } from "./util";
import { wss_provider } from "./config";
import * as nftCollection from "./providers/nft-contract";
import { Events } from "./providers";
import { OpenSeaClient } from "./providers";
import { LotteryService } from "./services/lottery.service";
const lotteryService = new LotteryService();

// Auction contract Events Listeners
// auction_contract.on(AuctionEvents.AuctionCreated, AuctionCreated_handler);
// auction_contract.on(AuctionEvents.Bid, Bid_handler);
// auction_contract.on(AuctionEvents.BuyBids, BuyBids_handler);
// auction_contract.on(AuctionEvents.EndAuction, EndAuction_handler);
// Token contract Events Listeners
/*nftCollection.contract.on(
  nftCollection.Events.Transfer,
  nftCollection.Transfer_handler
);
nftCollection.contract.on(
  nftCollection.Events.TransferCheck,
  nftCollection.TransferCheck_handler
);
nftCollection.contract.on(
  nftCollection.Events.TxData,
  nftCollection.TxData_handler
);

console.log("Listening to events", nftCollection.contract.address);
*/
OpenSeaClient.onItemSold("cssnftcollection-2", (item) => {
  console.log(JSON.stringify(item, null, 4));
  // lotteryService.processSale(item);
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
