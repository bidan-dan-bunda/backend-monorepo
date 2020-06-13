import { Request } from 'express';
import { ObjectSchema } from '@hapi/joi';
import Database from '../orm/database';
import { RouteDefinition } from './resource-route';
import { ResourcePage } from './middleware';
import { validateRequest, createMulterMiddleware, countPages } from './common';
import path from 'path';
import { DEFAULT_UPLOAD_PATH } from '../constants';
import { isAdmin } from '../auth/middleware';
import {
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
} from 'sequelize';

interface OptionFn<T, U> {
  (...params: U[]): T;
}

function getOptions<T, U>(options: T, ...params: U[]) {
  if (typeof options == 'function') {
    return options(...params);
  }
  return options;
}

function getDbOptions<T extends object>(
  req: Request,
  dbOptions?: T | OptionFn<T, Request>
) {
  return getOptions(dbOptions, req);
}

export function index(
  db: Database<any>,
  dbOptions?: FindOptions | OptionFn<FindOptions, Request>,
  additionalProps?: RouteDefinition | OptionFn<RouteDefinition, RouteDefinition>
): RouteDefinition {
  let props: RouteDefinition = {
    middleware: (req, res, next) => {
      const optionsDb = getDbOptions<FindOptions>(req, dbOptions);
      res.locals.dbOptions = optionsDb;
      return countPages(db, { ...optionsDb })(req, res, next);
    },
    async load(req, locals, params) {
      return db.load({ ...(locals.page as ResourcePage), ...locals.dbOptions });
    },
  };
  const moreProps = getOptions(additionalProps, props);
  props = { ...props, ...moreProps };
  return props;
}

export function show(
  db: Database<any>,
  dbOptions?: FindOptions | OptionFn<FindOptions, Request>,
  props?: RouteDefinition
): RouteDefinition {
  return {
    route: '/:id',
    method: 'get',
    load(req, locals, params) {
      const optionsDb = getDbOptions<FindOptions>(req, dbOptions);
      return db.model.findByPk(params.id, { ...optionsDb });
    },
    ...props,
  };
}

export function create(
  db: Database<any>,
  schema: ObjectSchema,
  dbOptions?: CreateOptions | OptionFn<CreateOptions, Request>,
  props?: RouteDefinition
): RouteDefinition {
  return {
    validateRequest: validateRequest(schema),
    middleware: isAdmin,
    create(req, locals, params) {
      const optionsDb = getDbOptions<FindOptions>(req, dbOptions);
      return db.create(req.body, { ...optionsDb });
    },
    ...props,
  };
}

export function edit(
  db: Database<any>,
  schema: ObjectSchema,
  dbOptions?: UpdateOptions | OptionFn<UpdateOptions, Request>,
  props?: RouteDefinition
): RouteDefinition {
  return {
    validateRequest: validateRequest(schema),
    middleware: isAdmin,
    edit(req, locals, params) {
      const optionsDb = getDbOptions<FindOptions>(req, dbOptions);
      const body = req.body;
      return db.update(body, { where: { id: params.id }, ...optionsDb });
    },
    ...props,
  };
}

export function destroy(
  db: Database<any>,
  dbOptions?: DestroyOptions | OptionFn<DestroyOptions, Request>,
  props?: RouteDefinition
): RouteDefinition {
  return {
    middleware: isAdmin,
    destroy(req, locals, params) {
      const optionsDb = getDbOptions<FindOptions>(req, dbOptions);
      return db.destroy({ where: { id: params.id }, ...optionsDb });
    },
    ...props,
  };
}

export function upload(
  {
    db,
    dbField,
    destLastPart,
    routePostFix,
    fieldName,
  }: {
    db: Database<any>;
    dbField: string;
    destLastPart: string;
    routePostFix: string;
    fieldName?: string;
  },
  props?: RouteDefinition
): RouteDefinition {
  const uploadPath = path.resolve(DEFAULT_UPLOAD_PATH, destLastPart);
  const mUpload = createMulterMiddleware(destLastPart);
  return {
    route: '/:id/' + routePostFix,
    method: 'post',
    middleware: [isAdmin, mUpload.single(fieldName || routePostFix)],
    upload: {
      path: uploadPath,
      callback(req, cloudinaryRes) {
        db.update(
          { [dbField]: cloudinaryRes.url },
          { where: { id: req.params.id } }
        );
      },
    },
    ...props,
  };
}
