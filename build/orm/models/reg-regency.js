"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegencyDefinition = exports.Regency = void 0;
const sequelize_1 = require("sequelize");
const reg_district_1 = require("./reg-district");
class Regency extends sequelize_1.Model {
}
exports.Regency = Regency;
exports.RegencyDefinition = {
    name: 'Regency',
    attributes: {
        id: {
            type: sequelize_1.DataTypes.CHAR(4),
            primaryKey: true,
        },
        name: sequelize_1.DataTypes.STRING,
        province_id: sequelize_1.DataTypes.CHAR(4),
    },
    options: {
        timestamps: false,
        tableName: 'reg_regencies',
    },
    run(sequelize) {
        Regency.init(this.attributes, Object.assign({ modelName: this.name, sequelize }, this.options));
    },
    runAfter(sequelize) {
        Regency.hasMany(reg_district_1.District, {
            sourceKey: 'id',
            foreignKey: 'regency_id',
            as: 'districts',
        });
    },
};
