"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const locationRouter = __importStar(require("./resources/location"));
const userRouter = __importStar(require("./resources/user"));
const puskesmasRouter = __importStar(require("./resources/puskesmas"));
const videomateriRouter = __importStar(require("./resources/videomateri"));
const resource_route_1 = require("../resource-route");
const middlewares_1 = require("../middlewares");
const apiRouter = express_1.default.Router();
apiRouter.use('/auth', auth_1.default);
// resources api
apiRouter.use(middlewares_1.paging);
apiRouter.use('/locations', resource_route_1.createResourceRouter(locationRouter));
apiRouter.use('/users', resource_route_1.createResourceRouter(userRouter));
apiRouter.use('/puskesmas', resource_route_1.createResourceRouter(puskesmasRouter));
apiRouter.use('/videomateri', resource_route_1.createResourceRouter(videomateriRouter));
exports.default = apiRouter;
