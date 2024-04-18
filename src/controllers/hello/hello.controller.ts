import { Request, Response } from "express";
import { SuccessResponse } from "../../util";

export class HelloController {
  static sayHello(req: Request, res: Response) {
    const response = new SuccessResponse(res, "Hello response message.", {
      test: "test",
    });

    return response.send();
  }

  static catchHook(req: Request, res: Response) {
    console.log(req.body);

    const response = new SuccessResponse(res, "Hello response message.", {
      test: "test",
    });

    return response.send();
  }
}
