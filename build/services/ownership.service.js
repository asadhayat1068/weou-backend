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
exports.OwnershipService = void 0;
const ethers_1 = require("ethers");
const config_1 = require("../config");
const base_service_1 = require("./base-service");
const util_1 = require("../util");
class OwnershipService extends base_service_1.BaseService {
    /**
     * async transferOwnership
     */
    static addOwnership(to, tokenId, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                Item: {
                    pk: (0, util_1.formatKey)(`owner#${to}`),
                    sk: (0, util_1.formatKey)(`token#${tokenId}`),
                    tokenId,
                    tokenOwner: to,
                    timestamp,
                },
                ReturnValues: "NONE",
            };
            try {
                yield config_1.dynamoDB.put(params).promise();
            }
            catch (error) {
                util_1.logger.error("Error transferring ownership", error);
                throw new Error("Error transferring ownership");
            }
        });
    }
    static removeOwnership(from, tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, util_1.formatKey)(`owner#${from}`),
                    sk: (0, util_1.formatKey)(`token#${tokenId}`),
                },
                ReturnValues: "NONE",
            };
            try {
                yield config_1.dynamoDB.delete(params).promise();
            }
            catch (error) {
                util_1.logger.error("Error transferring ownership", error);
                throw new Error("Error transferring ownership");
            }
        });
    }
    /**
     * async transferOwnership
     * @param from: string - from address
     * @param to: string - to address
     * @param tokenId: string - token id
     * @returns Promise<void>
     */
    static transferOwnership(from, to, tokenId, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // if from is address zero then add ownership
                if (from === ethers_1.ZeroAddress) {
                    yield this.addOwnership(to, tokenId, timestamp);
                    return;
                }
                yield this.removeOwnership(from, tokenId);
                yield this.addOwnership(to, tokenId, timestamp);
            }
            catch (error) {
                util_1.logger.error("Error transferring ownership", error);
                throw new Error("Error transferring ownership");
            }
        });
    }
    /**
     * async getTokensByOwner
     * @param ownerAddress: string - owner address
     * @returns Promise<any> - list of tokens owned by the owner
     * @throws Error - error getting ownership
     * @description Get tokens by owner
     */
    static getTokensByOwner(ownerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: "weou",
                KeyConditionExpression: "#pk = :pk and begins_with(#sk, :skPrefix)",
                ExpressionAttributeNames: {
                    "#pk": "pk",
                    "#sk": "sk",
                },
                ExpressionAttributeValues: {
                    ":pk": (0, util_1.formatKey)(`owner#${ownerAddress}`),
                    ":skPrefix": (0, util_1.formatKey)("token#"),
                },
            };
            try {
                const data = yield config_1.dynamoDB.query(params).promise();
                return data.Items;
            }
            catch (error) {
                util_1.logger.error("Error getting ownership", error);
                throw new Error("Error getting ownership");
            }
        });
    }
    static getTokenOwners(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current token owners list
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, util_1.formatKey)(`token#${tokenId}`),
                    sk: (0, util_1.formatKey)(`ownersList#${tokenId}`),
                },
            };
            const response = yield config_1.dynamoDB.get(params).promise();
            return response.Item || { owners: [] };
        });
    }
    static addToTokenOwners(tokenId, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current token owners list
            let owners = yield this.getTokenOwners(tokenId);
            owners = owners.owners || [];
            // Add new owner to the list
            do {
                const i = owners.indexOf(walletAddress);
                if (i !== -1) {
                    owners.splice(i, 1);
                }
                else {
                    break;
                }
            } while (true);
            owners.push(walletAddress);
            // Update owners list
            const params = {
                TableName: "weou",
                Key: {
                    pk: (0, util_1.formatKey)(`token#${tokenId}`),
                    sk: (0, util_1.formatKey)(`ownersList#${tokenId}`),
                },
                UpdateExpression: "set owners = :owners",
                ExpressionAttributeValues: {
                    ":owners": owners,
                },
                ReturnValues: "NONE",
            };
            yield config_1.dynamoDB.update(params).promise();
        });
    }
}
exports.OwnershipService = OwnershipService;
