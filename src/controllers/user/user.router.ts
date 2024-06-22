import express from "express";
import { UserController } from "./user.controller";

export const UserRouter = express.Router();

UserRouter.post("/tokens", [UserController.getTokensOwned]);
UserRouter.post("/update-address", [UserController.updateAddress]);
UserRouter.post("/get-address", [UserController.getAddress]);
