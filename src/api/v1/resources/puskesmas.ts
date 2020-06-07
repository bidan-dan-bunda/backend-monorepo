import { ROOT_PATH } from './../../../constants';
import {
  Puskesmas,
  PuskesmasDefinition,
} from './../../../orm/models/puskesmas';
import { Route, RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import multer from 'multer';
import path from 'path';
import { ResourcePage } from '../../middleware';

const db = new Database<Puskesmas>(PuskesmasDefinition, undefined);

export const index: RouteDefinition = {
  load: (req, locals, params) => {
    return db.load(locals.page as ResourcePage);
  },
};

export const show: RouteDefinition = {
  load: (req, page, params) => {
    return db.model.findByPk(params.id);
  },
};

export const create: RouteDefinition = {
  create: (req) => {
    return db.model.create(req.body);
  },
};

export const edit: RouteDefinition = {
  edit(req, locals, params) {
    return db.model.update(req.body, {
      where: { id: params.id },
      returning: true,
    });
  },
};

export const destroy: RouteDefinition = {
  destroy(req, locals, params) {
    return db.model.destroy({ where: { id: params.id } });
  },
};

const mUpload = multer({ dest: path.resolve(ROOT_PATH, 'tmp/uploads') });
export const editProfileImage: Route = {
  route: '/:id/profile-image',
  method: 'post',
  middleware: mUpload.single('profile_image'),
  upload: {
    path: ROOT_PATH,
    callback(req, res) {
      db.model.update(
        { profile_image: res.url },
        { where: { id: req.params.id } }
      );
    },
  },
};
