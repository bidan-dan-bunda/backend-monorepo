import { ROOT_PATH } from './../../../constants';
import { Route } from './../../resource-route';
import { User, UserDefinition } from './../../../orm/models/user';
import Database from '../../../orm/database';
import multer from 'multer';
import path from 'path';
import { upload } from '../../../fileupload';

const db = new Database<User>(UserDefinition, undefined);

const attributeList = [
  'id',
  'user_type',
  'name',
  'username',
  'full_address',
  'address_province',
  'address_regency',
  'address_district',
  'address_village',
  'profile_image',
  'telephone',
];

export const show: Route = {
  load: (req, page, params) => {
    return db.model.findByPk(params.id, {
      attributes: attributeList,
    });
  },
};

export const edit: Route = {
  edit: (req, locals, params) => {
    return db.model.update(req.body, { where: { id: params.id } });
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
