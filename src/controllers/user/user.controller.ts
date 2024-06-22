import { Request, Response } from "express";
import {
  BadRequestResponse,
  InternalErrorResponse,
  SuccessResponse,
  formatKey,
  logger,
} from "../../util";
import { OwnershipService } from "../../services/ownership.service";
import { SiweService } from "../../services/siwe-service";
import { ClaimRequest } from "../../util/types";
import { UserService } from "../../services/user.service";

export class UserController {
  static async getTokensOwned(req: Request, res: Response) {
    try {
      const walletAddress = req.body.walletAddress;
      const tokens = await OwnershipService.getTokensByOwner(walletAddress);
      const response = new SuccessResponse(
        res,
        "Tokens records fetched successfully.",
        {
          tokens,
        }
      );

      return response.send();
    } catch (error) {
      logger.error(
        "Error getting user tokens",
        JSON.stringify({
          error,
          route: req.originalUrl,
          method: req.method,
        })
      );
      const resp = new InternalErrorResponse(res, "Error getting tokens");
      return resp.send();
    }
  }

  static async updateAddress(req: Request, res: Response) {
    try {
      const { address, chainId, message, signature } = req.body;
      const v = await SiweService.verify(message, signature);
      if (!v.success || formatKey(address) !== formatKey(v.data.address)) {
        const response = new InternalErrorResponse(
          res,
          "Error verifying message signature"
        );
        return response.send();
      }

      // Get address from Message
      const userStatement = JSON.parse(
        v.data.statement || "{}"
      ) as ClaimRequest;

      const shippingAddress = userStatement.address;
      if (!shippingAddress) {
        throw new Error("Invalid shipping address.");
      }
      // Update user address
      UserService.updateUserAddress(address, shippingAddress);
      const response = new SuccessResponse(
        res,
        `Shipping Address for ${address} updated successfully.`,
        {
          address,
          chainId,
          message,
          signature,
        }
      );

      return response.send();
    } catch (error: any) {
      const errorMessage = error.error
        ? error.error.message
        : "Error updating user address";
      const resp = new BadRequestResponse(res, errorMessage);
      return resp.send();
    }
  }

  static async getAddress(req: Request, res: Response) {
    try {
      const walletAddress = req.body.walletAddress;
      const address = await UserService.getUserAddress(walletAddress);
      const response = new SuccessResponse(
        res,
        "Address fetched successfully.",
        address
      );

      return response.send();
    } catch (error) {
      logger.error(
        "Error getting user address",
        JSON.stringify({
          error,
          route: req.originalUrl,
          method: req.method,
        })
      );
      const resp = new InternalErrorResponse(res, "Error getting address");
      return resp.send();
    }
  }
}
