import express from "express";
import { HelloController } from "./hello.controller";

export const HelloRouter = express.Router();

HelloRouter.get("/", [HelloController.sayHello]);
HelloRouter.post("/webhook", [HelloController.catchHook]);
