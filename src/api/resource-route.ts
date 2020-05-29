import express, { RequestHandler, Request, Response } from 'express';
import isPromise from 'is-promise';
import { ResourcePage } from './middlewares';

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

export interface LoadHandler {
  (req: Request, page: ResourcePage, ...params: any): Promise<any> | any;
}

export interface CreateHandler {
  (req: Request, values: any, ...params: any): Promise<any> | any;
}

export interface EditHandler {
  (req: Request, id: any, values: any, ...params: any): Promise<any> | any;
}

export interface DestroyHandler {
  (req: Request, id: any, ...params: any): Promise<any> | any;
}

interface Route {
  route: string;
  method?: string;
  handler?: RequestHandler;
  load?: LoadHandler;
  create?: CreateHandler;
  edit?: EditHandler;
  destroy?: DestroyHandler;
}

function createResourceLoadHandler(load: LoadHandler) {
  return async function (req: Request, res: Response) {
    const { offset, limit } = (req as any).data;
    const ret = load(req, { offset, limit }, req.params);
    if (isPromise(ret)) {
      return res.json(await ret);
    }
    return res.json(ret);
  };
}

export function createResourceRouter(routes: {
  [action: string]: RequestHandler | Route;
}) {
  const router = express.Router();
  for (const action in routes) {
    const routeObj = routes[action];
    const method = mapActionsToMethods[action] || (routeObj as Route).method;
    const route =
      mapActionsToRoutesDefaults[action] || (routeObj as Route).route;
    const handler =
      typeof routes[action] == 'function'
        ? routes[action]
        : (routeObj as Route).load
        ? createResourceLoadHandler((routeObj as Route).load as LoadHandler)
        : (routeObj as Route).handler;
    (router as any)[method as string](route, handler);
  }
  return router;
}
