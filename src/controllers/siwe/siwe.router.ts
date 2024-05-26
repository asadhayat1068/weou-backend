import express from "express";
import { SIWEController } from "./siwe.controller";

export const HelloRouter = express.Router();

HelloRouter.get("/", [SIWEController.sayHello]);
HelloRouter.post("/webhook", [SIWEController.catchHook]);
