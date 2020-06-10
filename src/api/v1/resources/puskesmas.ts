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

const db = new Database<Puskesmas>(PuskesmasDefinition, undefined);
const schema = BaseObjectSchema.puskesmas;

const tokenDb = new Database<PuskesmasToken>(
  PuskesmasTokenDefinition,
  undefined
);

export const show = commonRoutes.show(db);

export const showTokens: RouteDefinition = {
  route: '/:id/tokens',
  middleware: isAdmin,
  method: 'get',
  load(req, locals, res) {
    return tokenDb.load({ where: { pus_id: req.params.id } });
  },
};

export const create = commonRoutes.create(db, schema, undefined, {
  async create(req, locals, res) {
    const ret = await db.create(req.body);
    const pusId = ret.id;
    const tokens = generateAccessTokens(3);
    storeAccessTokens(pusId, tokens);
    return ret;
  },
});
export const edit = commonRoutes.edit(db, schema);
export const destroy = commonRoutes.destroy(db);

const destLastPart = 'puskesmas_profile_images';
export const upload = commonRoutes.upload({
  db,
  dbField: 'profile_image',
  destLastPart,
  routePostFix: 'profile-image',
  fieldName: 'profile_image',
});
