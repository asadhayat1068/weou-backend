"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotteryController = void 0;
const util_1 = require("../../util");
const lottery_service_1 = require("../../services/lottery.service");
const siwe_service_1 = require("../../services/siwe-service");
const config_1 = require("../../config");
class LotteryController {
    static getSales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletAddress = req.body.walletAddress;
                const sales = yield lottery_service_1.LotteryService.getSalesByAddress(walletAddress);
                const response = new util_1.SuccessResponse(res, "Sales records fetched successfully.", {
                    sales,
                });
                return response.send();
            }
            catch (error) {
                util_1.logger.error("Error getting sales", {
                    error,
                    route: req.originalUrl,
                    method: req.method,
                });
                const resp = new util_1.InternalErrorResponse(res, "Error getting sales");
                return resp.send();
            }
        });
    }
    static getPrize(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { owner, txId, level } = req.params;
                const sale = yield lottery_service_1.LotteryService.getSale(owner, txId);
                if (!sale) {
                    const response = new util_1.BadRequestResponse(res, "Sale not found.");
                    return response.send();
                }
                const lotteryResult = sale === null || sale === void 0 ? void 0 : sale.result;
                const prize = lotteryResult[level];
                const response = new util_1.SuccessResponse(res, "Prize fetched successfully.", {
                    level,
                    prize,
                });
                return response.send();
            }
            catch (error) {
                util_1.logger.error("Error getting prize", {
                    error,
                    route: req.originalUrl,
                    method: req.method,
                });
                const resp = new util_1.InternalErrorResponse(res, "Error getting prize");
                return resp.send();
            }
        });
    }
    static claimPrize(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { account, message, signature, chainId } = req.body;
            try {
                // LotteryService.requestPrizeClaim(owner, txId, level);
                // Verify message
                yield siwe_service_1.SiweService.verify(message, signature);
                const statement = JSON.parse((message === null || message === void 0 ? void 0 : message.statement) || {});
                // Data from Message
                const walletAddress = statement.walletAddress;
                const level = statement.level;
                const txId = statement.txId;
                // Verify Lottery Result
                const sale = yield lottery_service_1.LotteryService.getSale(walletAddress, txId);
                if (!sale) {
                    const response = new util_1.BadRequestResponse(res, "Sale not found.");
                    return response.send();
                }
                if (sale.status !== lottery_service_1.lotteryStatus.PENDING) {
                    const response = new util_1.BadRequestResponse(res, "Claim already submitted or processed.");
                    return response.send();
                }
                const lotteryResult = sale === null || sale === void 0 ? void 0 : sale.result;
                const prize = lotteryResult[level];
                if (!prize) {
                    const response = new util_1.BadRequestResponse(res, "Invalid prize level.");
                    return response.send();
                }
                if (prize.claimed) {
                    const response = new util_1.BadRequestResponse(res, "Prize already claimed.");
                    return response.send();
                }
                if (!prize.winner) {
                    const response = new util_1.BadRequestResponse(res, "Prize not won.");
                    return response.send();
                }
                // Update Sale Status
                yield lottery_service_1.LotteryService.claimPrize(walletAddress, txId, level, lottery_service_1.lotteryStatus.PROCESSING);
                const _sale = yield lottery_service_1.LotteryService.getSale(walletAddress, txId);
                const response = new util_1.SuccessResponse(res, "Prize claimed successfully.", Object.assign({}, _sale));
                return response.send();
            }
            catch (error) {
                util_1.logger.error("Error claiming prize", {
                    error,
                    route: req.originalUrl,
                    method: req.method,
                });
                const resp = new util_1.InternalErrorResponse(res, "Error claiming prize");
                return resp.send();
            }
        });
    }
    static setRands(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, config_1.updateSecrets)();
            const response = new util_1.SuccessResponse(res, "Rands updated successfully.");
            return response.send();
        });
    }
    static getRands(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new util_1.SuccessResponse(res, "Rands fetched successfully.", {
                SECRET_WALLET: config_1.SECRET_WALLET,
                SECRET_TRANSACTION: config_1.SECRET_TRANSACTION,
            });
            return response.send();
        });
    }
}
exports.LotteryController = LotteryController;
