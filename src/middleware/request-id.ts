import { Request, Response, NextFunction } from "express";
import { type } from "os";
import { v4 as uuidV4 } from "uuid";

export const requestId = (
  _req: Request,
  _res: Response,
  _next: NextFunction
): void => {
  const uuid = uuidV4();
  _req.params.id = uuid;
  _res.set("id", uuid);
  _next();
};
