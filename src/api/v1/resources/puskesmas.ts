import { ROOT_PATH } from './../../../constants';
import {
  Puskesmas,
  PuskesmasDefinition,
} from './../../../orm/models/puskesmas';
import { Route } from './../../resource-route';
import Database from '../../../orm/database';
import multer from 'multer';
import path from 'path';

const db = new Database<Puskesmas>(PuskesmasDefinition, undefined);

const attributeList = [
  'id',
  'name',
  'full_address',
  'address_province',
  'address_regency',
  'address_district',
  'profile_image',
];

export const index: Route = {
  load: (req, page, params) => {
    return db.load({
      attributes: attributeList,
    });
  },
};

export const show: Route = {
  load: (req, page, params) => {
    return db.model.findByPk(params.id, {
      attributes: attributeList,
    });
  },
};

export const create: Route = {
  create: (req) => {
    return db.model.create(req.body);
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
