import { RouteDefinition } from './../../resource-route';
import {
  VideoMateri,
  VideoMateriDefinition,
} from './../../../orm/models/videomateri';
import Database from '../../../orm/database';
import { ResourcePage } from '../../middleware';
import { isUserType, authorize, isBidan } from '../../../auth/middleware';
import path from 'path';
import { DEFAULT_UPLOAD_PATH } from '../../../constants';
import multer from 'multer';
import { Request } from 'express';
import { RequestBodyObjectSchema } from '../../schema';
import { validateRequest, createMulterMiddleware } from '../../common';

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

const validateRequestVideoMateri = validateRequest('videomateri');

export const create: RouteDefinition = {
  validateRequest: validateRequestVideoMateri,
  middleware: isBidan,
  create(req, locals, params) {
    const body = req.body;
    const userBidId = req.session?.user.id;
    return db.create({ user_bid_id: userBidId, ...body });
  },
};

export const edit: RouteDefinition = {
  validateRequest: validateRequestVideoMateri,
  middleware: isBidan,
  edit(req, locals, params) {
    const body = req.body;
    return db.model.update(body, { where: { id: params.id } });
  },
};

export const destroy: RouteDefinition = {
  middleware: isBidan,
  destroy(req, locals, params) {
    return db.model.destroy({ where: { id: params.id } });
  },
};

const destLastPart = 'videomateri_thumbnails';
const thumbnailUploadPath = path.resolve(DEFAULT_UPLOAD_PATH, destLastPart);
const mUpload = createMulterMiddleware(destLastPart);
export const editThumbnail: RouteDefinition = {
  route: '/:id/thumbnail',
  method: 'post',
  middleware: [isBidan, mUpload.single('thumbnail')],
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
