"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const cache = {};
function getConfig(key) {
    const env = dotenv_1.default.config().parsed;
    if (isEmpty_1.default(cache)) {
        for (const key in env) {
            let value;
            if (!Number.isNaN(Number(env[key]))) {
                value = Number(env[key]);
            }
            else {
                value = env[key];
            }
            cache[key] = value;
        }
    }
    return key ? cache[key] : cache;
}
exports.getConfig = getConfig;
