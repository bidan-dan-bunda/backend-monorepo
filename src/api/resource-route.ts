import { ResourcePage } from './middlewares';
import express, { RequestHandler, Request, Response } from 'express';

const mapActionsToMethods: { [action: string]: string } = {
  index: 'get',
  create: 'post',
  edit: 'put',
  destroy: 'delete',
};

const mapActionsToRoutesDefaults: { [action: string]: string } = {
  index: '/',
  create: '/',
  edit: '/:id',
  destroy: '/:id',
};

export interface Loader {
  (paging: ResourcePage, ...params: any[]): Promise<any> | any;
}

interface RouteObject {
  route: string;
  method?: string;
  loader?: Function;
  handler?: RequestHandler;
}

function createLoaderHandler(loader: Loader) {
  return async function (req: Request, res: Response) {
    const { offset, limit } = (req as any).data;
    const ret = loader({ offset, limit });
    if (ret instanceof Promise) {
      return res.json(await ret);
    }
    return res.json(ret);
  };
}

export function createResourceRouter(routes: {
  [action: string]: RequestHandler | RouteObject;
}) {
  const router = express.Router();
  for (const action in routes) {
    const routeObj = routes[action];
    const method =
      mapActionsToMethods[action] || (routeObj as RouteObject).method;
    const route =
      mapActionsToRoutesDefaults[action] || (routeObj as RouteObject).route;
    const handler =
      typeof routes[action] == 'function'
        ? routes[action]
        : (routeObj as RouteObject).loader
        ? createLoaderHandler((routeObj as RouteObject).loader as Loader)
        : (routeObj as RouteObject).handler;
    (router as any)[method as string](route, handler);
  }
  return router;
}
