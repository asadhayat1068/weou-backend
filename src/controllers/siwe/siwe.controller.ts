import { Request, Response } from "express";
import { InternalErrorResponse, SuccessResponse } from "../../util";
import { SiweMessage, generateNonce } from "siwe";

export class SIWEController {
  static getNonce(req: Request, res: Response) {
    let nonce;
    const visited = req.session?.visited ?? false;
    if (!visited) {
      req.session.visited = true;
      nonce = generateNonce();
      req.session.nonce = nonce;
    } else {
      nonce = req.session.nonce;
    }

    const response = new SuccessResponse(res, "Nonce.", {
      nonce,
    });
    return response.send();
  }

  static async verifyMessage(req: Request, res: Response) {
    const { message, signature, account } = req.body;
    try {
      const siweMessage = new SiweMessage(message);
      const v = await siweMessage.verify({
        signature,
      });
      //   res.send(true);
      const response = new SuccessResponse(res, "Verify.", {
        message,
        signature,
        account,
      });
      response.send();
    } catch (e) {
      const response = new SuccessResponse(res, "Internal Error", e);
      response.send();
    }
  }
}
