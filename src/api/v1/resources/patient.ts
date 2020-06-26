import { User } from './../../../orm/models/user';
import { ResourcePage } from './../../middleware';
import { Patient, PatientDefinition } from './../../../orm/models/patient';
import * as commonRoutes from '../../common-route-definitions';
import Database from '../../../orm/database';
import { RouteDefinition } from '../../resource-route';
import { toArray } from 'lodash';
import { authorize, isUserType } from '../../../auth/middleware';

const db = new Database<Patient>(PatientDefinition);

export const index = commonRoutes.index(db, {}, function (
  props: RouteDefinition
): RouteDefinition {
  const middleware = toArray(props.middleware) || [];
  const additionalMiddleware = authorize(isUserType('b'));
  return {
    middleware: [...middleware, additionalMiddleware],
    async load(req, locals, params) {
      return db.load({
        ...(locals.page as ResourcePage),
        ...locals.dbOptions,
        include: [
          {
            model: User,
            as: 'user',
            where: { pus_id: req.session?.user.pus_id },
          },
        ],
      });
    },
  };
});
