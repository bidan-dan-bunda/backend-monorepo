import { User, UserDefinition } from './../../../orm/models/user';
import {
  ChatGroup,
  ChatGroupDefinition,
} from './../../../orm/models/chatgroup';
import * as HttpStatusCodes from 'http-status-codes';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from './../../../orm/models/devicetokens';
import {
  ChatTopic,
  ChatTopicDefinition,
} from './../../../orm/models/chattopic';
import { ErrorMessages } from './../../constants';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { RouteDefinition } from './../../resource-route';
import { subscribeDevicesToTopic, sendToGroup } from '../../../core/chat';
import { isUser, validRoute } from '../../../auth/middleware';
import Database from '../../../orm/database';
import { reportError } from '../../../error';
import { validateRequest, countPages } from '../../common';
import Joi from '@hapi/joi';
import { FindOptions, Sequelize } from 'sequelize';

const chatTopicDb = new Database<ChatTopic>(ChatTopicDefinition);
const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);
const chatGroupDb = new Database<ChatGroup>(ChatGroupDefinition);
const userDb = new Database<User>(UserDefinition);

function hasJoinedPuskesmas(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user.pus_id) {
    return next();
  }
  return next(createError(400, { code: ErrorMessages.USER_HAS_NO_PUSKESMAS }));
}

export const join: RouteDefinition = {
  route: '/join',
  middleware: [validRoute(isUser()), hasJoinedPuskesmas],
  async handler(req, res, next) {
    const userId = req.session?.user.id;
    const pusId = req.session?.user.pus_id;
    const topic = await chatTopicDb.model.findOne({
      where: { pus_id: pusId },
      attributes: ['topic'],
    });
    if (topic) {
      const userDeviceTokens = (
        await deviceTokenDb.load({
          where: { user_id: userId },
          attributes: ['token'],
        })
      ).map((deviceToken) => deviceToken.token);
      if (!userDeviceTokens.length) {
        return next(
          createError(400, { message: 'User has no device tokens registered' })
        );
      }
      subscribeDevicesToTopic(userDeviceTokens, topic.topic).catch(reportError);
      return res.status(HttpStatusCodes.ACCEPTED).json({
        message: HttpStatusCodes.getStatusText(HttpStatusCodes.ACCEPTED),
      });
    }
    return res.status(400).json({ message: 'Topic unavailable' });
  },
};

const sendChatRequestSchema = Joi.object({
  message: Joi.string().required(),
});

export const send: RouteDefinition = {
  route: '/',
  method: 'post',
  validateRequest: validateRequest(sendChatRequestSchema),
  middleware: [validRoute(isUser()), hasJoinedPuskesmas],
  async handler(req, res, next) {
    const pus_id = req.session?.user?.pus_id;
    const sender_id = req.session?.user?.id;
    const topic = await chatTopicDb.model.findOne({
      where: { pus_id },
      attributes: ['topic'],
    });
    const user = (await userDb.model.findOne({
      where: { id: sender_id },
    })) as User;
    if (topic) {
      sendToGroup(topic.topic, {
        senderId: sender_id,
        senderName: user.name,
        pusId: pus_id,
        message: req.body.message,
      });
      return res.json({
        data: chatGroupDb.create({
          message: req.body.message,
          sender_id,
          pus_id,
        }),
      });
    }
    return next(createError(400, 'Topic unavailable'));
  },
};

export const get: RouteDefinition = {
  route: '/',
  method: 'get',
  middleware: [
    validRoute(isUser()),
    hasJoinedPuskesmas,
    async (req, res, next) => {
      const queryOptions: FindOptions = {
        ...res.locals.page,
        where: {
          pus_id: req.session?.user.pus_id,
        },
        include: {
          model: User,
          as: 'sender',
          attributes: ['name'],
        },
        raw: true,
        order: [['timestamp', 'DESC']],
      };
      res.locals.queryOptions = queryOptions;
      return countPages(chatGroupDb, queryOptions)(req, res, next);
    },
  ],
  async load(req, locals) {
    const chats = await chatGroupDb.load(locals.queryOptions);
    if (chats.length) {
      return chats;
    }
    return null;
  },
};
