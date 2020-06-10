import { ObjectSchema } from '@hapi/joi';
import Database from '../orm/database';
import { RouteDefinition } from './resource-route';
import { ResourcePage } from './middleware';
import { validateRequest, createMulterMiddleware } from './common';
import path from 'path';
import { DEFAULT_UPLOAD_PATH } from '../constants';
import { isAdmin } from '../auth/middleware';
import { any } from 'bluebird';

export function index(
  db: Database<any>,
  props?: RouteDefinition
): RouteDefinition {
  return {
    load(req, locals, params) {
      return db.load(locals.page as ResourcePage);
    },
    ...props,
  };
}

export function show(
  db: Database<any>,
  props?: RouteDefinition
): RouteDefinition {
  return {
    load(req, locals, params) {
      return db.model.findByPk(params.id);
    },
    ...props,
  };
}

export function create(
  db: Database<any>,
  schema: ObjectSchema,
  props?: RouteDefinition
): RouteDefinition {
  return {
    validateRequest: validateRequest(schema),
    middleware: isAdmin,
    create(req, locals, params) {
      return db.create(req.body);
    },
    ...props,
  };
}

export function edit(
  db: Database<any>,
  schema: ObjectSchema,
  props?: RouteDefinition
): RouteDefinition {
  return {
    validateRequest: validateRequest(schema),
    middleware: isAdmin,
    edit(req, locals, params) {
      const body = req.body;
      return db.update(body, { where: { id: params.id } });
    },
    ...props,
  };
}

export function destroy(
  db: Database<any>,
  props?: RouteDefinition
): RouteDefinition {
  return {
    middleware: isAdmin,
    destroy(req, locals, params) {
      return db.destroy({ where: { id: params.id } });
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
