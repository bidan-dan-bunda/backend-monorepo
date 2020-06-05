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
exports.signup = exports.signin = exports.AuthError = exports.AuthErrorCodes = void 0;
const user_1 = require("../orm/models/user");
const database_1 = __importDefault(require("../orm/database"));
const hash_1 = require("./hash");
var AuthErrorCodes;
(function (AuthErrorCodes) {
    AuthErrorCodes[AuthErrorCodes["USER_PASSWORD_INVALID_COMBINATION"] = 0] = "USER_PASSWORD_INVALID_COMBINATION";
    AuthErrorCodes[AuthErrorCodes["USERNAME_NOT_AVAILABLE"] = 1] = "USERNAME_NOT_AVAILABLE";
})(AuthErrorCodes = exports.AuthErrorCodes || (exports.AuthErrorCodes = {}));
class AuthError extends Error {
    constructor(message, authErrorCode) {
        super(message);
        this.code = authErrorCode;
    }
}
exports.AuthError = AuthError;
const userDb = new database_1.default(user_1.UserDefinition, undefined);
function userExists(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield userDb.model.findOne({ where: { username } });
    });
}
function signin({ username, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userExists(username);
        if (!user) {
            throw new AuthError('User and password combination is invalid', AuthErrorCodes.USER_PASSWORD_INVALID_COMBINATION);
        }
        const compareResult = yield hash_1.compare(password, user.password);
        if (!compareResult) {
            throw new AuthError('User and password combination is invalid', AuthErrorCodes.USER_PASSWORD_INVALID_COMBINATION);
        }
        return user.toJSON();
    });
}
exports.signin = signin;
function validateUserDetail(userDetail) { }
function signup(userDetail) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userExists(userDetail.username);
        if (user) {
            throw new AuthError('username is not available', AuthErrorCodes.USERNAME_NOT_AVAILABLE);
        }
        validateUserDetail(userDetail);
        userDetail.password = yield hash_1.hash(userDetail.password);
        return (yield userDb.model.create(userDetail)).toJSON();
    });
}
exports.signup = signup;
