"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingStream = exports.logger = exports.winstonLogger = void 0;
const winston_1 = __importDefault(require("winston"));
// import { AiTransport } from "./ai-transport";
const config_1 = require("../config");
const stream_1 = __importDefault(require("stream"));
const level = config_1.environment === "production" ? "info" : "debug";
const options = {
    transports: [
        new winston_1.default.transports.Console({
            level,
        }),
        new winston_1.default.transports.File({
            filename: ".logs/error.log",
            level: "error",
        }),
        new winston_1.default.transports.File({ filename: ".logs/combined.log" }),
    ],
};
// const winstonLogger = winston.createLogger(options);
exports.winstonLogger = winston_1.default.createLogger(options);
const logMessage = (level, code, message) => {
    if (typeof message === "object") {
        try {
            message =
                message instanceof Error
                    ? JSON.stringify(message, Object.getOwnPropertyNames(message))
                    : JSON.stringify(message);
        }
        catch (e) {
            message = `logger could not stringify ${message}`;
        }
    }
    exports.winstonLogger[level]({ code, message });
};
class Logger {
    // getAiClient() {
    //   return aIclient;
    // }
    info(code, message) {
        logMessage("info", code, message);
    }
    debug(code, message) {
        logMessage("debug", code, message);
    }
    error(code, message) {
        logMessage("error", code, message);
    }
    trackEvent(name, data) { }
}
exports.logger = new Logger();
//write(chunk: any, cb?: (error: Error | null | undefined) => void): boolean;
class LoggingStream extends stream_1.default.Writable {
    write(chunk) {
        exports.winstonLogger.info(chunk);
        return true;
    }
}
exports.LoggingStream = LoggingStream;
