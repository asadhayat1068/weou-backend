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
exports.SIWEController = void 0;
const util_1 = require("../../util");
const siwe_1 = require("siwe");
class SIWEController {
    static getNonce(req, res) {
        var _a, _b;
        let nonce;
        const visited = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.visited) !== null && _b !== void 0 ? _b : false;
        if (!visited) {
            req.session.visited = true;
            nonce = (0, siwe_1.generateNonce)();
            req.session.nonce = nonce;
        }
        else {
            nonce = req.session.nonce;
        }
        const response = new util_1.SuccessResponse(res, "Nonce.", {
            nonce,
        });
        return response.send();
    }
    static verifyMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, signature, account } = req.body;
            try {
                const siweMessage = new siwe_1.SiweMessage(message);
                const v = yield siweMessage.verify({
                    signature,
                });
                //   res.send(true);
                const response = new util_1.SuccessResponse(res, "Verify.", {
                    message,
                    signature,
                    account,
                });
                response.send();
            }
            catch (e) {
                const response = new util_1.SuccessResponse(res, "Internal Error", e);
                response.send();
            }
        });
    }
}
exports.SIWEController = SIWEController;
