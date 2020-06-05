"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictDefinition = exports.District = void 0;
const sequelize_1 = require("sequelize");
const reg_village_1 = require("./reg-village");
class District extends sequelize_1.Model {
}
exports.District = District;
exports.DistrictDefinition = {
    name: 'District',
    attributes: {
        id: {
            type: sequelize_1.DataTypes.CHAR(7),
            primaryKey: true,
        },
        name: sequelize_1.DataTypes.STRING,
        regency_id: sequelize_1.DataTypes.CHAR(4),
    },
    options: {
        timestamps: false,
        tableName: 'reg_districts',
    },
    run(sequelize) {
        District.init(this.attributes, Object.assign({ modelName: this.name, sequelize }, this.options));
    },
    runAfter(sequelize) {
        District.hasMany(reg_village_1.Village, {
            sourceKey: 'id',
            foreignKey: 'district_id',
            as: 'villages',
        });
    },
};
