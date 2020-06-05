"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit = exports.create = exports.show = exports.index = void 0;
const videomateri_1 = require("./../../../orm/models/videomateri");
const database_1 = __importDefault(require("../../../orm/database"));
const db = new database_1.default(videomateri_1.VideoMateriDefinition, undefined);
exports.index = {
    load(req, locals, params) {
        return db.load(locals.page);
    },
};
exports.show = {
    load(req, locals, params) {
        return db.model.findByPk(params.id);
    },
};
exports.create = {
    create(req, locals, params) {
        const body = req.body;
        return db.create(body);
    },
};
exports.edit = {
    edit(req, locals, params) {
        const body = req.body;
        return db.model.update(body, { where: { id: params.id } });
    },
};
