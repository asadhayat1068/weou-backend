"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = void 0;
const uuid_1 = require("uuid");
const requestId = (_req, _res, _next) => {
    const uuid = (0, uuid_1.v4)();
    _req.params.id = uuid;
    _res.set("id", uuid);
    _next();
};
exports.requestId = requestId;
