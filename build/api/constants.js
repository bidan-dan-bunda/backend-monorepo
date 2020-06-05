"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseObjectSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
exports.ResponseObjectSchema = {
    users: joi_1.default.object({
        id: joi_1.default.number(),
        user_type: joi_1.default.string(),
        name: joi_1.default.string(),
        username: joi_1.default.string(),
        full_address: joi_1.default.string().allow(null),
        address_province: joi_1.default.string().allow(null),
        address_regency: joi_1.default.string().allow(null),
        address_district: joi_1.default.string().allow(null),
        address_village: joi_1.default.string().allow(null),
        profile_image: joi_1.default.string().allow(null),
    }),
    puskesmas: joi_1.default.object({
        id: joi_1.default.number(),
        name: joi_1.default.string(),
        full_address: joi_1.default.string().allow(null),
        address_province: joi_1.default.string().allow(null),
        address_regency: joi_1.default.string().allow(null),
        address_district: joi_1.default.string().allow(null),
        profile_image: joi_1.default.string().allow(null),
    }),
    videomateri: joi_1.default.object({
        id: joi_1.default.number(),
        week: joi_1.default.number(),
        content: joi_1.default.string(),
        thumbnail: joi_1.default.string().allow(null),
    }),
    'locations/provinces': joi_1.default.object({
        id: joi_1.default.number(),
        name: joi_1.default.string(),
    }),
    'locations/regencies': joi_1.default.object({
        id: joi_1.default.number(),
        name: joi_1.default.string(),
        province_id: joi_1.default.string(),
    }),
    'locations/districts': joi_1.default.object({
        id: joi_1.default.number(),
        name: joi_1.default.string(),
        regency_id: joi_1.default.string(),
    }),
    'locations/villages': joi_1.default.object({
        id: joi_1.default.number(),
        name: joi_1.default.string(),
        district_id: joi_1.default.string(),
    }),
};
