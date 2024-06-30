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
exports.SiweService = void 0;
const siwe_1 = require("siwe");
const base_service_1 = require("./base-service");
class SiweService extends base_service_1.BaseService {
    static verify(message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const siweMessage = new siwe_1.SiweMessage(message);
            const v = yield siweMessage.verify({
                signature,
            });
            return v;
        });
    }
}
exports.SiweService = SiweService;
