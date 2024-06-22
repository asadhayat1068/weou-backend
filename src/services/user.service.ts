import { dynamoDB } from "../config";
import { formatKey } from "../util";
import { UserAddress } from "../util/types";
import { BaseService } from "./base-service";

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
}
