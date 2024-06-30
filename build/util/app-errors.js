"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.BadRequestError = exports.InternalError = exports.AppError = void 0;
const config_1 = require("../config");
const app_response_1 = require("./app-response");
var ErrorType;
(function (ErrorType) {
    ErrorType["INTERNAL"] = "InternalError";
    ErrorType["NOT_FOUND"] = "NotFoundError";
    ErrorType["NO_ENTRY"] = "NoEntryError";
    ErrorType["NO_DATA"] = "NoDataError";
    ErrorType["BAD_REQUEST"] = "BadRequest";
})(ErrorType || (ErrorType = {}));
const notFound = [ErrorType.NOT_FOUND, ErrorType.NO_ENTRY, ErrorType.NO_DATA];
class AppError extends Error {
    constructor(type, message = "error") {
        super(type);
        this.type = type;
        this.message = message;
    }
    static handle(err, res) {
        if (notFound.includes(err.type)) {
            new app_response_1.NotFoundResponse(res).send();
            return;
        }
        if (err.type === "BadRequest") {
            new app_response_1.BadRequestResponse(res, err.message).send();
            return;
        }
        const message = config_1.environment === "production" ? "Something went wrong." : err.message;
        new app_response_1.InternalErrorResponse(res, message).send();
    }
}
exports.AppError = AppError;
class InternalError extends AppError {
    constructor(message = "Internal error") {
        super(ErrorType.INTERNAL, message);
    }
}
exports.InternalError = InternalError;
class BadRequestError extends AppError {
    constructor(message) {
        super(ErrorType.BAD_REQUEST, message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(ErrorType.NOT_FOUND, message);
    }
}
exports.NotFoundError = NotFoundError;
