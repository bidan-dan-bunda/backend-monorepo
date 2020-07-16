import { User, UserDefinition } from './../../../orm/models/user';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { isAdmin } from './../../../auth/middleware';
import {
  PuskesmasToken,
  PuskesmasTokenDefinition,
} from '../../../orm/models/puskesmas-token';
import { RouteDefinition } from './../../resource-route';
import {
  Puskesmas,
  PuskesmasDefinition,
} from './../../../orm/models/puskesmas';
import Database from '../../../orm/database';
import { BaseObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';
import {
  generateAccessTokens,
  storeAccessTokens,
} from '../../../core/pusksesmas-token';
import { toArray } from '../../../utils';
import { createTopic, storeTopicId } from '../../../core/chat';
import { reportError } from '../../../error';
import { countPages } from '../../common';
import { cache } from '../../middleware';

const userDb = new Database<User>(UserDefinition);
const db = new Database<Puskesmas>(PuskesmasDefinition, undefined);
const schema = BaseObjectSchema.puskesmas;

const tokenDb = new Database<PuskesmasToken>(
  PuskesmasTokenDefinition,
  undefined
);

export const show = commonRoutes.show(db);

export const index: RouteDefinition = commonRoutes.show(tokenDb, undefined, {
  route: '/tokens/:token',
  middleware: cache,
  load(req) {
    return tokenDb.model.findAll({
      where: { token: req.params.token as any },
      include: [{ model: Puskesmas, as: 'puskesmas' }],
    });
  },
});

export const showTokens: RouteDefinition = {
  route: '/:id/tokens',
  middleware: [isAdmin, cache],
  method: 'get',
  load(req, locals, res) {
    return tokenDb.load({
      where: { pus_id: req.params.id },
      attributes: { exclude: ['created_at'] },
    });
  },
};

export const showBunda: RouteDefinition = {
  route: '/:id/bunda',
  method: 'get',
  middleware(req, res, next) {
    const queryOptions = {
      ...res.locals.page,
      where: { pus_id: req.params.id, user_type: 'u' },
      attributes: { exclude: ['password'] },
    };
    res.locals.queryOptions = queryOptions;
    return countPages(userDb, queryOptions)(req, res, next);
  },
  async load(req, locals, res) {
    const users = await userDb.load(locals.queryOptions);
    if (users.length) {
      return users;
    }
    return null;
  },
};

export const create = commonRoutes.create(db, schema, undefined, {
  async create(req, locals, res) {
    const ret = await db.create(req.body);
    const pusId = ret.id;
    const tokens = generateAccessTokens(3);
    storeAccessTokens(pusId, tokens).catch(reportError);
    const chatTopic = createTopic();
    storeTopicId(pusId, chatTopic).catch(reportError);
    return ret;
  },
});
export const edit = commonRoutes.edit(db, schema);
export const destroy = commonRoutes.destroy(db);

export const bidans: RouteDefinition = {
  route: '/:id/bidan',
  method: 'get',
  load(req) {
    return userDb.load({
      where: { user_type: 'b', pus_id: req.params.id },
      attributes: [
        'id',
        'name',
        'telephone',
        'profile_image',
        'pus_id',
        'username',
      ],
    });
  },
};

const destLastPart = 'puskesmas_profile_images';
export const upload = commonRoutes.upload({
  db,
  dbField: 'profile_image',
  destLastPart,
  routePostFix: 'profile-image',
  fieldName: 'profile_image',
});
