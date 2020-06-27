import { isAdmin } from './../../../auth/middleware';
import { ChatRoom, ChatRoomDefinition } from './../../../orm/models/chatrooms';
import { UserDefinition, User } from './../../../orm/models/user';
import createError from 'http-errors';
import { Chat, ChatDefinition } from './../../../orm/models/chat';
import * as commonRoutes from '../../common-route-definitions';
import { countPages, validateRequest } from '../../common';
import {
  sendMessageToTarget,
  getChatRoom,
  createChatRoom,
  storeChatToDB,
} from '../../../core/chat';
import Joi from '@hapi/joi';
import { validRoute, isUser } from '../../../auth/middleware';
import { QueryTypes, Op } from 'sequelize';
import Database, { getSequelizeInstance } from '../../../orm/database';
import { RouteDefinition } from '../../resource-route';

const db = new Database<Chat>(ChatDefinition);
const chatRoomDb = new Database<ChatRoom>(ChatRoomDefinition);
const userDb = new Database<User>(UserDefinition);

export const chats: RouteDefinition = {
  route: '/',
  method: 'get',
  middleware: [validRoute(isUser())],
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
              chat_member_user.name AS chatroom_name,
              chat_member_user.id AS chatroom_user_id,
              target.profile_image AS target_profile_image,
              chats.message AS message,
              chats.timestamp AS timestamp
          FROM
              chat_members
                  INNER JOIN
              chats
                  INNER JOIN
              (SELECT 
                  MAX(timestamp) AS latest
              FROM
                  chats
              GROUP BY chatroom_id) AS q1 ON q1.latest = chats.timestamp
                  AND chats.chatroom_id = chat_members.chatroom_id
                  INNER JOIN
              chat_members AS chat_member_target
                  INNER JOIN
              users AS chat_member_user ON chat_member_user.id = chat_member_target.user_id
                  AND chat_member_target.chatroom_id = chats.chatroom_id
                  AND chat_member_target.user_id <> :user_id
                  INNER JOIN
              users AS sender ON sender.id = chats.sender_id
                  INNER JOIN
              users AS target ON target.id = chats.target_id
          WHERE
              chat_members.user_id = :user_id
          ORDER BY timestamp DESC;
          
          `,
              {
                type: QueryTypes.SELECT,
                replacements: { user_id: req.session?.user.id },
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
      const participant1 = Number.parseInt(req.params.targetId);
      const participant2 = req.session?.user.id;
      if (participant1 == participant2) {
        return next(createError(404, { message: 'Referring to itself' }));
      }
      const chatRoom = await getChatRoom(participant1, participant2);
      if (!chatRoom) {
        return next(
          createError(404, { message: 'Chat with such target not found' })
        );
      }

      const queryOptions = {
        ...res.locals.page,
        where: {
          chatroom_id: chatRoom.id,
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
    const target_id = Number(req.params.targetId);
    if (sender_id == target_id) {
      throw createError(404, { message: 'Referring to itself' });
    }
    let chatRoom = await getChatRoom(sender_id, target_id);
    if (!chatRoom) {
      chatRoom = await createChatRoom(sender_id, target_id);
    }
    const user = (await userDb.model.findOne({
      where: { id: sender_id },
    })) as User;
    const tokensExists = await sendMessageToTarget({
      senderId: sender_id,
      senderName: user.name,
      targetId: target_id,
      message: req.body.message,
    });
    return await storeChatToDB({
      chatroom_id: chatRoom.id,
      sender_id,
      target_id,
      message: req.body.message,
      is_sent: tokensExists,
    });
  },
};

export const truncate: RouteDefinition = {
  route: '/truncate',
  method: 'get',
  middleware: isAdmin,
  async handler(req, res, next) {
    const sequelize = getSequelizeInstance();
    sequelize
      .transaction()
      .then((t) => {
        const options = { raw: true, transaction: t };

        sequelize
          .query('SET FOREIGN_KEY_CHECKS = 0', options)
          .then(() => {
            return Promise.all([
              sequelize.query('truncate table chats', options),
              sequelize.query('truncate table chat_rooms', options),
              sequelize.query('truncate table chat_members', options),
            ]);
          })
          .then(() => {
            return sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options);
          })
          .then(() => {
            return t.commit();
          });
      })
      .then(() => {
        res.json({ message: 'Success truncating tables' });
      })
      .catch((err) => next(createError(500, err)));
  },
};
