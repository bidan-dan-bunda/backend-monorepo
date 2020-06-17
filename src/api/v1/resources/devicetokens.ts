import {
  DeviceToken,
  DeviceTokenDefinition,
} from './../../../orm/models/devicetokens';
import createError from 'http-errors';
import { RouteDefinition } from './../../resource-route';
import Joi from '@hapi/joi';
import { validateRequest } from '../../common';
import Database, { getSequelizeInstance } from '../../../orm/database';
import { validRoute, isUser } from '../../../auth/middleware';
import { Op } from 'sequelize/types';
import sequelize from 'sequelize';

const db = new Database<DeviceToken>(DeviceTokenDefinition);

const registerTokenRequestSchema = Joi.object({
  device_token: Joi.string().required(),
});

// endpoint for registering device registration tokens
export const registerToken: RouteDefinition = {
  route: '/tokens',
  method: 'post',
  middleware: validRoute(isUser()),
  validateRequest: validateRequest(registerTokenRequestSchema),
  create(req, res, next) {
    const { device_token } = req.body;
    const user_id = req.session?.user.id;
    const sequelize = getSequelizeInstance();
    return sequelize.query(
      'INSERT INTO fb_device_tokens (token, user_id) VALUES(SHA2(:device_token, 256), :user_id)',
      {
        replacements: {
          device_token,
          user_id,
        },
      }
    );
  },
};

export const getUserDeviceTokens: RouteDefinition = {
  route: '/users',
  method: 'get',
  load(req, res, next) {
    let userId: any;
    if ((req.user as any)?.admin) {
      userId = req.params.user_id;
    } else {
      userId = req.session?.user.id;
    }

    if (!userId) {
      return next(createError(400));
    }

    return db.load({ where: { user_id: userId } });
  },
};
