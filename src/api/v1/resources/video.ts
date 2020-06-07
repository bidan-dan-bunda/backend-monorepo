import { isBidan } from './../../../auth/middleware';
import { DEFAULT_UPLOAD_PATH } from './../../../constants';
import { Video, VideoDefinition } from './../../../orm/models/video';
import { RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import { ResourcePage } from '../../middleware';
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { RequestBodyObjectSchema } from '../../schema';
import { createMulterMiddleware, validateRequest } from '../../common';

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

const validateRequestVideo = validateRequest('video');

export const create: RouteDefinition = {
  validateRequest: validateRequestVideo,
  middleware: isBidan,
  create(req, locals, params) {
    return db.model.create(req.body);
  },
};

export const edit: RouteDefinition = {
  validateRequest: validateRequestVideo,
  middleware: isBidan,
  edit(req, locals, params) {
    return db.model.update(req.body, {
      where: { id: params.id },
      returning: true,
    });
  },
};

export const destroy: RouteDefinition = {
  middleware: isBidan,
  destroy(req, locals, params) {
    return db.model.destroy({ where: { id: params.id } });
  },
};

const destLastPart = 'video_thumbnails';
const thumbnailUploadPath = path.resolve(DEFAULT_UPLOAD_PATH, destLastPart);
const mUpload = createMulterMiddleware(destLastPart);
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
