import { Request, Response } from "express";
import { SuccessResponse } from "../../util";
import { generateNonce } from "siwe";

export class SIWEController {
  static getNonce(req: Request, res: Response) {
    const nonce = generateNonce();
    const response = new SuccessResponse(res, "Nonce.", {
      nonce,
    });
    return response.send();
  }
}
