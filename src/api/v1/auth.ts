import { Puskesmas, PuskesmasDefinition } from './../../orm/models/puskesmas';
import createError from 'http-errors';
import { RouteDefinition } from './../resource-route';
import { User } from './../../orm/models/user';
import { UserLoginSchema, DerivedObjectSchema } from './../schema';
import { ErrorMessages, NonErrorMessages } from './../constants';
import { UserFields } from '../../orm/models/user';
import { signin, signup } from '../../auth/auth';
import { validateRequest } from '../common';
import {
  setUserAddressToPuskesmasAddress,
  getPuskesmasByToken,
} from '../../core/pusksesmas-token';
import { setUserDeviceToSubscribePuskesmasChatTopic } from '../../core/chat';
import Database from '../../orm/database';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from '../../orm/models/devicetokens';
import { reportError } from '../../error';

const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);
const puskesmasDb = new Database<Puskesmas>(PuskesmasDefinition);

export const login: RouteDefinition = {
  route: '/signin',
  method: 'post',
  validateRequest: validateRequest(UserLoginSchema),
  async handler(req, res, next) {
    if (req.session?.user) {
      return res.status(205).json({
        message: ErrorMessages.ALREADY_LOGGED_IN,
      });
    }

    const { username, password } = req.body;

    try {
      const ret = await signin({ username, password });

      if (req.session && !req.query.no_cookie) {
        req.session.user = {
          id: ret.id,
          user_type: ret.user_type,
          pus_id: ret.pus_id,
        };
      }

      if (ret.pus_id) {
        const puskesmas = await puskesmasDb.model.findOne({
          where: { id: ret.pus_id },
        });
        if (puskesmas) {
          const tasks = [];
          if (req.body.device_token) {
            tasks.push(
              setUserDeviceToSubscribePuskesmasChatTopic(
                puskesmas.id,
                req.body.device_token
              )
            );
            tasks.push(
              deviceTokenDb.create({
                token: req.body.device_token,
                user_id: ret.id,
              })
            );
          }
          try {
            await tasks;
          } catch (err) {
            reportError(err);
          }
        }
      }

      return res.status(200).json({
        data: {
          user_id: ret.id,
        },
      });
    } catch (err) {
      return next(createError(401, err));
    }
  },
};

export const register: RouteDefinition = {
  route: '/signup',
  method: 'post',
  validateRequest: validateRequest(DerivedObjectSchema.user),
  async handler(req, res, next) {
    if (req.session?.user) {
      return res.status(205).json({
        message: ErrorMessages.LOGOUT_REQUIRED,
      });
    }

    try {
      const ret = await signup(req.body as UserFields);

      if (req.session && !req.query.no_cookie) {
        req.session.user = {
          id: ret.id,
          user_type: ret.user_type,
          pus_id: ret.pus_id,
        };
      }

      if (req.body.puskesmas_token) {
        const puskesmas = await getPuskesmasByToken(req.body.puskesmas_token);
        if (puskesmas) {
          const tasks = [];
          tasks.push(setUserAddressToPuskesmasAddress(puskesmas, ret as User));
          if (req.body.device_token) {
            tasks.push(
              setUserDeviceToSubscribePuskesmasChatTopic(
                puskesmas.id,
                req.body.device_token
              )
            );
            tasks.push(
              deviceTokenDb.create({
                token: req.body.device_token,
                user_id: ret.id,
              })
            );
          }
          await tasks;
        } else {
          return res.status(400).json({
            message: 'Invalid puskesmas token',
          });
        }
      }

      return res.status(200).json({
        data: {
          user_id: ret.id,
        },
      });
    } catch (err) {
      return next(createError(err.httpCode || 400, err));
    }
  },
};

export const logout: RouteDefinition = {
  route: '/signout',
  method: 'post',
  handler(req, res, next) {
    if (!req.session?.user) {
      return res.status(205).json({
        message: ErrorMessages.NOT_LOGGED_IN,
      });
    }

    req.session?.destroy((err) => {
      if (err) {
        return next(createError(500, err.message));
      }
      return res.status(200).json({
        message: NonErrorMessages.LOGOUT_SUCCESSFUL,
      });
    });
  },
};
