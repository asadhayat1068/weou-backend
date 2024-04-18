import { Request, Response, NextFunction } from "express";
import { AppError, InternalError, logger } from "../util";
declare interface ErrorWithRequestId extends Error {
  requestId: string;
}

export const errorHandler = (
  error: ErrorWithRequestId,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    AppError.handle(error, res);
    return;
  }
  error.requestId = _req.params.id;
  logger.error("APP_ERROR", error);
  AppError.handle(new InternalError(error.message), res);
  return;
};
