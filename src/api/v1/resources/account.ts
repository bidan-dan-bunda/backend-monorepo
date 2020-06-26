import { User, UserDefinition } from './../../../orm/models/user';
import { RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import { validRoute, isUser } from '../../../auth/middleware';

const db = new Database<User>(UserDefinition);

export const me: RouteDefinition = {
  route: '/me',
  method: 'get',
  middleware: validRoute(isUser()),
  load(req) {
    return db.model.findOne({ where: { id: req.session?.user.id } });
  },
};
