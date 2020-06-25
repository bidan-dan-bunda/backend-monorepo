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
import { QueryTypes, Op } from 'sequelize';

const db = new Database<Chat>(ChatDefinition);
const userDb = new Database<User>(UserDefinition);

export const chats: RouteDefinition = {
  route: '/',
  method: 'get',
  middleware: [
    validRoute(isUser()),
    /* (req, res, next) => {
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
    }, */
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
              sender.name AS sender_name,
              chats.target_id AS target_id,
              target.name AS target_name,
              target.profile_image AS target_profile_image,
              chats.message AS message,
              chats.timestamp AS timestamp
          FROM
              chats
                  INNER JOIN
              (SELECT 
                  MAX(timestamp) AS latest
              FROM
                  chats
              GROUP BY target_id) AS q1 ON q1.latest = chats.timestamp
              INNER JOIN users AS sender ON sender.id = chats.sender_id
              INNER JOIN users AS target ON target.id = chats.target_id
          WHERE
              sender_id = :sender_id
          ORDER BY timestamp DESC;
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
          [Op.or]: [
            {
              sender_id: req.session?.user.id,
              target_id: req.params.targetId,
            },
            {
              target_id: req.session?.user.id,
              sender_id: req.params.targetId,
            },
          ],
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
