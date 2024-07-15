import {
  dynamoDB,
  LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE,
  OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE,
} from "../config";
import { formatKey } from "../util";
import { UserAddress } from "../util/types";
import { BaseService } from "./base-service";
import { OwnershipService } from "./ownership.service";

export class UserService extends BaseService {
  public static async updateUserAddress(
    walletAddress: string,
    shippingAddress: UserAddress
  ) {
    const params = {
      TableName: "weou",
      Key: {
        pk: formatKey(`user#${walletAddress}`),
        sk: formatKey(`shippingAddress#${walletAddress}`),
      },
      UpdateExpression: "set address = :address",
      ExpressionAttributeValues: {
        ":address": shippingAddress,
      },
      ReturnValues: "NONE",
    };
    await dynamoDB.update(params).promise();
  }

  public static async getUserAddress(walletAddress: string) {
    const params = {
      TableName: "weou",
      Key: {
        pk: formatKey(`user#${walletAddress}`),
        sk: formatKey(`shippingAddress#${walletAddress}`),
      },
    };
    const response = await dynamoDB.get(params).promise();
    return response.Item;
  }

  public static async getUserRoyalty(walletAddress: string) {
    const params = {
      TableName: "weou",
      Key: {
        pk: formatKey(`user#${walletAddress}`),
        sk: formatKey(`royalty#${walletAddress}`),
      },
    };
    const response = await dynamoDB.get(params).promise();
    return response.Item || { royalty: 0 };
  }

  private static async awardRoyalty(
    walletAddress: string,
    tokenId: number,
    royaltyAmount: number,
    transactionHash: string
  ) {
    // Get current royalty amount
    let userCurrentRoyalty = await this.getUserRoyalty(walletAddress);
    userCurrentRoyalty = userCurrentRoyalty.royalty || 0;

    // Update royalty amount
    royaltyAmount += Number(userCurrentRoyalty);
    const params = {
      TableName: "weou",
      Key: {
        pk: formatKey(`user#${walletAddress}`),
        sk: formatKey(`royalty#${walletAddress}`),
      },
      UpdateExpression: "set royalty = :royalty",
      ExpressionAttributeValues: {
        ":royalty": royaltyAmount,
      },
      ReturnValues: "NONE",
    };
    await dynamoDB.update(params).promise();

    // Log Royalty award
    const royaltyLog = {
      walletAddress,
      tokenId,
      royaltyAmount,
      transactionHash,
      timestamp: new Date().toISOString(),
    };
    const date = new Date();
    const logParams = {
      TableName: "weou",
      Item: {
        pk: formatKey(`royalty#${walletAddress}`),
        sk: formatKey(`log#${transactionHash}#${date.getTime()}`),
        ...royaltyLog,
      },
    };
    await dynamoDB.put(logParams).promise();
  }

  private static awardRoyaltyToUsers(
    tokenId: number,
    royaltyAmount: number,
    transactionHash: string,
    owners: string[]
  ) {
    owners.forEach(async (owner) => {
      await UserService.awardRoyalty(
        owner,
        tokenId,
        royaltyAmount,
        transactionHash
      );
    });
  }

  public static async awardRoyaltyToOwners(
    tokenId: number,
    royaltyAmount: number,
    transactionHash: string
  ) {
    let owners = await OwnershipService.getTokenOwners(tokenId);
    owners = owners.owners || [];
    if (owners.length === 0) {
      return;
    }
    const latest = owners.pop();
    // Award royalty to latest owner
    const latest_owner_percentage = LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE / 100;
    this.awardRoyaltyToUsers(
      tokenId,
      royaltyAmount * latest_owner_percentage,
      transactionHash,
      [latest]
    );

    // Award royalty to other owners
    const other_owners_percentage = OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE / 100;
    this.awardRoyaltyToUsers(
      tokenId,
      royaltyAmount * other_owners_percentage,
      transactionHash,
      owners as string[]
    );
  }
}
