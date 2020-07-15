import {
  Notification,
  NotificationDefinition,
} from './../../../orm/models/notification';
import Database from '../../../orm/database';
import * as commonRoutes from '../../common-route-definitions';
import { RouteDefinition } from '../../resource-route';
import { toArray } from '../../../utils';
import { authorize, isUserType } from '../../../auth/middleware';
import { validateRequest } from '../../common';
import { NotificationStatusRequest } from '../../schema';

const db = new Database<Notification>(NotificationDefinition);
const isBidan = authorize(isUserType('b'));

export const index = commonRoutes.index(
  db,
  (req) => ({
    where: { receipt_id: req.session?.user.id },
  }),
  function (props: RouteDefinition): RouteDefinition {
    const middleware = toArray(props.middleware) || [];
    return { middleware: [...middleware, isBidan] };
  }
);

export const status: RouteDefinition = {
  route: ':id/status',
  method: 'post',
  middleware: validateRequest(NotificationStatusRequest),
  async edit(req) {
    const id = req.params.id;
    return db.update(req.body, { where: { id } });
  },
};
