import { Request, Response } from "express";
import { SuccessResponse } from "../../util";
import { SiweMessage, generateNonce } from "siwe";

export class SIWEController {
  static getNonce(req: Request, res: Response) {
    let nonce;
    const visited = req.session?.visited ?? false;
    if (!visited) {
      console.log("Not visited");
      req.session.visited = true;
      nonce = generateNonce();
      req.session.nonce = nonce;
    } else {
      console.log("Visited");
      nonce = req.session.nonce;
    }

    const response = new SuccessResponse(res, "Nonce.", {
      nonce,
    });
    return response.send();
  }

  static async verifyMessage(req: Request, res: Response) {
    const { message, signature } = req.body;
    const siweMessage = new SiweMessage(message);
    try {
      const v = await siweMessage.verify({ signature });
      console.log("Verify Result:", v);
      res.send(true);
    } catch {
      res.send(false);
    }
  }
}
