"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../auth/auth");
const router = express_1.default.Router();
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.isLoggedIn) {
        return res.status(200).json({
            message: 'success',
        });
    }
    const { username, password } = req.body;
    try {
        const ret = yield auth_1.signin({ username, password });
        if (req.session) {
            req.session.isLoggedIn = true;
            req.session.user = { id: ret.id, user_type: ret.user_type };
        }
        return res.status(200).json({
            message: 'success',
        });
    }
    catch ({ code, message }) {
        return res.status(400).json({
            code,
            message,
        });
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if ((_b = req.session) === null || _b === void 0 ? void 0 : _b.isLoggedIn) {
        return res.status(400).json({
            message: 'logout required',
        });
    }
    try {
        const ret = yield auth_1.signup(req.body);
        if (req.session) {
            req.session.user = { id: ret.id, user_type: ret.user_type };
        }
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                user_id: ret.id,
            },
        });
    }
    catch ({ code, message }) {
        return res.status(400).json({
            code,
            message,
        });
    }
}));
router.post('/signout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    (_c = req.session) === null || _c === void 0 ? void 0 : _c.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: err.message,
            });
        }
        return res.status(200).json({
            message: 'logout success',
        });
    });
}));
exports.default = router;
