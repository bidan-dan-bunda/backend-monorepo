import { Route } from './../../resource-route';
import {
  VideoMateri,
  VideoMateriDefinition,
} from './../../../orm/models/videomateri';
import Database from '../../../orm/database';
import { ResourcePage } from '../../middlewares';

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

export const create: Route = {
  create(req, locals, params) {
    const body = req.body;
    return db.create(body);
  },
};

export const edit: Route = {
  edit(req, locals, params) {
    const body = req.body;
    return db.model.update(body, { where: { id: params.id } });
  },
};
