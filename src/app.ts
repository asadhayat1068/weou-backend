import express from "express";
const ruid = require("express-ruid");
import morganBody from "morgan-body";
import cors from "cors";
import { appConfig } from "./config";
import { AppRouter } from "./routes";
import { LoggingStream } from "./util/logger";
import { NotFoundError } from "./util";
import { errorHandler } from "./middleware";

export const app: express.Application = express();
app.use(ruid());
app.use(express.json());
morganBody(app, {
  noColors: true,
  prettify: false,
  logRequestId: true,
  stream: new LoggingStream(),
  filterParameters: ["password", "access_token", "refresh_token", "id_token"],
});
app.use(cors());
app.use("/", AppRouter);
app.use((req, res, next) => next(new NotFoundError()));
app.use(errorHandler);
app.set("port", appConfig.port);
