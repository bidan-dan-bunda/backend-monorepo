import {
  Puskesmas,
  PuskesmasDefinition,
} from './../../../orm/models/puskesmas';
import Database from '../../../orm/database';
import { BaseObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';

const db = new Database<Puskesmas>(PuskesmasDefinition, undefined);
const schema = BaseObjectSchema.puskesmas;

export const index = commonRoutes.index(db);
export const show = commonRoutes.show(db);
export const create = commonRoutes.create(db, schema);
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
