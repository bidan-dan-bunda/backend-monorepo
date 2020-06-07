import { RouteDefinition } from './../../resource-route';
import {
  VideoMateri,
  VideoMateriDefinition,
} from './../../../orm/models/videomateri';
import Database from '../../../orm/database';
import { ResourcePage } from '../../middleware';
import { isUserType, authorize } from '../../../auth/middleware';
import path from 'path';
import { DEFAULT_UPLOAD_PATH } from '../../../constants';
import multer from 'multer';

const db = new Database<VideoMateri>(VideoMateriDefinition, undefined);

export const index: RouteDefinition = {
  load(req, locals, params) {
    return db.load(locals.page as ResourcePage);
  },
};

export const show: RouteDefinition = {
  load(req, locals, params) {
    return db.model.findByPk(params.id);
  },
};

const isBidan = authorize(isUserType('b'));

export const create: RouteDefinition = {
  middleware: isBidan,
  create(req, locals, params) {
    const body = req.body;
    const userBidId = req.session?.user.id;
    return db.create({ user_bid_id: userBidId, ...body });
  },
};

export const edit: RouteDefinition = {
  middleware: isBidan,
  edit(req, locals, params) {
    const body = req.body;
    return db.model.update(body, { where: { id: params.id } });
  },
};

export const destroy: RouteDefinition = {
  destroy(req, locals, params) {
    return db.model.destroy({ where: { id: params.id } });
  },
};

const thumbnailUploadPath = path.resolve(
  DEFAULT_UPLOAD_PATH,
  'videomateri_thumbnails'
);
const mUpload = multer({
  dest: thumbnailUploadPath,
});
export const editThumbnail: RouteDefinition = {
  route: '/:id/thumbnail',
  method: 'post',
  middleware: mUpload.single('thumbnail'),
  upload: {
    path: thumbnailUploadPath,
    callback(req, cloudinaryRes) {
      db.model.update(
        { thumbnail_url: cloudinaryRes.url },
        { where: { id: req.params.id } }
      );
    },
  },
};
