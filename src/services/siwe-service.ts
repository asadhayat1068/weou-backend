import { SiweMessage } from "siwe";
import { BaseService } from "./base-service";

export class SiweService extends BaseService {
  public static async verify(message: any, signature: string) {
    const siweMessage = new SiweMessage(message);
    const v = await siweMessage.verify({
      signature,
    });
    return v;
  }
}
