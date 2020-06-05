"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const session_1 = __importDefault(require("./auth/session"));
require("./auth/middleware");
const database_1 = __importDefault(require("./orm/database"));
database_1.default.initializeModels();
const index_1 = __importDefault(require("./api/v1/index"));
const index_2 = __importDefault(require("./api/v2/index"));
const app = express_1.default();
/* == TODOS == */
// -> Better REST API routes handling
// -> Create rate-limiting middleware
// -> Create REST API security middlewares
// -> Improve session management
app.use(morgan_1.default('dev'));
app.use(helmet_1.default());
app.use(express_1.default.json({ limit: '5MB' }));
app.use(cookie_parser_1.default());
// session
app.use(session_1.default);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api/v1', index_1.default);
app.use('/api/v2', index_2.default);
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err);
});
exports.default = app;
