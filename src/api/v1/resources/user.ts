import createError from 'http-errors';
import { RouteDefinition } from './../../resource-route';
import { DerivedObjectSchema } from './../../schema';
import { User, UserDefinition } from './../../../orm/models/user';
import Database from '../../../orm/database';

import * as commonRoutes from '../../common-route-definitions';
import {
  authorize,
  isOwningUser,
  validRoute,
  isUser,
} from '../../../auth/middleware';
import { validateRequest } from '../../common';
import Joi from '@hapi/joi';
import {
  getPuskesmasByToken,
  setUserAddressToPuskesmasAddress,
} from '../../../core/pusksesmas-token';

const db = new Database<User>(UserDefinition, undefined);

const userOwns = authorize(isOwningUser('params.id'));
const schema = DerivedObjectSchema.user;

export const me: RouteDefinition = {
  route: '/my-user',
  method: 'get',
  middleware: validRoute(isUser()),
  load(req) {
    const user_id = req.session?.user?.id;
    return db.model.findOne({
      where: { id: user_id },
      attributes: { exclude: ['password'] },
    });
  },
};

export const show = commonRoutes.show(
  db,
  { attributes: { exclude: ['password'] } },
  { route: '/:id(\\d+)' }
);

export const byUsername = commonRoutes.show(
  db,
  { attributes: { exclude: ['password'] } },
  {
    route: '/:username([A-Za-z_0-9.]+)',
    load(req) {
      return db.model.findOne({
        where: { username: req.params.username.toLowerCase() },
        attributes: { exclude: ['password'] },
      });
    },
  }
);

export const edit = commonRoutes.edit(db, schema, undefined, {
  middleware: userOwns,
});
export const destroy = commonRoutes.destroy(db, undefined, {
  middleware: userOwns,
});

const joinPuskesmasRequestSchema = Joi.object({
  puskesmas_token: Joi.string().required(),
});
export const joinPuskesmas: RouteDefinition = {
  route: '/:id/puskesmas',
  method: 'put',
  validateRequest: validateRequest(joinPuskesmasRequestSchema),
  middleware: [userOwns, validRoute(isUser())],
  async handler(req, res, next) {
    const user_id = req.session?.user?.id;
    const user = (await db.model.findOne({ where: { id: user_id } })) as User;
    const puskesmas = await getPuskesmasByToken(req.body.puskesmas_token);
    if (puskesmas) {
      await setUserAddressToPuskesmasAddress(puskesmas, user);
      if (req.session?.user) {
        req.session.user.pus_id = puskesmas.id;
      }
    } else {
      return next(createError(400, { message: 'Invalid puskesmas token' }));
    }
    return res.json({ message: 'OK' });
  },
};

const destLastPart = 'user_profile_images';
export const upload = commonRoutes.upload({
  db,
  dbField: 'profile_image',
  destLastPart,
  routePostFix: 'profile-image',
  fieldName: 'profile_image',
});
