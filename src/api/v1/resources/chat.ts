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
  middleware: [
    middleware,
    (req, res, next) => {
      const queryOptions = {
        ...res.locals.page,
        where: {
          sender_id: req.session?.user.id,
        },
        order: [['timestamp', 'DESC']],
        attributes: { exclude: ['message'] },
      };
      res.locals.queryOptions = queryOptions;
      return countPages(db, queryOptions)(req, res, next);
    },
  ],
  async load(req, locals) {
    return db.load(locals.queryOptions);
  },
};

export const chatsByTargetId: RouteDefinition = {
  route: '/:targetId(\\d+)',
  method: 'get',
  middleware: [
    middleware,
    async (req, res, next) => {
      const queryOptions = {
        ...res.locals.page,
        where: {
          sender_id: req.session?.user.id,
        },
        order: [['timestamp', 'DESC']],
        attributes: { exclude: ['message'] },
      };
      res.locals.queryOptions = queryOptions;
      return countPages(db, queryOptions)(req, res, next);
    },
  ],
  async load(req, locals) {
    return db.load(locals.queryOptions);
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
