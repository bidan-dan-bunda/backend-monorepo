"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvinceDefinition = exports.Province = void 0;
const sequelize_1 = require("sequelize");
const reg_regency_1 = require("./reg-regency");
class Province extends sequelize_1.Model {
}
exports.Province = Province;
exports.ProvinceDefinition = {
    name: 'Province',
    attributes: {
        id: {
            type: sequelize_1.DataTypes.CHAR(2),
            primaryKey: true,
        },
        name: sequelize_1.DataTypes.STRING,
    },
    options: {
        timestamps: false,
        tableName: 'reg_provinces',
    },
    run(sequelize) {
        Province.init(this.attributes, Object.assign({ modelName: this.name, sequelize }, this.options));
    },
    runAfter(sequelize) {
        Province.hasMany(reg_regency_1.Regency, {
            sourceKey: 'id',
            foreignKey: 'province_id',
            as: 'regencies',
        });
    },
};
