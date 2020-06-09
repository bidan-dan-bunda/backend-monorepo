import { RequestBodyObjectSchema } from './../../schema';
import { ROOT_PATH, DEFAULT_UPLOAD_PATH } from './../../../constants';
import {
  Puskesmas,
  PuskesmasDefinition,
} from './../../../orm/models/puskesmas';
import { Route, RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import multer from 'multer';
import path from 'path';
import { ResourcePage } from '../../middleware';
import { Request } from 'express';
import { validateRequest, createMulterMiddleware } from '../../common';
import { MAX_UPLOAD_FILE_SIZE } from '../../constants';

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

const validateRequestPuskesmas = validateRequest('puskesmas');

export const create: RouteDefinition = {
  validateRequest: validateRequestPuskesmas,
  create: (req) => {
    return db.create(req.body);
  },
};

export const edit: RouteDefinition = {
  validateRequest: validateRequestPuskesmas,
  edit(req, locals, params) {
    return db.update(req.body, {
      where: { id: params.id },
      returning: true,
    });
  },
};

export const destroy: RouteDefinition = {
  destroy(req, locals, params) {
    return db.destroy({ where: { id: params.id } });
  },
};

const destLastPart = 'puskesmas_profile_image';
const uploadPath = path.resolve(DEFAULT_UPLOAD_PATH, destLastPart);
const mUpload = createMulterMiddleware(destLastPart);
export const editProfileImage: Route = {
  route: '/:id/profile-image',
  method: 'post',
  middleware: mUpload.single('profile_image'),
  upload: {
    path: uploadPath,
    callback(req, res) {
      db.update({ profile_image: res.url }, { where: { id: req.params.id } });
    },
  },
};
