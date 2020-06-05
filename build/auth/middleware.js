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
exports.authorize = exports.authenticateV1 = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
function authenticateV1(req, res, next) {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.id) {
        return next();
    }
    return next(http_errors_1.default(401));
}
exports.authenticateV1 = authenticateV1;
function authorize(compareFn) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (compareFn(req)) {
                return next();
            }
            return next(http_errors_1.default(403));
        });
    };
}
exports.authorize = authorize;
/* passport.use(
  new Strategy((username, password, done) => {
    return signin({ username, password })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  })
);
 */
