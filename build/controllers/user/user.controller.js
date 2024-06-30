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
exports.UserController = void 0;
const util_1 = require("../../util");
const ownership_service_1 = require("../../services/ownership.service");
const siwe_service_1 = require("../../services/siwe-service");
const user_service_1 = require("../../services/user.service");
class UserController {
    static getTokensOwned(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletAddress = req.body.walletAddress;
                const tokens = yield ownership_service_1.OwnershipService.getTokensByOwner(walletAddress);
                const response = new util_1.SuccessResponse(res, "Tokens records fetched successfully.", {
                    tokens,
                });
                return response.send();
            }
            catch (error) {
                util_1.logger.error("Error getting user tokens", JSON.stringify({
                    error,
                    route: req.originalUrl,
                    method: req.method,
                }));
                const resp = new util_1.InternalErrorResponse(res, "Error getting tokens");
                return resp.send();
            }
        });
    }
    static updateAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, chainId, message, signature } = req.body;
                const v = yield siwe_service_1.SiweService.verify(message, signature);
                if (!v.success || (0, util_1.formatKey)(address) !== (0, util_1.formatKey)(v.data.address)) {
                    const response = new util_1.InternalErrorResponse(res, "Error verifying message signature");
                    return response.send();
                }
                // Get address from Message
                const userStatement = JSON.parse(v.data.statement || "{}");
                const shippingAddress = userStatement.address;
                if (!shippingAddress) {
                    throw new Error("Invalid shipping address.");
                }
                // Update user address
                user_service_1.UserService.updateUserAddress(address, shippingAddress);
                const response = new util_1.SuccessResponse(res, `Shipping Address for ${address} updated successfully.`, {
                    address,
                    chainId,
                    message,
                    signature,
                });
                return response.send();
            }
            catch (error) {
                const errorMessage = error.error
                    ? error.error.message
                    : "Error updating user address";
                const resp = new util_1.BadRequestResponse(res, errorMessage);
                return resp.send();
            }
        });
    }
    static getAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletAddress = req.body.walletAddress;
                const address = yield user_service_1.UserService.getUserAddress(walletAddress);
                const response = new util_1.SuccessResponse(res, "Address fetched successfully.", address);
                return response.send();
            }
            catch (error) {
                util_1.logger.error("Error getting user address", JSON.stringify({
                    error,
                    route: req.originalUrl,
                    method: req.method,
                }));
                const resp = new util_1.InternalErrorResponse(res, "Error getting address");
                return resp.send();
            }
        });
    }
}
exports.UserController = UserController;
