"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const ruid = require("express-ruid");
const morgan_body_1 = __importDefault(require("morgan-body"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const logger_1 = require("./util/logger");
const util_1 = require("./util");
const middleware_1 = require("./middleware");
const express_session_1 = __importDefault(require("express-session"));
exports.app = (0, express_1.default)();
exports.app.use((0, express_session_1.default)({
    secret: "ABCD",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1 * 60 * 60 * 1000,
    },
}));
exports.app.use(ruid());
exports.app.use(express_1.default.json());
(0, morgan_body_1.default)(exports.app, {
    noColors: true,
    prettify: false,
    logRequestId: true,
    stream: new logger_1.LoggingStream(),
    filterParameters: ["password", "access_token", "refresh_token", "id_token"],
});
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use("/", routes_1.AppRouter);
exports.app.use((req, res, next) => next(new util_1.NotFoundError()));
exports.app.use(middleware_1.errorHandler);
exports.app.set("port", config_1.appConfig.port);
