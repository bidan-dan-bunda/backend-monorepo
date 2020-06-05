"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VillageDefinition = exports.Village = void 0;
const sequelize_1 = require("sequelize");
class Village extends sequelize_1.Model {
}
exports.Village = Village;
exports.VillageDefinition = {
    name: 'Village',
    attributes: {
        id: {
            type: sequelize_1.DataTypes.CHAR(10),
            primaryKey: true,
        },
        name: sequelize_1.DataTypes.STRING,
    },
    options: {
        timestamps: false,
        tableName: 'reg_villages',
    },
    run(sequelize) {
        Village.init(this.attributes, Object.assign({ modelName: this.name, sequelize }, this.options));
    },
};
