import { Request, Response } from "express";
import { InternalErrorResponse, SuccessResponse, logger } from "../../util";
import { OwnershipService } from "../../services/ownership.service";

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
      logger.error("Error getting user tokens", {
        error,
        route: req.originalUrl,
        method: req.method,
      });
      const resp = new InternalErrorResponse(res, "Error getting tokens");
      return resp.send();
    }
  }
}
