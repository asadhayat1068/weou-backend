import { Request, Response } from "express";
import { SuccessResponse } from "../../util";
import { AppDataSource } from "../../config";
import { User } from "../../databse/entities/User.entity";

export class HelloController {
  static async sayHello(req: Request, res: Response) {
    const userRepo = AppDataSource.getRepository(User);
    const _user = new User();
    _user.firstName = "John";
    _user.lastName = "Doe";
    _user.email = "jhon@doe.com";
    const user = await userRepo.save(_user);
    const response = new SuccessResponse(res, "New User created.", {
      user,
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
