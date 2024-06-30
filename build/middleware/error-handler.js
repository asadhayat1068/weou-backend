"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const util_1 = require("../util");
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof util_1.AppError) {
        util_1.AppError.handle(error, res);
        return;
    }
    error.requestId = _req.params.id;
    util_1.logger.error("APP_ERROR", error);
    util_1.AppError.handle(new util_1.InternalError(error.message), res);
    return;
};
exports.errorHandler = errorHandler;
