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
exports.createResourceRouter = void 0;
const constants_1 = require("./../constants");
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const is_promise_1 = __importDefault(require("is-promise"));
const path_1 = __importDefault(require("path"));
const fileupload_1 = require("../fileupload");
const mapActionsToMethods = {
    index: 'get',
    show: 'get',
    create: 'post',
    edit: 'put',
    destroy: 'delete',
};
const mapActionsToRoutesDefaults = {
    index: '/',
    show: '/:id',
    create: '/',
    edit: '/:id',
    destroy: '/:id',
};
function toArray(thing) {
    if (!thing || Array.isArray(thing)) {
        return thing;
    }
    return [thing];
}
function createUploadHandler(uploadDescription) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = path_1.default.resolve(uploadDescription.path || constants_1.ROOT_PATH, req.file.path);
            fileupload_1.upload(filename).then((res) => uploadDescription.callback && uploadDescription.callback(req, res));
            return res
                .status(uploadDescription.httpCode || 202)
                .json({ message: uploadDescription.responseMessage || 'uploading' });
        });
    };
}
function createHandler(h, { retrieveData, createData, validate } = {}, { statusCodeOnException = 500, statusCodeOnSuccess = 200, statusCodeOnDataCreated = 201, statusCodeOnNoData = 404, statusCodeOnValidateFail = 400, } = {}, { messageOnNoData = 'no data', messageOnException, } = {}, ...params) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (validate) {
                statusCodeOnException = statusCodeOnValidateFail;
            }
            if (createData) {
                statusCodeOnSuccess = statusCodeOnDataCreated;
            }
            try {
                const ret = h(req, res.locals, req.params, ...params);
                if (is_promise_1.default(ret)) {
                    try {
                        const val = (yield ret);
                        if (!val && retrieveData) {
                            return res
                                .status(statusCodeOnNoData)
                                .json({ message: messageOnNoData });
                        }
                        return res.status(statusCodeOnSuccess).json(val);
                    }
                    catch (err) {
                        return next(http_errors_1.default(statusCodeOnException, messageOnException || err.message));
                    }
                }
                if (!ret) {
                    return res
                        .status(statusCodeOnNoData)
                        .json({ message: messageOnNoData });
                }
                return res.status(statusCodeOnSuccess).json(ret);
            }
            catch (err) {
                return next(http_errors_1.default(statusCodeOnException, messageOnException || err.message));
            }
        });
    };
}
function createResourceLoadHandler(load) {
    return createHandler(load, { retrieveData: true });
}
function createResourceCreateHandler(create) {
    return createHandler(create, { createData: true });
}
function createResourceEditHandler(edit) {
    return createHandler(edit);
}
function createResourceDestroyHandler(destroy) {
    return createHandler(destroy);
}
function createValidateRequestMiddleware(validateRequest) {
    return createHandler(validateRequest, { validate: true });
}
const mapPropNameToHandlerCreator = {
    load: createResourceLoadHandler,
    create: createResourceCreateHandler,
    edit: createResourceEditHandler,
    destroy: createResourceDestroyHandler,
    upload: createUploadHandler,
};
function getHandlers(route) {
    if (typeof route == 'function') {
        return route;
    }
    const handlers = [];
    for (const key in route) {
        const prop = route[key];
        if (key == 'handler') {
            handlers.push(prop);
        }
        if (key in mapPropNameToHandlerCreator) {
            handlers.push(mapPropNameToHandlerCreator[key](prop));
        }
    }
    return handlers;
}
function createResourceRouter(routes) {
    const router = express_1.default.Router();
    for (const action in routes) {
        const route = routes[action];
        const method = route.method || mapActionsToMethods[action];
        const routeURL = route.route || mapActionsToRoutesDefaults[action];
        const handlers = toArray(getHandlers(routes[action]));
        if (method && handlers) {
            const middleware = toArray(route.middleware);
            if (middleware) {
                middleware
                    .filter((midd) => typeof midd == 'function')
                    .forEach((midd) => {
                    router[method](routeURL, midd);
                });
            }
            const validateRequest = route.validateRequest;
            if (validateRequest) {
                router[method](routeURL, createValidateRequestMiddleware(validateRequest));
            }
            if (Array.isArray(handlers)) {
                handlers.forEach((handler) => {
                    router[method](routeURL, handler);
                });
            }
        }
    }
    return router;
}
exports.createResourceRouter = createResourceRouter;
