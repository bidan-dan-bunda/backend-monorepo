"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const database_1 = require("../orm/database");
const isProduction = process.env.NODE_ENV == 'production';
const isHttps = (isProduction && process.env.HTTPS_ENABLED);
const useBetterStore = process.env.USE_BETTER_STORE || isProduction;
const SequelizeStore = connect_session_sequelize_1.default(express_session_1.default.Store);
const store = new SequelizeStore({
    db: database_1.getSequelizeInstance(),
});
store.sync();
// express-session configuration
exports.default = express_session_1.default({
    store: useBetterStore && store,
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: isHttps,
        httpOnly: true,
    },
});
