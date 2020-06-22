import { UserDefinition, User } from './../../../orm/models/user';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { RouteDefinition } from './../../resource-route';
import { Chat, ChatDefinition } from './../../../orm/models/chat';
import * as commonRoutes from '../../common-route-definitions';
import Database, { getSequelizeInstance } from '../../../orm/database';
import { countPages, validateRequest } from '../../common';
import { sendMessageToTarget } from '../../../core/chat';
import Joi from '@hapi/joi';
import { validRoute, isUser } from '../../../auth/middleware';
import { QueryTypes } from 'sequelize';

const db = new Database<Chat>(ChatDefinition);
const userDb = new Database<User>(UserDefinition);

export const chats: RouteDefinition = {
  route: '/',
  method: 'get',
  middleware: [
    validRoute(isUser()),
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
    const sequelize = getSequelizeInstance();
    return new Promise((resolve, reject) => {
      sequelize.transaction().then((t) => {
        const opts = { raw: true, transaction: t };
        return sequelize
          .query(`SET sql_mode = ''`, opts)
          .then(() => {
            return sequelize.query(
              `
              SELECT 
                  chats.sender_id AS sender_id,
                  chats.target_id AS target_id,
                  users.name AS sender_name,
                  target.name AS target_name,
                  chats.message AS message,
                  chats.timestamp AS timestamp
              FROM
                  users
                      LEFT JOIN
                  (SELECT 
                      chats.sender_id,
                          chats.target_id,
                          chats.timestamp,
                          chats.message
                  FROM
                      chats
                  INNER JOIN (SELECT 
                      sender_id, target_id, MAX(timestamp) AS latest
                  FROM
                      chats
                  GROUP BY target_id) AS q1 ON q1.latest = chats.timestamp) AS chats ON chats.sender_id = users.id
                  INNER JOIN (SELECT * FROM users) as target ON chats.target_id = target.id
              WHERE
                  chats.sender_id = 16 AND
                  target.user_type = 'b';
          `,
              {
                type: QueryTypes.SELECT,
                replacements: { sender_id: req.session?.user.id },
                ...opts,
              }
            );
          })
          .then((res) => {
            resolve(res);
            return t.commit();
          })
          .catch((err) => {
            reject(err);
            return t.rollback();
          });
      });
    });
  },
};

export const chatsByTargetId: RouteDefinition = {
  route: '/:targetId(\\d+)',
  method: 'get',
  middleware: [
    validRoute(isUser()),
    async (req, res, next) => {
      const queryOptions = {
        ...res.locals.page,
        where: {
          sender_id: req.session?.user.id,
        },
        order: [['timestamp', 'DESC']],
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
  middleware: validRoute(isUser()),
  async create(req, locals) {
    const sender_id = req.session?.user.id;
    const user = (await userDb.model.findOne({
      where: { id: sender_id },
    })) as User;
    return await sendMessageToTarget({
      senderId: sender_id,
      senderName: user.name,
      targetId: Number.parseInt(req.params.targetId),
      message: req.body.message,
    });
  },
};
