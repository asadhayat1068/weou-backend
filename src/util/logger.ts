import winston from "winston";
// import { AiTransport } from "./ai-transport";
import { appConfig, environment } from "../config";
import stream from "stream";
import path, { format } from "path";

const level = environment === "production" ? "info" : "debug";

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level,
    }),
    new winston.transports.File({
      filename: ".logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: ".logs/combined.log" }),
  ],
};

// const winstonLogger = winston.createLogger(options);
export const winstonLogger = winston.createLogger(options);
type LogLevels = "info" | "debug" | "error";

const logMessage = (level: LogLevels, code: string, message: unknown) => {
  if (typeof message === "object") {
    try {
      message =
        message instanceof Error
          ? JSON.stringify(message, Object.getOwnPropertyNames(message))
          : JSON.stringify(message);
    } catch (e) {
      message = `logger could not stringify ${message}`;
    }
  }
  winstonLogger[level]({ code, message });
};

class Logger {
  // getAiClient() {
  //   return aIclient;
  // }
  info(code: string, message: unknown) {
    logMessage("info", code, message);
  }
  debug(code: string, message: unknown) {
    logMessage("debug", code, message);
  }
  error(code: string, message: unknown) {
    logMessage("error", code, message);
  }
  trackEvent(name: string, data: any) {}
}

export const logger = new Logger();
//write(chunk: any, cb?: (error: Error | null | undefined) => void): boolean;
export class LoggingStream extends stream.Writable {
  write(chunk: unknown) {
    winstonLogger.info(chunk);
    return true;
  }
}
