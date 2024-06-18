import { Request, Response } from "express";
import { InternalErrorResponse, SuccessResponse, logger } from "../../util";
import { LotteryService } from "../../services/lottery.service";

export class LotteryController {
  static async getSales(req: Request, res: Response) {
    try {
      const walletAddress = req.body.walletAddress;
      const sales = await LotteryService.getSalesByAddress(walletAddress);
      const response = new SuccessResponse(
        res,
        "Sales records fetched successfully.",
        {
          sales,
        }
      );

      return response.send();
    } catch (error) {
      logger.error("Error getting sales", {
        error,
        route: req.originalUrl,
        method: req.method,
      });
      const resp = new InternalErrorResponse(res, "Error getting sales");
      return resp.send();
    }
  }
}
