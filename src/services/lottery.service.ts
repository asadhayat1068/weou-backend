import { SECRET_TRANSACTION, SECRET_WALLET, dynamoDB } from "../config";
import { logger } from "../util";
import { BaseService } from "./base-service";

export interface LotteryResult {
  l1: {
    winner: boolean;
    prizeClaimed: boolean;
  };
  l2: {
    winner: boolean;
    prizeClaimed: boolean;
  };
}

export class LotteryService extends BaseService {
  public async processSale(data: any) {
    const { maker, taker, payment_token, transaction, item } = data?.payload;
    const txDate = new Date(transaction.timestamp).getTime();
    const timestamp = Math.floor(txDate / 1000);
    const tokenId = item.nft_id.split("/")[2];

    const buyerAddress = taker.address;
    const sellerAddress = maker.address;
    const transactionHash = transaction.hash;
    const result = this.checkWinner(buyerAddress, transactionHash);
    await this.addSaleRecord(
      Number(tokenId),
      transactionHash,
      sellerAddress,
      buyerAddress,
      result
    );
  }

  private checkWinner(buyerAddress: string, transactionHash: string) {
    const buyerSecret = buyerAddress.slice(-2);
    const transactionSecret = transactionHash.slice(-2);
    const result = {
      l1: {
        winner: false,
        prizeClaimed: false,
      },
      l2: {
        winner: false,
        prizeClaimed: false,
      },
    };
    if (
      buyerSecret === SECRET_WALLET &&
      transactionSecret === SECRET_TRANSACTION
    ) {
      result.l1.winner = true;
      return result;
    } else if (buyerSecret === SECRET_WALLET) {
      result.l2.winner = true;
      return result;
    }
    return result;
  }

  private async addSaleRecord(
    tokenId: number,
    transactionHash: string,
    from: string,
    to: string,
    result: LotteryResult
  ) {
    const pk = `SALE#${to}`;
    const sk = `TX#${transactionHash}`;
    const params = {
      TableName: "weou",
      Item: {
        pk,
        sk,
        transactionHash,
        from,
        to,
        result,
      },
      ReturnValues: "NONE",
    };
    try {
      await dynamoDB.put(params).promise();
    } catch (error) {
      logger.error("Error adding sale record", error);
      throw new Error("Error adding sale record");
    }
  }

  public async getSalesByAddress(address: string) {
    const params = {
      TableName: "weou",
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `SALE#${address}`,
      },
    };
    try {
      const response = await dynamoDB.query(params).promise();
      return response.Items;
    } catch (error) {
      logger.error("Error getting sales by address", error);
      throw new Error("Error getting sales by address");
    }
  }
}
