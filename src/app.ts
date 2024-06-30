import express from "express";
const ruid = require("express-ruid");
import morganBody from "morgan-body";
import cors from "cors";
import { appConfig } from "./config";
import { AppRouter } from "./routes";
import { LoggingStream } from "./util/logger";
import { NotFoundError } from "./util";
import { errorHandler } from "./middleware";
import session from "express-session";
declare module "express-session" {
  interface SessionData {
    visited: boolean;
    nonce: string;
  }
}

export const app: express.Application = express();
app.use(
  session({
    secret: "ABCD",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000,
    },
  })
);
app.use(ruid());
app.use(express.json());
morganBody(app, {
  noColors: true,
  prettify: false,
  logRequestId: true,
  stream: new LoggingStream(),
  filterParameters: ["password", "access_token", "refresh_token", "id_token"],
});
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use("/", AppRouter);
app.use((req, res, next) => next(new NotFoundError()));
app.use(errorHandler);
app.set("port", appConfig.port);
