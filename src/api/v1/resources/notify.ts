import { notify } from '../../../core/services/notifier';
import { RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from '../../../orm/models/devicetokens';
import { validateRequest } from '../../common';
import Joi from '@hapi/joi';
import { isAdmin } from '../../../auth/middleware';

const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);

const schema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().optional(),
});

export const sendNotification: RouteDefinition = {
  route: '/',
  method: 'post',
  middleware: isAdmin,
  validateRequest: validateRequest(schema),
  async create(req) {
    const deviceTokens = (
      await deviceTokenDb.load({ attributes: ['token'] })
    ).map((dt) => dt.token);
    notify(deviceTokens, req.body);
    return;
  },
};
