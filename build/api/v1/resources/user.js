"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfileImage = exports.edit = exports.show = void 0;
const constants_1 = require("./../../../constants");
const user_1 = require("./../../../orm/models/user");
const database_1 = __importDefault(require("../../../orm/database"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const db = new database_1.default(user_1.UserDefinition, undefined);
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
exports.show = {
    load: (req, page, params) => {
        return db.model.findByPk(params.id, {
            attributes: attributeList,
        });
    },
};
exports.edit = {
    edit: (req, locals, params) => {
        return db.model.update(req.body, { where: { id: params.id } });
    },
};
const mUpload = multer_1.default({ dest: path_1.default.resolve(constants_1.ROOT_PATH, 'tmp/uploads') });
exports.editProfileImage = {
    route: '/:id/profile-image',
    method: 'post',
    middleware: mUpload.single('profile_image'),
    upload: {
        path: constants_1.ROOT_PATH,
        callback(req, res) {
            db.model.update({ profile_image: res.url }, { where: { id: req.params.id } });
        },
    },
};
