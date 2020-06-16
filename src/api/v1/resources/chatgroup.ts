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
import { subscribeDevicesToTopic } from '../../../core/chat';
import { authorize, isUser, validRoute } from '../../../auth/middleware';
import Database from '../../../orm/database';
import { reportError } from '../../../error';

const chatTopicDb = new Database<ChatTopic>(ChatTopicDefinition);
const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);

async function hasJoinedPuskesmas(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session?.user.pus_id) {
    return next();
  }
  return next(
    createError(400, { message: ErrorMessages.USER_HAS_NO_PUSKESMAS })
  );
}

export const join: RouteDefinition = {
  route: '/join',
  middleware: [validRoute(isUser()), hasJoinedPuskesmas],
  async handler(req, res) {
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
      subscribeDevicesToTopic(userDeviceTokens, topic.topic).catch(reportError);
      return res.status(HttpStatusCodes.ACCEPTED).json({
        message: HttpStatusCodes.getStatusText(HttpStatusCodes.ACCEPTED),
      });
    }
    return res.status(400).json({ message: 'Topic unavailable' });
  },
};
