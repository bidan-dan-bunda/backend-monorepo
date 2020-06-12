import { RouteDefinition } from './../../resource-route';
import { BaseObjectSchema } from './../../schema';
import { Vaccine, VaccineDefinition } from './../../../orm/models/vaccine';
import * as commonRoutes from '../../common-route-definitions';
import Database from '../../../orm/database';
import { isUserType, authorize } from '../../../auth/middleware';
import { toArray } from '../../../utils';

const db = new Database<Vaccine>(VaccineDefinition);

const schema = BaseObjectSchema.vaccine;

export const index = commonRoutes.index(
  db,
  (req) => {
    const pusId = req.session?.user.pus_id;
    return {
      where: { pus_id: pusId },
      attributes: { exclude: ['created_at'] },
    };
  },
  function (props: RouteDefinition): RouteDefinition {
    const middleware = toArray(props.middleware) || [];
    const additionalMiddleware = authorize(isUserType('b'));
    return { middleware: [...middleware, additionalMiddleware] };
  }
);

export const create = commonRoutes.create(db, schema);
export const show = commonRoutes.show(db);
export const edit = commonRoutes.edit(db, schema);
export const destroy = commonRoutes.destroy(db);
