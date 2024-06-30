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
}
exports.UserService = UserService;
