import {
  DeviceToken,
  DeviceTokenDefinition,
} from './../../../orm/models/devicetokens';
import createError from 'http-errors';
import { RouteDefinition } from './../../resource-route';
import Joi from '@hapi/joi';
import { validateRequest } from '../../common';
import Database from '../../../orm/database';

const db = new Database<DeviceToken>(DeviceTokenDefinition);

const registerTokenRequestSchema = Joi.object({
  device_token: Joi.string().required(),
  user_id: Joi.number().required(),
});

// endpoint for registering device registration tokens
export const registerToken: RouteDefinition = {
  route: '/tokens',
  method: 'post',
  validateRequest: validateRequest(registerTokenRequestSchema),
  handler(req, res, next) {
    if ((req.user as any)?.admin) {
      return next(
        createError(400, {
          message: 'Admin cannot register device registration token',
        })
      );
    }

    const { device_token } = req.body;
    const userId = req.session?.user.id;
    db.create({ token: device_token, user_id: userId });
    return res.status(202).json({ message: 'Accepted' });
  },
};

export const checkIfTokenIsRegistered: RouteDefinition = {
  route: '/tokens/:token',
  method: 'get',
  load(req, res, next) {
    return db.model.findOne({
      where: { token: req.params.token },
    });
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
