import { ZeroAddress } from "ethers";
import { dynamoDB } from "../config";
import { BaseService } from "./base-service";

export class OwnershipService extends BaseService {
  /**
   * async transferOwnership
   */
  private static async addOwnership(
    to: string,
    tokenId: string,
    timestamp: number
  ) {
    const params = {
      TableName: "weou",
      Item: {
        pk: `owner#${to}`,
        sk: `token#${tokenId}`,
        token_id: tokenId,
        token_owner: to,
        timestamp,
      },
      ReturnValues: "NONE",
    };
    try {
      await dynamoDB.put(params).promise();
    } catch (error) {
      console.log("Error transferring ownership", error);
      throw new Error("Error transferring ownership");
    }
  }

  private static async removeOwnership(from: string, tokenId: string) {
    const params = {
      TableName: "weou",
      Key: {
        pk: `owner#${from}`,
        sk: `token#${tokenId}`,
      },
      ReturnValues: "NONE",
    };
    try {
      await dynamoDB.delete(params).promise();
    } catch (error) {
      console.log("Error transferring ownership", error);
      throw new Error("Error transferring ownership");
    }
  }

  /**
   * async transferOwnership
   * @param from: string - from address
   * @param to: string - to address
   * @param tokenId: string - token id
   * @returns Promise<void>
   */
  public static async transferOwnership(
    from: string,
    to: string,
    tokenId: string,
    timestamp: number
  ) {
    try {
      // if from is address zero then add ownership
      if (from === ZeroAddress) {
        await this.addOwnership(to, tokenId, timestamp);
        return;
      }
      await this.removeOwnership(from, tokenId);
      await this.addOwnership(to, tokenId, timestamp);
    } catch (error) {
      console.log("Error transferring ownership", error);
      throw new Error("Error transferring ownership");
    }
  }

  /**
   * async getTokensByOwner
   * @param ownerAddress: string - owner address
   * @returns Promise<any> - list of tokens owned by the owner
   * @throws Error - error getting ownership
   * @description Get tokens by owner
   */
  public static async getTokensByOwner(ownerAddress: string) {
    const params = {
      TableName: "weou",
      KeyConditionExpression: "#pk = :pk and begins_with(#sk, :skPrefix)",
      ExpressionAttributeNames: {
        "#pk": "pk",
        "#sk": "sk",
      },
      ExpressionAttributeValues: {
        ":pk": `owner#${ownerAddress}`,
        ":skPrefix": "token#",
      },
    };
    try {
      const data = await dynamoDB.query(params).promise();
      return data.Items;
    } catch (error) {
      console.log("Error getting ownership", error);
      throw new Error("Error getting ownership");
    }
  }
}
