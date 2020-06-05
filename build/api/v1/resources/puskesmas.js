"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfileImage = exports.create = exports.show = exports.index = void 0;
const constants_1 = require("./../../../constants");
const puskesmas_1 = require("./../../../orm/models/puskesmas");
const database_1 = __importDefault(require("../../../orm/database"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const db = new database_1.default(puskesmas_1.PuskesmasDefinition, undefined);
const attributeList = [
    'id',
    'name',
    'full_address',
    'address_province',
    'address_regency',
    'address_district',
    'profile_image',
];
exports.index = {
    load: (req, page, params) => {
        return db.load({
            attributes: attributeList,
        });
    },
};
exports.show = {
    load: (req, page, params) => {
        return db.model.findByPk(params.id, {
            attributes: attributeList,
        });
    },
};
exports.create = {
    create: (req) => {
        return db.model.create(req.body);
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
