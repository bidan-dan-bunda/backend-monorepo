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
import {
  setUserDeviceToSubscribePuskesmasChatTopic,
  sendNotSentMessagesToId,
} from '../../core/chat';
import Database from '../../orm/database';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from '../../orm/models/devicetokens';
import { reportError } from '../../error';
import { greetingNotification } from '../../core/services/notifier';

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

      if (ret.pus_id) {
        const puskesmas = await puskesmasDb.model.findOne({
          where: { id: ret.pus_id },
        });
        if (puskesmas) {
          const tasks: any[] = [];
          if (req.body.device_token) {
            tasks.push(
              setUserDeviceToSubscribePuskesmasChatTopic(
                puskesmas.id,
                req.body.device_token
              )
            );
            try {
              await deviceTokenDb.create({
                token: req.body.device_token,
                user_id: ret.id,
              });
            } catch (err) {
              return next(
                createError(400, {
                  message:
                    'Cannot create device_token, possibly duplicate token exists',
                })
              );
            }
            res.cookie('device_token', req.body.device_token);
          }
          Promise.all(tasks)
            .then(() => sendNotSentMessagesToId(ret.id, req.body.device_token))
            .catch(reportError);
        }
      }

      if (req.session && !req.query.no_cookie) {
        req.session.user = {
          id: ret.id,
          user_type: ret.user_type,
          pus_id: ret.pus_id,
        };
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
      if (req.body.puskesmas_token) {
        const puskesmas = await getPuskesmasByToken(req.body.puskesmas_token);
        if (puskesmas) {
          const ret = await signup(req.body as UserFields);
          if (req.session && !req.query.no_cookie) {
            req.session.user = {
              id: ret.id,
              user_type: ret.user_type,
              pus_id: puskesmas.id,
            };
          }

          const tasks: any[] = [];
          tasks.push(setUserAddressToPuskesmasAddress(puskesmas, ret as User));
          tasks.push(greetingNotification(ret.id, req.body.device_token));
          if (req.body.device_token) {
            tasks.push(
              setUserDeviceToSubscribePuskesmasChatTopic(
                puskesmas.id,
                req.body.device_token
              )
            );
            try {
              await deviceTokenDb.create({
                token: req.body.device_token,
                user_id: ret.id,
              });
            } catch (err) {
              return next(
                createError(400, {
                  message:
                    'Cannot create device_token, possibly duplicate token exists',
                })
              );
            }
            res.cookie('device_token', req.body.device_token);
          }
          Promise.all(tasks)
            .then(() => sendNotSentMessagesToId(ret.id, req.body.device_token))
            .catch(reportError);

          return res.status(200).json({
            data: {
              user_id: ret.id,
            },
          });
        } else {
          return res.status(400).json({
            message: 'Invalid puskesmas token',
          });
        }
      }
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

    const deviceToken = req.cookies['device_token'] || req.body.device_token;
    if (deviceToken) {
      deviceTokenDb.model
        .destroy({ where: { token: deviceToken } })
        .catch(reportError);
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
