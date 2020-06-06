import { Video, VideoDefinition } from './../../../orm/models/video';
import { RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import { ResourcePage } from '../../middlewares';

const db = new Database<Video>(VideoDefinition, undefined);

export const index: RouteDefinition = {
  load(req, locals) {
    return db.load(locals.page as ResourcePage);
  },
};

export const show: RouteDefinition = {
  load(req, locals, params) {
    return db.model.findByPk(params.id);
  },
};
