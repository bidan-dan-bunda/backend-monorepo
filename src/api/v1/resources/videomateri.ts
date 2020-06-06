import { Route } from './../../resource-route';
import {
  VideoMateri,
  VideoMateriDefinition,
} from './../../../orm/models/videomateri';
import Database from '../../../orm/database';
import { ResourcePage } from '../../middlewares';
import { isUserType, authorize } from '../../../auth/middleware';

const db = new Database<VideoMateri>(VideoMateriDefinition, undefined);

export const index: Route = {
  load(req, locals, params) {
    return db.load(locals.page as ResourcePage);
  },
};

export const show: Route = {
  load(req, locals, params) {
    return db.model.findByPk(params.id);
  },
};

const isBidan = authorize(isUserType('b'));

export const create: Route = {
  middleware: isBidan,
  create(req, locals, params) {
    const body = req.body;
    const userBidId = req.session?.user.id;
    return db.create({ user_bid_id: userBidId, ...body });
  },
};

export const edit: Route = {
  middleware: isBidan,
  edit(req, locals, params) {
    const body = req.body;
    return db.model.update(body, { where: { id: params.id } });
  },
};
