import { BaseObjectSchema } from './../../schema';
import { User } from './../../../orm/models/user';
import { ResourcePage } from './../../middleware';
import { Patient, PatientDefinition } from './../../../orm/models/patient';
import * as commonRoutes from '../../common-route-definitions';
import Database from '../../../orm/database';
import { RouteDefinition } from '../../resource-route';
import { toArray } from 'lodash';
import { authorize, isUserType } from '../../../auth/middleware';

const db = new Database<Patient>(PatientDefinition);
const schema = BaseObjectSchema.patient;

const isBidan = authorize(isUserType('b'));

export const index = commonRoutes.index(db, {}, function (
  props: RouteDefinition
): RouteDefinition {
  const middleware = toArray(props.middleware) || [];
  const additionalMiddleware = isBidan;
  return {
    middleware: [...middleware, additionalMiddleware],
    async load(req, locals, params) {
      return db.load({
        ...(locals.page as ResourcePage),
        ...locals.dbOptions,
        raw: true,
        include: [
          {
            model: User,
            where: { pus_id: req.session?.user.pus_id },
            attributes: ['name', 'profile_image'],
          },
        ],
      });
    },
  };
});

export const show = commonRoutes.show(db, (req) => ({
  raw: true,
  include: [
    {
      model: User,
      where: { pus_id: req.session?.user.pus_id },
      attributes: ['name', 'profile_image'],
    },
  ],
}));

export const create = commonRoutes.create(db, schema, undefined, {
  middleware: isBidan,
});

export const edit = commonRoutes.edit(
  db,
  schema,
  (req) => ({ where: { user_id: req.params.id } }),
  {
    middleware: isBidan,
  }
);

export const destroy = commonRoutes.destroy(
  db,
  (req) => ({ where: { user_id: req.params.id } }),
  {
    middleware: isBidan,
  }
);
