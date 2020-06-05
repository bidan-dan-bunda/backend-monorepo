"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDefinition = void 0;
const sequelize_1 = require("sequelize");
exports.UserDefinition = {
    name: 'user',
    attributes: {
        id: {
            primaryKey: true,
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
        },
        user_type: {
            type: sequelize_1.DataTypes.ENUM('b', 'u'),
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
        },
        full_address: {
            type: sequelize_1.DataTypes.STRING,
        },
        address_province: {
            type: sequelize_1.DataTypes.CHAR(2),
        },
        address_regency: {
            type: sequelize_1.DataTypes.CHAR(4),
        },
        address_district: {
            type: sequelize_1.DataTypes.CHAR(7),
        },
        address_village: {
            type: sequelize_1.DataTypes.CHAR(10),
        },
        telephone: {
            type: sequelize_1.DataTypes.STRING,
        },
        profile_image: {
            type: sequelize_1.DataTypes.STRING,
        },
        pus_id: {
            type: sequelize_1.DataTypes.INTEGER,
        },
    },
    options: {
        timestamps: false,
    },
};
