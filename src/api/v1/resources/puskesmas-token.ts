import {
  PuskesmasToken,
  PuskesmasTokenDefinition,
} from '../../../orm/models/puskesmas-token';
import Database from '../../../orm/database';
import * as commonRoutes from '../../common-route-definitions';

const db = new Database<PuskesmasToken>(PuskesmasTokenDefinition);

export const show = commonRoutes.show(db, undefined, {
  route: '/:token',
  load(req, locals) {
    return db.model.findOne({
      where: { token: req.params.token },
      attributes: { exclude: ['created_at'] },
    });
  },
});
