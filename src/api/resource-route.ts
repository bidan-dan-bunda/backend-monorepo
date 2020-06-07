import { Model } from 'sequelize';
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

export interface UploadDescription {
  path?: string;
  callback?: UploadCallback;
  httpCode?: number;
  responseMessage?: string;
}

export interface RouteDefinition {
  route?: string;
  method?: string;
  handler?: RequestHandler;
  middleware?: RequestHandler[] | RequestHandler;
  validateRequest?: ResourceHandler;
  load?: ResourceHandler;
  create?: ResourceHandler;
  edit?: ResourceHandler;
  destroy?: ResourceHandler;
  upload?: UploadDescription;
}

export type Route = RouteDefinition | RequestHandler;

function toArray(thing: any) {
  if (!thing || Array.isArray(thing)) {
    return thing;
  }
  return [thing];
}

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
      .status(uploadDescription.httpCode || 202)
      .json({ message: uploadDescription.responseMessage || 'uploading' });
  };
}

function createHandler(
  h: ResourceHandler,
  {
    retrieveData,
    createData,
    destroyData,
    validate,
  }: { [key: string]: any } = {},
  {
    statusCodeOnException = 500,
    statusCodeOnSuccess = 200,
    statusCodeOnDataCreated = 201,
    statusCodeOnNoData = 404,
    statusCodeOnValidateFail = 400,
  }: { [key: string]: number } = {},
  {
    messageOnNoData = 'no data',
    messageOnException,
  }: { [key: string]: any } = {},

  ...params: any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (validate) {
      statusCodeOnException = statusCodeOnValidateFail;
    }
    if (createData) {
      statusCodeOnSuccess = statusCodeOnDataCreated;
    }

    function end(statusCode: number, responseBody: any) {
      res.status(statusCode);
      if (responseBody && !destroyData) {
        return res.json(responseBody);
      }
      return res.json({ message: 'success' });
    }

    try {
      const ret = h(req, res.locals, req.params, ...params) as
        | Promise<any>
        | any;
      if (isPromise(ret)) {
        try {
          const val = (await ret) as any;
          if (!val && retrieveData) {
            return end(statusCodeOnNoData, { message: messageOnNoData });
          }
          return end(statusCodeOnSuccess, val);
        } catch (err) {
          return next(
            createError(
              statusCodeOnException,
              messageOnException || err.message
            )
          );
        }
      }
      if (!ret) {
        return end(statusCodeOnNoData, { message: messageOnNoData });
      }
      return end(statusCodeOnSuccess, ret);
    } catch (err) {
      return next(
        createError(statusCodeOnException, messageOnException || err.message)
      );
    }
  };
}

function createResourceLoadHandler(load: ResourceHandler) {
  return createHandler(load, { retrieveData: true });
}

function createResourceCreateHandler(create: ResourceHandler) {
  return createHandler(create, { createData: true });
}

function createResourceEditHandler(edit: ResourceHandler) {
  return createHandler(edit);
}

function createResourceDestroyHandler(destroy: ResourceHandler) {
  return createHandler(destroy, { destroyData: true });
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

function getHandlers(route: Route) {
  if (typeof route == 'function') {
    return route;
  }
  const handlers = [];
  for (const key in route) {
    const prop = route[key as keyof RouteDefinition];
    if (key == 'handler') {
      handlers.push(prop);
    }
    if (key in mapPropNameToHandlerCreator) {
      handlers.push((mapPropNameToHandlerCreator as any)[key](prop));
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
    const handlers = toArray(getHandlers(routes[action]));

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
