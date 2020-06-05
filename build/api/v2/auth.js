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
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post('/signin', passport_1.default.authenticate('local'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { username, password } = req.user as any;
    return res.json(req.user);
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_1.signup(req.body);
}));
router.post('/signout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy((err) => {
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
