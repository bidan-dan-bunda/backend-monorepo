"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showVillage = exports.allVillages = exports.villageDistricts = exports.showDistrict = exports.indexDistricts = exports.regencyDistricts = exports.showRegency = exports.indexRegencies = exports.provinceRegencies = exports.showProvince = exports.indexProvinces = void 0;
const database_1 = __importDefault(require("../../../orm/database"));
const reg_province_1 = require("../../../orm/models/reg-province");
const reg_regency_1 = require("../../../orm/models/reg-regency");
const reg_district_1 = require("../../../orm/models/reg-district");
const reg_village_1 = require("../../../orm/models/reg-village");
const provinceDb = new database_1.default(reg_province_1.ProvinceDefinition, undefined);
const regencyDb = new database_1.default(reg_regency_1.RegencyDefinition, undefined);
const districtDb = new database_1.default(reg_district_1.DistrictDefinition, undefined);
const villageDb = new database_1.default(reg_village_1.VillageDefinition, undefined);
/* provinces */
exports.indexProvinces = {
    route: '/provinces',
    method: 'get',
    load: (req, locals, params) => provinceDb.load(locals.page),
};
exports.showProvince = {
    route: '/provinces/:provinceId',
    method: 'get',
    load: (req, locals, params) => provinceDb.model.findByPk(params.provinceId),
};
exports.provinceRegencies = {
    route: '/provinces/:provinceId/regencies',
    method: 'get',
    load(req, locals, params) {
        return provinceDb.model.findByPk(params.provinceId, {
            include: [reg_province_1.Province.associations.regencies],
        });
    },
};
/* regencies */
exports.indexRegencies = {
    route: '/regencies',
    method: 'get',
    load: (req, locals, params) => regencyDb.load(locals.page),
};
exports.showRegency = {
    route: '/regencies/:regencyId',
    method: 'get',
    load: (req, locals, params) => regencyDb.model.findByPk(params.regencyId),
};
exports.regencyDistricts = {
    route: '/regencies/:regencyId/districts',
    method: 'get',
    load(req, locals, params) {
        return regencyDb.model.findByPk(params.regencyId, {
            include: [reg_regency_1.Regency.associations.districts],
        });
    },
};
/* districts */
exports.indexDistricts = {
    route: '/districts',
    method: 'get',
    load: (req, locals, params) => districtDb.load(locals.page),
};
exports.showDistrict = {
    route: '/districts/:districtId',
    method: 'get',
    load: (req, locals, params) => districtDb.model.findByPk(params.districtId),
};
exports.villageDistricts = {
    route: '/districts/:districtId/villages',
    method: 'get',
    load(req, locals, params) {
        return districtDb.model.findByPk(params.districtId, {
            include: [reg_district_1.District.associations.villages],
        });
    },
};
/* villages */
exports.allVillages = {
    route: '/villages',
    method: 'get',
    load: (req, locals, params) => villageDb.load(locals.page),
};
exports.showVillage = {
    route: '/villages/:villageId',
    method: 'get',
    load: (req, locals, params) => villageDb.model.findByPk(params.villageId),
};
