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
exports.LotteryService = exports.lotteryStatus = void 0;
const config_1 = require("../config");
const util_1 = require("../util");
const helpers_1 = require("../util/helpers");
const base_service_1 = require("./base-service");
const ownership_service_1 = require("./ownership.service");
const user_service_1 = require("./user.service");
exports.lotteryStatus = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    CLAIMED: "CLAIMED",
    FORFEITED: "FORFEITED",
};
class LotteryService extends base_service_1.BaseService {
    processSale(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { maker, taker, payment_token, transaction, item, protocol_data } = data === null || data === void 0 ? void 0 : data.payload;
            const txDate = new Date(transaction.timestamp).getTime();
            const timestamp = Math.floor(txDate / 1000);
            const tokenId = item.nft_id.split("/")[2];
            const buyerAddress = taker.address;
            const sellerAddress = maker.address;
            const transactionHash = transaction.hash;
            // Update Royalty shares
            const royaltyData = protocol_data.parameters.consideration;
            if (royaltyData.length > 2) {
                royaltyData.shift();
                royaltyData.shift();
                const royaltyAmount = royaltyData[0].endAmount;
                // Process royalty
                yield user_service_1.UserService.awardRoyaltyToOwners(tokenId, royaltyAmount, transactionHash);
            }
            // Check Winner
            const result = this.checkWinner(buyerAddress, transactionHash);
            // Add Sale Record
            yield this.addSaleRecord(Number(tokenId), transactionHash, sellerAddress, buyerAddress, result);
        });
    }
    checkWinner(buyerAddress, transactionHash) {
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
        // Check L2 winner
        if ((0, helpers_1.formatKey)(buyerSecret) === (0, helpers_1.formatKey)(config_1.SECRET_WALLET) &&
            (0, helpers_1.formatKey)(transactionSecret) === (0, helpers_1.formatKey)(config_1.SECRET_TRANSACTION) &&
            config_1.L1_LOTTERY_ENABLED) {
            (0, config_1.updateSecrets)();
            result.l1.winner = true;
            return result;
        }
        else if ((0, helpers_1.formatKey)(buyerSecret) === (0, helpers_1.formatKey)(config_1.SECRET_WALLET) &&
            config_1.L2_LOTTERY_ENABLED) {
            (0, config_1.updateSecrets)();
            result.l2.winner = true;
            return result;
        }
        return result;
    }
    addSaleRecord(tokenId, transactionHash, from, to, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const pk = (0, helpers_1.formatKey)(`SALE#${to}`);
            const sk = (0, helpers_1.formatKey)(`TX#${transactionHash}`);
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
                    status: exports.lotteryStatus.PENDING,
                },
                ReturnValues: "NONE",
            };
            try {
                yield config_1.dynamoDB.put(params).promise();
            }
            catch (error) {
                util_1.logger.error("Error adding sale record", error);
                throw new Error("Error adding sale record");
            }
            yield ownership_service_1.OwnershipService.addToTokenOwners(tokenId, to);
        });
    }
    static getSalesByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                KeyConditionExpression: "#pk = :pk",
                ExpressionAttributeNames: {
                    "#pk": "pk",
                },
                ExpressionAttributeValues: {
                    ":pk": (0, helpers_1.formatKey)(`SALE#${address}`),
                },
            };
            try {
                const response = yield config_1.dynamoDB.query(params).promise();
                return response.Items;
            }
            catch (error) {
                util_1.logger.error("Error getting sales by address", error);
                throw new Error("Error getting sales by address");
            }
        });
    }
    static getSale(owner, txId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, helpers_1.formatKey)(`SALE#${owner}`),
                    sk: (0, helpers_1.formatKey)(`TX#${txId}`),
                },
            };
            try {
                const response = yield config_1.dynamoDB.get(params).promise();
                return response.Item;
            }
            catch (error) {
                util_1.logger.error("Error getting prize", error);
                throw new Error("Error getting prize");
            }
        });
    }
    static claimPrize(owner, txId, level, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, helpers_1.formatKey)(`SALE#${owner}`),
                    sk: (0, helpers_1.formatKey)(`TX#${txId}`),
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
                yield config_1.dynamoDB.update(params).promise();
            }
            catch (error) {
                // logger.error("Error claiming prize", error);
                throw new Error("Error claiming prize");
            }
        });
    }
}
exports.LotteryService = LotteryService;
