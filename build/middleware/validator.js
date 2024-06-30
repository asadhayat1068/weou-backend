"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const util_1 = require("../util");
const validator = (schema, path) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[path]);
        if (error) {
            next(new util_1.BadRequestError(error.message));
            return;
        }
        next();
    };
};
exports.validator = validator;
