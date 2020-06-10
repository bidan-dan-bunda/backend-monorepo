import { DerivedObjectSchema } from './../../schema';
import { User, UserDefinition } from './../../../orm/models/user';
import Database from '../../../orm/database';

import * as commonRoutes from '../../common-route-definitions';
import { authorize, isOwningUser } from '../../../auth/middleware';

const db = new Database<User>(UserDefinition, undefined);

const userOwns = authorize(isOwningUser('params.id'));
const schema = DerivedObjectSchema.user;

const attributes = [
  'id',
  'user_type',
  'username',
  'name',
  'full_address',
  'address_province',
  'address_regency',
  'address_district',
  'address_village',
  'telephone',
  'profile_image',
  'pus_id',
];

export const show = commonRoutes.show(
  db,
  { attributes },
  { middleware: userOwns }
);
export const edit = commonRoutes.edit(db, schema, undefined, {
  middleware: userOwns,
});
export const destroy = commonRoutes.destroy(db, undefined, {
  middleware: userOwns,
});

const destLastPart = 'user_profile_images';
export const upload = commonRoutes.upload({
  db,
  dbField: 'profile_image',
  destLastPart,
  routePostFix: 'profile-image',
  fieldName: 'profile_image',
});
