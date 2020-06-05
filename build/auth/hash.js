"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
function hash(plain, saltRounds = 12) {
    return bcrypt_1.default.hash(plain, saltRounds);
}
exports.hash = hash;
function compare(plain, hash) {
    return bcrypt_1.default.compare(plain, hash);
}
exports.compare = compare;
