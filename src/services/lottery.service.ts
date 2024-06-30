import { SECRET_TRANSACTION, SECRET_WALLET, dynamoDB } from "../config";
import { logger } from "../util";
import { formatKey } from "../util/helpers";
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

export const lotteryStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  CLAIMED: "CLAIMED",
  FORFEITED: "FORFEITED",
};

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
    const pk = formatKey(`SALE#${to}`);
    const sk = formatKey(`TX#${transactionHash}`);
    const params = {
      TableName: "weou",
      Item: {
        pk,
        sk,
        transactionHash,
        from,
        to,
        result,
        tokenId,
        status: lotteryStatus.PENDING,
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

  public static async getSalesByAddress(address: string) {
    const params = {
      TableName: "weou",
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": "pk",
      },
      ExpressionAttributeValues: {
        ":pk": formatKey(`SALE#${address}`),
      },
    };
    console.log(params);
    try {
      const response = await dynamoDB.query(params).promise();
      return response.Items;
    } catch (error) {
      logger.error("Error getting sales by address", error);
      throw new Error("Error getting sales by address");
    }
  }

  public static async getSale(owner: string, txId: string) {
    const params = {
      TableName: "weou",
      Key: {
        pk: formatKey(`SALE#${owner}`),
        sk: formatKey(`TX#${txId}`),
      },
    };
    try {
      const response = await dynamoDB.get(params).promise();
      return response.Item;
    } catch (error) {
      logger.error("Error getting prize", error);
      throw new Error("Error getting prize");
    }
  }

  public static async claimPrize(
    owner: string,
    txId: string,
    level: string,
    status: string
  ) {
    const params = {
      TableName: "weou",
      Key: {
        pk: formatKey(`SALE#${owner}`),
        sk: formatKey(`TX#${txId}`),
      },
      // Update status to PROCESSING and set prizeClaimed to true
      UpdateExpression: `set #saleResult.${level}.prizeClaimed = :prizeClaimed, #saleStatus = :status`,
      ExpressionAttributeValues: {
        ":prizeClaimed": true,
        ":status": status,
      },
      ExpressionAttributeNames: {
        "#saleStatus": "status",
        "#saleResult": "result",
      },
    };
    try {
      await dynamoDB.update(params).promise();
    } catch (error) {
      console.log("----");
      console.log(error);
      console.log("----");
      // logger.error("Error claiming prize", error);
      throw new Error("Error claiming prize");
    }
  }
}
