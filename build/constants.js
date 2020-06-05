"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOT_PATH = exports.IS_PRODUCTION = void 0;
const path = require('path');
exports.IS_PRODUCTION = process.env.NODE_ENV == 'production';
exports.ROOT_PATH = path.resolve(__dirname, '../');
