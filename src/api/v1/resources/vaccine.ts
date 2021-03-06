import {
  DeviceToken,
  DeviceTokenDefinition,
} from './../../../orm/models/devicetokens';
import { Op } from 'sequelize';
import { RouteDefinition } from './../../resource-route';
import { BaseObjectSchema } from './../../schema';
import { Vaccine, VaccineDefinition } from './../../../orm/models/vaccine';
import * as commonRoutes from '../../common-route-definitions';
import Database from '../../../orm/database';
import { isUserType, authorize } from '../../../auth/middleware';
import { toArray } from '../../../utils';
import { User } from '../../../orm/models/user';
import { notify } from '../../../core/services/notifier';

const db = new Database<Vaccine>(VaccineDefinition);
const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);

const schema = BaseObjectSchema.vaccine;

const isBidan = authorize(isUserType('b'));

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
    return { middleware: [...middleware, isBidan] };
  }
);

export const create = commonRoutes.create(db, schema, undefined, {
  middleware: isBidan,
  create(req) {
    return db.create({
      ...req.body,
      pus_id: req.session?.user.pus_id,
    });
  },
  async post(req, error, ret) {
    if (!error) {
      const deviceTokens = (
        await deviceTokenDb.model.findAll({
          attributes: ['token', 'user_id'],
          where: {
            [Op.not]: {
              user_id: req.session?.user.id,
            },
          },
          include: [
            {
              model: User,
              where: { pus_id: req.session?.user.pus_id },
              attributes: ['pus_id'],
              as: 'user',
            },
          ],
        })
      ).map((dt) => ({ token: dt.token, user_id: dt.user_id }));
      notify(
        deviceTokens.map((dt) => dt.token),
        {
          title: `Vaksin ${req.body.name} tersedia`,
          body: req.body.description,
        },
        {
          save: true,
          userIds: deviceTokens.map((dt) => dt.user_id),
          activityType: 'vaccine',
          objectType: 'vaccine',
          objectUrl: '/api/v1/vaccines/' + ret.id,
        }
      );
    }
  },
});

export const show = commonRoutes.show(db, undefined, { middleware: isBidan });
export const edit = commonRoutes.edit(db, schema, undefined, {
  middleware: isBidan,
});
export const destroy = commonRoutes.destroy(db, undefined, {
  middleware: isBidan,
});

const destLastPart = 'vaccine_images';
export const upload = commonRoutes.upload({
  db,
  dbField: 'thumbnail_url',
  destLastPart,
  routePostFix: 'image',
  fieldName: 'image',
});
