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
exports.UserService = void 0;
const config_1 = require("../config");
const util_1 = require("../util");
const base_service_1 = require("./base-service");
const ownership_service_1 = require("./ownership.service");
class UserService extends base_service_1.BaseService {
    static updateUserAddress(walletAddress, shippingAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, util_1.formatKey)(`user#${walletAddress}`),
                    sk: (0, util_1.formatKey)(`shippingAddress#${walletAddress}`),
                },
                UpdateExpression: "set address = :address",
                ExpressionAttributeValues: {
                    ":address": shippingAddress,
                },
                ReturnValues: "NONE",
            };
            yield config_1.dynamoDB.update(params).promise();
        });
    }
    static getUserAddress(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, util_1.formatKey)(`user#${walletAddress}`),
                    sk: (0, util_1.formatKey)(`shippingAddress#${walletAddress}`),
                },
            };
            const response = yield config_1.dynamoDB.get(params).promise();
            return response.Item;
        });
    }
    static getUserRoyalty(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, util_1.formatKey)(`user#${walletAddress}`),
                    sk: (0, util_1.formatKey)(`royalty#${walletAddress}`),
                },
            };
            const response = yield config_1.dynamoDB.get(params).promise();
            return response.Item || { royalty: 0 };
        });
    }
    static awardRoyalty(walletAddress, tokenId, royaltyAmount, transactionHash) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current royalty amount
            let userCurrentRoyalty = yield this.getUserRoyalty(walletAddress);
            userCurrentRoyalty = userCurrentRoyalty.royalty || 0;
            // Update royalty amount
            royaltyAmount += Number(userCurrentRoyalty);
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, util_1.formatKey)(`user#${walletAddress}`),
                    sk: (0, util_1.formatKey)(`royalty#${walletAddress}`),
                },
                UpdateExpression: "set royalty = :royalty",
                ExpressionAttributeValues: {
                    ":royalty": royaltyAmount,
                },
                ReturnValues: "NONE",
            };
            yield config_1.dynamoDB.update(params).promise();
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
                Item: Object.assign({ pk: (0, util_1.formatKey)(`royalty#${walletAddress}`), sk: (0, util_1.formatKey)(`log#${transactionHash}#${date.getTime()}`) }, royaltyLog),
            };
            yield config_1.dynamoDB.put(logParams).promise();
        });
    }
    static awardRoyaltyToUsers(tokenId, royaltyAmount, transactionHash, owners) {
        owners.forEach((owner) => __awaiter(this, void 0, void 0, function* () {
            yield UserService.awardRoyalty(owner, tokenId, royaltyAmount, transactionHash);
        }));
    }
    static awardRoyaltyToOwners(tokenId, royaltyAmount, transactionHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let owners = yield ownership_service_1.OwnershipService.getTokenOwners(tokenId);
            owners = owners.owners || [];
            if (owners.length === 0) {
                return;
            }
            const latest = owners.pop();
            // Award royalty to latest owner
            const latest_owner_percentage = config_1.LATEST_OWNER_ROYALTY_PERCENTAGE_SHARE / 100;
            this.awardRoyaltyToUsers(tokenId, royaltyAmount * latest_owner_percentage, transactionHash, [latest]);
            // Award royalty to other owners
            const other_owners_percentage = config_1.OTHER_OWNERS_ROYALTY_PERCENTAGE_SHARE / 100;
            this.awardRoyaltyToUsers(tokenId, royaltyAmount * other_owners_percentage, transactionHash, owners);
        });
    }
}
exports.UserService = UserService;
