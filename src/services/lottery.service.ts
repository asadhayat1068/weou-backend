import { SECRET_TRANSACTION, SECRET_WALLET, dynamoDB } from "../config";
import { BaseService } from "./base-service";

const openSeaEventJSON = {
  event_type: "item_sold",
  payload: {
    chain: "sepolia",
    closing_date: "2024-06-18T10:30:12.000000+00:00",
    collection: {
      slug: "cssnftcollection-2",
    },
    event_timestamp: "2024-06-18T10:30:12.000000+00:00",
    is_private: false,
    item: {
      chain: {
        name: "sepolia",
      },
      metadata: {
        animation_url: null,
        image_url:
          "https://i.seadn.io/s/raw/files/04f6ba47bb165261498ead536facd50c.png?w=500&auto=format",
        metadata_url:
          "ipfs://bafybeieqll4mwcnxrsjpg6gs66h4z54po2bhdmjmw7yqrw5mq6bvtlcnuq/8",
        name: "SYSTEMS NFTs 8",
      },
      nft_id: "sepolia/0x3b7e127b027c7f157c409a2b99bccc1ae0e5bbef/8",
      permalink:
        "https://testnets.opensea.io/assets/sepolia/0x3b7e127b027c7f157c409a2b99bccc1ae0e5bbef/8",
    },
    listing_type: null,
    maker: {
      address: "0xff6b07070a9c34bf9955d55bd360308be1009735",
    },
    order_hash:
      "0x0d815d917f347e5ead4e26652c73d5c7ef3ad34dcd8daa59d8e8ff84306e07f4",
    payment_token: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      eth_price: "1.000000000000000",
      name: "Ether",
      symbol: "ETH",
      usd_price: "3425.949999999999818000",
    },
    protocol_address: "0x0000000000000068f116a894984e2db1123eb395",
    protocol_data: {
      parameters: {
        conduitKey:
          "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
        consideration: [
          {
            endAmount: "4750000000000",
            identifierOrCriteria: "0",
            itemType: 0,
            recipient: "0xFf6b07070a9C34Bf9955D55Bd360308be1009735",
            startAmount: "4750000000000",
            token: "0x0000000000000000000000000000000000000000",
          },
          {
            endAmount: "125000000000",
            identifierOrCriteria: "0",
            itemType: 0,
            recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
            startAmount: "125000000000",
            token: "0x0000000000000000000000000000000000000000",
          },
          {
            endAmount: "125000000000",
            identifierOrCriteria: "0",
            itemType: 0,
            recipient: "0x82e10D630A7BD8A91C560a4a335d29CcF3C904e1",
            startAmount: "125000000000",
            token: "0x0000000000000000000000000000000000000000",
          },
        ],
        counter: 0,
        endTime: "1721298555",
        offer: [
          {
            endAmount: "1",
            identifierOrCriteria: "8",
            itemType: 2,
            startAmount: "1",
            token: "0x3b7E127B027C7f157c409A2b99bccc1ae0E5bbEf",
          },
        ],
        offerer: "0xff6b07070a9c34bf9955d55bd360308be1009735",
        orderType: 0,
        salt: "0x360c6ebe000000000000000000000000000000000000000068f4e461fa76b4a2",
        startTime: "1718706555",
        totalOriginalConsiderationItems: 3,
        zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
        zoneHash:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
      signature: null,
    },
    quantity: 1,
    sale_price: "5000000000000",
    taker: {
      address: "0x2883a414a19cdad4f9fc33db4c072b04a7d61008",
    },
    transaction: {
      hash: "0x0533c3d4ad585189ffda46db5e0f395d02a780d10559647fe2499e2c17c1b33e",
      timestamp: "2024-06-18T10:30:12.000000+00:00",
    },
  },
  sent_at: "2024-06-18T10:30:15.426713+00:00",
};

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

    console.log("Processing sale", {
      maker,
      taker,
      payment_token,
      transaction,
    });

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
      console.log("Error adding sale record", error);
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
      console.log("Error getting sales by address", error);
      throw new Error("Error getting sales by address");
    }
  }
}
