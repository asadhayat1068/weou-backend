"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedResponse = exports.SuccessResponse = exports.BadRequestResponse = exports.InternalErrorResponse = exports.NotFoundResponse = void 0;
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["SUCCESS"] = 200] = "SUCCESS";
    ResponseStatus[ResponseStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ResponseStatus[ResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ResponseStatus[ResponseStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    ResponseStatus[ResponseStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseStatus[ResponseStatus["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(ResponseStatus || (ResponseStatus = {}));
class ApiResponse {
    constructor(res, statusCode, message, data = null) {
        this.res = res;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
    send() {
        this.res.status(this.statusCode).json({
            requestLogId: this.res.get("id"),
            data: this.data,
            message: this.message,
        });
    }
}
class NotFoundResponse extends ApiResponse {
    constructor(res, message = "Not Found") {
        super(res, ResponseStatus.NOT_FOUND, message);
    }
}
exports.NotFoundResponse = NotFoundResponse;
class InternalErrorResponse extends ApiResponse {
    constructor(res, message = "Unkown error occurred") {
        super(res, ResponseStatus.INTERNAL_ERROR, message);
    }
}
exports.InternalErrorResponse = InternalErrorResponse;
class BadRequestResponse extends ApiResponse {
    constructor(res, message) {
        super(res, ResponseStatus.BAD_REQUEST, message);
    }
}
exports.BadRequestResponse = BadRequestResponse;
class SuccessResponse extends ApiResponse {
    constructor(res, message, data) {
        super(res, ResponseStatus.SUCCESS, message, data);
    }
}
exports.SuccessResponse = SuccessResponse;
class UnauthorizedResponse extends ApiResponse {
    constructor(res, message) {
        super(res, ResponseStatus.UNAUTHORIZED, message);
    }
}
exports.UnauthorizedResponse = UnauthorizedResponse;
