"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuskesmasDefinition = void 0;
const reg_province_1 = require("./reg-province");
const sequelize_1 = require("sequelize");
const reg_regency_1 = require("./reg-regency");
const reg_district_1 = require("./reg-district");
exports.PuskesmasDefinition = {
    name: 'puskesmas',
    attributes: {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: sequelize_1.DataTypes.STRING,
        full_address: sequelize_1.DataTypes.STRING,
        address_province: {
            type: sequelize_1.DataTypes.CHAR(2),
            references: {
                model: reg_province_1.Province,
            },
        },
        address_regency: {
            type: sequelize_1.DataTypes.CHAR(4),
            references: {
                model: reg_regency_1.Regency,
            },
        },
        address_district: {
            type: sequelize_1.DataTypes.CHAR(7),
            references: {
                model: reg_district_1.District,
            },
        },
        profile_image: sequelize_1.DataTypes.STRING,
    },
    options: {
        tableName: 'puskesmas',
        timestamps: false,
    },
};
