import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { RouteDefinition } from './../../resource-route';
import { Chat, ChatDefinition } from './../../../orm/models/chat';
import * as commonRoutes from '../../common-route-definitions';
import Database from '../../../orm/database';
import { countPages, validateRequest } from '../../common';
import { sendMessageToTarget } from '../../../core/chat';
import Joi from '@hapi/joi';

const db = new Database<Chat>(ChatDefinition);

function middleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user?.id) {
    return next(createError(400));
  }
  return next();
}

export const chats: RouteDefinition = {
  route: '/',
  method: 'get',
  middleware,
  async load(req, locals) {
    const queryOptions = {
      ...locals.page,
      where: {
        sender_id: req.session?.user.id,
      },
      order: [['timestamp', 'DESC']],
      attributes: { exclude: ['message'] },
    };
    await countPages(db, locals.page.limit, locals, queryOptions);
    return db.load(queryOptions);
  },
};

export const chatsByTargetId: RouteDefinition = {
  route: '/:targetId(\\d+)',
  method: 'get',
  middleware,
  async load(req, locals) {
    const queryOptions = {
      ...locals.page,
      where: {
        sender_id: req.session?.user.id,
        target_id: req.params.targetId,
      },
      order: [['timestamp', 'DESC']],
    };
    await countPages(db, locals.page.limit, locals, queryOptions);
    return db.load(queryOptions);
  },
};

const sendChatRequestSchema = Joi.object({
  message: Joi.string().required(),
});
export const sendChatToTarget: RouteDefinition = {
  route: '/:targetId(\\d+)',
  method: 'post',
  validateRequest: validateRequest(sendChatRequestSchema),
  middleware,
  async create(req, locals) {
    return await sendMessageToTarget({
      senderId: req.session?.user.id,
      targetId: Number.parseInt(req.params.targetId),
      message: req.body.message,
    });
  },
};
