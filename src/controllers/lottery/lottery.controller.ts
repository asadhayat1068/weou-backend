import { Request, Response } from "express";
import {
  BadRequestResponse,
  InternalErrorResponse,
  SuccessResponse,
  logger,
} from "../../util";
import { LotteryService, lotteryStatus } from "../../services/lottery.service";
import { SiweService } from "../../services/siwe-service";
import { SECRET_TRANSACTION, SECRET_WALLET, updateSecrets } from "../../config";

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

  static async getPrize(req: Request, res: Response) {
    try {
      const { owner, txId, level } = req.params;
      const sale = await LotteryService.getSale(owner, txId);

      if (!sale) {
        const response = new BadRequestResponse(res, "Sale not found.");
        return response.send();
      }
      const lotteryResult = sale?.result;
      const prize = lotteryResult[level];

      const response = new SuccessResponse(res, "Prize fetched successfully.", {
        level,
        prize,
      });

      return response.send();
    } catch (error) {
      logger.error("Error getting prize", {
        error,
        route: req.originalUrl,
        method: req.method,
      });
      const resp = new InternalErrorResponse(res, "Error getting prize");
      return resp.send();
    }
  }

  static async claimPrize(req: Request, res: Response) {
    const { account, message, signature, chainId } = req.body;
    try {
      // LotteryService.requestPrizeClaim(owner, txId, level);
      // Verify message
      await SiweService.verify(message, signature);
      const statement = JSON.parse(message?.statement || {});
      // Data from Message
      const walletAddress = statement.walletAddress;
      const level = statement.level;
      const txId = statement.txId;
      // Verify Lottery Result
      const sale = await LotteryService.getSale(walletAddress, txId);
      if (!sale) {
        const response = new BadRequestResponse(res, "Sale not found.");
        return response.send();
      }
      if (sale.status !== lotteryStatus.PENDING) {
        const response = new BadRequestResponse(
          res,
          "Claim already submitted or processed."
        );
        return response.send();
      }
      const lotteryResult = sale?.result;
      const prize = lotteryResult[level];
      if (!prize) {
        const response = new BadRequestResponse(res, "Invalid prize level.");
        return response.send();
      }
      if (prize.claimed) {
        const response = new BadRequestResponse(res, "Prize already claimed.");
        return response.send();
      }
      if (!prize.winner) {
        const response = new BadRequestResponse(res, "Prize not won.");
        return response.send();
      }

      // Update Sale Status
      await LotteryService.claimPrize(
        walletAddress,
        txId,
        level,
        lotteryStatus.PROCESSING
      );

      const _sale = await LotteryService.getSale(walletAddress, txId);

      const response = new SuccessResponse(res, "Prize claimed successfully.", {
        ..._sale,
      });
      return response.send();
    } catch (error) {
      logger.error("Error claiming prize", {
        error,
        route: req.originalUrl,
        method: req.method,
      });
      const resp = new InternalErrorResponse(res, "Error claiming prize");
      return resp.send();
    }
  }

  static async setRands(req: Request, res: Response) {
    updateSecrets();
    const response = new SuccessResponse(res, "Rands updated successfully.");
    return response.send();
  }

  static async getRands(req: Request, res: Response) {
    const response = new SuccessResponse(res, "Rands fetched successfully.", {
      SECRET_WALLET,
      SECRET_TRANSACTION,
    });
    return response.send();
  }
}
