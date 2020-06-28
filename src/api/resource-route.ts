import { DEFAULT_UPLOAD_PATH } from './../constants';
import createError from 'http-errors';
import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import isPromise from 'is-promise';
import path from 'path';
import { upload } from '../fileupload';
import { UploadApiResponse } from 'cloudinary';
import * as HttpStatusCodes from 'http-status-codes';
import { toArray } from '../utils';

const mapActionsToMethods: { [action: string]: string } = {
  index: 'get',
  show: 'get',
  create: 'post',
  edit: 'put',
  destroy: 'delete',
};

const mapActionsToRoutesDefaults: { [action: string]: string } = {
  index: '/',
  show: '/:id',
  create: '/',
  edit: '/:id',
  destroy: '/:id',
};

export interface ResourceHandler {
  (req: Request, ...params: any): Promise<any> | any;
}

export interface UploadCallback {
  (req: Request, res: UploadApiResponse): Promise<any> | any;
}

export interface PostHandler {
  (req: Request, error: any): Promise<any> | any;
}

export interface UploadDescription {
  path?: string;
  callback?: UploadCallback;
  httpCode?: number;
  responseMessage?: string;
}

export interface RouteDefinition {
  route?: string | RegExp;
  method?: string;
  handler?: RequestHandler;
  middleware?: RequestHandler[] | RequestHandler;
  validateRequest?: ResourceHandler;
  load?: ResourceHandler;
  create?: ResourceHandler;
  edit?: ResourceHandler;
  destroy?: ResourceHandler;
  upload?: UploadDescription;
  post?: PostHandler;
}

export type Route = RouteDefinition | RequestHandler;

function createUploadHandler(uploadDescription: UploadDescription) {
  return async function (req: Request, res: Response) {
    const filename = path.resolve(
      uploadDescription.path || DEFAULT_UPLOAD_PATH,
      req.file.filename
    );
    upload(filename).then(
      (res) =>
        uploadDescription.callback && uploadDescription.callback(req, res)
    );
    return res
      .status(uploadDescription.httpCode || HttpStatusCodes.ACCEPTED)
      .json({
        message:
          uploadDescription.responseMessage ||
          HttpStatusCodes.getStatusText(HttpStatusCodes.ACCEPTED),
      });
  };
}

function createHandler(
  h: ResourceHandler,
  {
    retrieveData,
    createData,
    destroyData,
    editData,
    validate,
  }: { [key: string]: any } = {},
  {
    statusCodeOnException = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    statusCodeOnSuccess = HttpStatusCodes.OK,
    statusCodeOnDataCreated = HttpStatusCodes.CREATED,
    statusCodeOnDataDestroyed = HttpStatusCodes.NO_CONTENT,
    statusCodeOnNoData = HttpStatusCodes.NOT_FOUND,
    statusCodeOnValidateFail = HttpStatusCodes.BAD_REQUEST,
  }: { [key: string]: number } = {},
  {
    messageOnException = HttpStatusCodes.getStatusText(
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ),
    messageOnSuccess = HttpStatusCodes.getStatusText(HttpStatusCodes.OK),
    messageOnDataCreated = HttpStatusCodes.getStatusText(
      HttpStatusCodes.CREATED
    ),
    messageOnDataDestroyed = HttpStatusCodes.getStatusText(
      HttpStatusCodes.NO_CONTENT
    ),
    messageOnNoData = HttpStatusCodes.getStatusText(HttpStatusCodes.NOT_FOUND),
    messageOnValidateFail = HttpStatusCodes.getStatusText(
      HttpStatusCodes.BAD_REQUEST
    ),
  }: { [key: string]: any } = {},
  postHandler?: PostHandler,
  ...params: any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (validate) {
      statusCodeOnException = statusCodeOnValidateFail;
      messageOnException = messageOnValidateFail;
    }
    if (createData) {
      statusCodeOnSuccess = statusCodeOnDataCreated;
      messageOnSuccess = messageOnDataCreated;
    }

    function end(statusCode: number, responseBody?: any) {
      res.status(statusCode);

      if (statusCode == statusCodeOnNoData) {
        return res.json({ message: messageOnNoData });
      }

      if (responseBody) {
        if (createData || retrieveData) {
          return res.json({ data: responseBody, pages: res.locals.page.pages });
        }
      }

      return res.json({ message: messageOnSuccess });
    }

    let error = null;
    try {
      const ret = h(req, res.locals, req.params, ...params) as
        | Promise<any>
        | any;
      if (isPromise(ret)) {
        const val = (await ret) as any;
        if (!val && validate) {
          return next();
        }

        if (!val && (retrieveData || editData || destroyData)) {
          return next(createError(statusCodeOnNoData));
        }
        return end(statusCodeOnSuccess, val);
      }
      if (!ret && validate) {
        return next();
      }

      if (!ret && (retrieveData || editData || destroyData)) {
        return next(createError(statusCodeOnNoData));
      }
      return end(statusCodeOnSuccess, ret);
    } catch (err) {
      error = err;
      return next(
        createError(statusCodeOnException, err.message || messageOnException)
      );
    } finally {
      postHandler && postHandler(req, error);
    }
  };
}

function createResourceLoadHandler(load: ResourceHandler, post?: PostHandler) {
  return createHandler(load, { retrieveData: true }, {}, {}, post);
}

function createResourceCreateHandler(
  create: ResourceHandler,
  post?: PostHandler
) {
  return createHandler(create, { createData: true }, {}, {}, post);
}

function createResourceEditHandler(edit: ResourceHandler, post?: PostHandler) {
  return createHandler(edit, { editData: true }, {}, {}, post);
}

function createResourceDestroyHandler(
  destroy: ResourceHandler,
  post?: PostHandler
) {
  return createHandler(destroy, { destroyData: true }, {}, {}, post);
}

function createValidateRequestMiddleware(validateRequest: ResourceHandler) {
  return createHandler(validateRequest, { validate: true });
}

const mapPropNameToHandlerCreator = {
  load: createResourceLoadHandler,
  create: createResourceCreateHandler,
  edit: createResourceEditHandler,
  destroy: createResourceDestroyHandler,
  upload: createUploadHandler,
};

function getHandlers(route: Route, post?: PostHandler) {
  if (typeof route == 'function') {
    return route;
  }
  const handlers = [];
  for (const key in route) {
    const prop = route[key as keyof RouteDefinition];
    if (key == 'handler') {
      handlers.push(prop);
    }
    if (key in mapPropNameToHandlerCreator && typeof prop == 'function') {
      handlers.push((mapPropNameToHandlerCreator as any)[key](prop, post));
    }
  }
  return handlers;
}

export function createResourceRouter(routes: {
  [action: string]: RequestHandler | Route;
}) {
  const router = express.Router();
  for (const action in routes) {
    const route = routes[action] as RouteDefinition;
    const method = route.method || mapActionsToMethods[action];
    const routeURL = route.route || mapActionsToRoutesDefaults[action];
    const handlers = toArray(getHandlers(routes[action], route.post));

    if (method && handlers) {
      const middleware = toArray(route.middleware) as RequestHandler[];
      if (middleware) {
        middleware
          .filter((midd) => typeof midd == 'function')
          .forEach((midd) => {
            (router as any)[method](routeURL, midd);
          });
      }

      const validateRequest = route.validateRequest;
      if (validateRequest) {
        (router as any)[method](
          routeURL,
          createValidateRequestMiddleware(validateRequest)
        );
      }

      if (Array.isArray(handlers)) {
        handlers.forEach((handler) => {
          (router as any)[method](routeURL, handler);
        });
      }
    }
  }
  return router;
}
