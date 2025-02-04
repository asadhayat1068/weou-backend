import express from "express";
import { SIWEController } from "./siwe.controller";

export const SIWERouter = express.Router();

SIWERouter.get("/nonce", [SIWEController.getNonce]);
SIWERouter.post("/verify", [SIWEController.verifyMessage]);
