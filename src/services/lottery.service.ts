import { SECRET_TRANSACTION, SECRET_WALLET } from "../config";
import { BaseService } from "./base-service";

export class LotteryService extends BaseService {
  public async processSale(data: any) {
    const { maker, taker, payment_token, transaction } = data?.payload;

    console.log("Processing sale", {
      maker,
      taker,
      payment_token,
      transaction,
    });

    const buyerAddress = taker.address;
    const transactionHash = transaction.hash;
    await this.checkWinner(buyerAddress, transactionHash);
  }

  private async checkWinner(buyerAddress: string, transactionHash: string) {
    const buyerSecret = buyerAddress.slice(-2);
    const transactionSecret = transactionHash.slice(-2);

    if (
      buyerSecret === SECRET_WALLET &&
      transactionSecret === SECRET_TRANSACTION
    ) {
      console.log("L1 Price: Winner winner chicken dinner");
    } else if (buyerSecret === SECRET_WALLET) {
      console.log("L2 Price: Winner winner chicken dinner");
    } else {
      console.log("No prize for you");
    }
  }
}
